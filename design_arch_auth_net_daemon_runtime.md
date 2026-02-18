# design_arch_auth_net_daemon_runtime

研究日期：2026-02-16  
研究范围：

- `src/gateway/auth.ts`
- `src/gateway/net.ts`
- `src/gateway/server-runtime-config.ts`
- `src/gateway/http-auth-helpers.ts`
- `src/commands/doctor-gateway-daemon-flow.ts`

本批状态：已完成（5/5）

## 1. 模块职责定位

这批是“网关鉴权/网络边界 + 运行时启动约束 + doctor daemon 修复”的一条链路：

- `auth.ts`：网关连接鉴权策略中枢（token/password/tailscale/trusted-proxy + rate-limit）。
- `net.ts`：IP/Host 归一化、trusted proxy 识别、bind host 决策与 loopback 判定。
- `server-runtime-config.ts`：网关启动前的最终配置解析与安全约束校验。
- `http-auth-helpers.ts`：HTTP Bearer 请求复用网关鉴权逻辑的薄封装。
- `doctor-gateway-daemon-flow.ts`：doctor 中“网关不健康时”的服务修复与重启决策流程。

## 2. 文件级研究结论

## 2.1 `src/gateway/auth.ts`

职责：统一提供网关鉴权能力，服务 WS/HTTP 等入口。

核心行为：

- `resolveGatewayAuth`：
  - 按 `authConfig + env` 解析 mode/token/password；
  - 支持 tailscale serve 场景自动推导 `allowTailscale`。
  见 `src/gateway/auth.ts:179`。
- `isLocalDirectRequest`：
  - 结合 host、forwarded headers、trusted proxy 判定“是否本地直连”；
  - 避免错误把反向代理流量当成本地请求。
  见 `src/gateway/auth.ts:87`。
- `authorizeGatewayConnect`：
  - 支持 `token/password/trusted-proxy/tailscale`；
  - 带可插拔 `rateLimiter` 与 scope（默认 `shared-secret`）；
  - 对 trusted-proxy 有独立 header/allowUsers 校验；
  - 鉴权失败返回结构化 reason（供上层文案映射）。
  见 `src/gateway/auth.ts:283`。
- `assertGatewayAuthConfigured`：
  - 在启动阶段强约束 mode 对应的必填配置（token/password/trusted-proxy userHeader）。
  见 `src/gateway/auth.ts:214`。

主要调用点：

- WS 握手：`src/gateway/server/ws-connection/message-handler.ts:349`
- HTTP 鉴权：`src/gateway/server-http.ts:124`
- runtime config 启动校验：`src/gateway/server-runtime-config.ts:73`
- HTTP helper：`src/gateway/http-auth-helpers.ts:15`

风险评估：`medium`

- 该文件是多入口复用的安全边界；reason 语义和 rate-limit scope 变更会连锁影响 WS/HTTP/Control UI 行为。

## 2.2 `src/gateway/net.ts`

职责：提供网关网络边界判断与地址解析基础能力。

核心行为：

- `isTrustedProxyAddress`：
  - 支持精确 IP + IPv4 CIDR；
  - 兼容 IPv4-mapped IPv6。
  见 `src/gateway/net.ts:206`。
- `resolveGatewayClientIp`：
  - remote 非 trusted proxy 时直接用 remote；
  - trusted proxy 时优先 `X-Forwarded-For`，再 `X-Real-IP`。
  见 `src/gateway/net.ts:222`。
- `resolveGatewayBindHost`：
  - 按 `bind` 模式（loopback/lan/tailnet/custom/auto）选择监听 host；
  - 含 `canBindToHost` fallback。
  见 `src/gateway/net.ts:269`。
- `isPrivateOrLoopbackAddress` / `isLoopbackHost`：
  - 用于 canvas fallback 与启动安全判断（含 CGNAT、ULA、link-local）。
  见 `src/gateway/net.ts:70`、`src/gateway/net.ts:379`。

风险评估：`medium`

- CIDR、forwarded header、IPv4-mapped IPv6 是高回归点；一旦处理错误会直接破坏真实客户端 IP 判定与 trust boundary。

## 2.3 `src/gateway/server-runtime-config.ts`

职责：将 `loadConfig` 与 runtime overrides 合成网关“可启动配置”，并做启动前 fail-fast 校验。

核心行为：

- 解析 bind/auth/tailscale/http endpoint/control UI basePath/canvasHost；
- 调 `resolveGatewayAuth` + `assertGatewayAuthConfigured`；
- 核心安全约束：
  - tailscale funnel 必须 password mode；
  - tailscale serve/funnel 必须 loopback bind；
  - 非 loopback 且无 shared secret（且非 trusted-proxy）直接拒绝启动；
  - trusted-proxy 禁止 loopback bind，且要求 `gateway.trustedProxies` 非空。
  见 `src/gateway/server-runtime-config.ts:32`、`src/gateway/server-runtime-config.ts:90`。

风险评估：`low-medium`

- 逻辑集中且有明确报错；主要风险来自新 auth mode 或 bind mode 扩展时漏加约束。

## 2.4 `src/gateway/http-auth-helpers.ts`

职责：把 HTTP `Authorization: Bearer` 路径接入统一 gateway auth。

核心行为：

- 提取 bearer token 后调用 `authorizeGatewayConnect`；
- 若失败，调用 `sendGatewayAuthFailure` 返回统一 HTTP 错误（401/429 等）；
- 成功返回 `true` 由上游 endpoint 继续处理。
见 `src/gateway/http-auth-helpers.ts:7`。

关联调用链：

- `handleGatewayPostJsonEndpoint` 调此 helper，见 `src/gateway/http-endpoint-helpers.ts:28`。
- 进一步服务于 plugin/canvas 等 HTTP/upgrade 鉴权路径（经 server-http 组合）。

风险评估：`low`

- 本身是薄封装；风险主要由其调用栈（auth reason 到 HTTP status 映射）承担。

## 2.5 `src/commands/doctor-gateway-daemon-flow.ts`

职责：doctor 在 `healthOk=false` 时，执行 gateway daemon 层面的修复/安装/重启逻辑。

核心行为：

- 入口 `maybeRepairGatewayDaemon`：
  - 若 health 已正常直接返回；
  - 检查 service `isLoaded/readRuntime`，macOS 下先尝试 launch agent bootstrap 修复；
  - 端口占用/last error 提示；
  - 未安装服务时可交互安装（含 runtime 选择 + install plan）；
  - 已安装但未运行可启动，已运行可重启并复检 health。
  见 `src/commands/doctor-gateway-daemon-flow.ts:88`。
- Linux systemd 不可用时给出专门提示（含 WSL 分支），见 `src/commands/doctor-gateway-daemon-flow.ts:151`。
- 在 doctor 主流程中由 `checkGatewayHealth` 结果驱动，见 `src/commands/doctor.ts:270`、`src/commands/doctor.ts:275`。

风险评估：`medium`

- 高度依赖平台服务实现（launchd/systemd）与交互态行为，非交互模式分支容易在边界条件下行为偏差。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/auth.test.ts src/gateway/net.test.ts src/gateway/server-runtime-config.test.ts src/gateway/http-endpoint-helpers.test.ts src/gateway/server.plugin-http-auth.test.ts`
  - 57/57 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/server.canvas-auth.e2e.test.ts`
  - 2/2 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts src/commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.e2e.test.ts src/commands/doctor.warns-state-directory-is-missing.e2e.test.ts`
  - 10/10 通过。

关键覆盖点：

- `auth.ts`：
  - token/password 缺失与 mismatch reason，见 `src/gateway/auth.test.ts:63`。
  - tailscale 身份通过 token mode，见 `src/gateway/auth.test.ts:127`。
  - trusted-proxy user header/required headers/allowUsers 校验，见 `src/gateway/auth.test.ts:185`。
- `net.ts`：
  - trusted proxy CIDR 与兼容场景，见 `src/gateway/net.test.ts:27`。
  - private/loopback 地址族判定，见 `src/gateway/net.test.ts:183`。
- `server-runtime-config.ts`：
  - trusted-proxy + bind 约束、token 配置要求，见 `src/gateway/server-runtime-config.test.ts:10`。
- `http-auth-helpers.ts`（集成）：
  - plugin HTTP 路由 Bearer 鉴权边界（401->200），见 `src/gateway/server.plugin-http-auth.test.ts:99`。
  - canvas HTTP/WS auth + rate-limit（401/429）路径，见 `src/gateway/server.canvas-auth.e2e.test.ts:83`。
- `doctor-gateway-daemon-flow.ts`（经 doctor 主流程）：
  - non-interactive 下 health `gateway closed` 时不触发 restart，见 `src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts:33`。

已知覆盖缺口：

- `doctor-gateway-daemon-flow.ts` 当前无独立单测文件，主要通过 doctor 集成 e2e 间接覆盖。

## 4. 本批完成文件

- `src/gateway/auth.ts`
- `src/gateway/net.ts`
- `src/gateway/server-runtime-config.ts`
- `src/gateway/http-auth-helpers.ts`
- `src/commands/doctor-gateway-daemon-flow.ts`

## 5. 下一批建议

继续沿“auth/net 入口 + doctor 安全链路”近邻推进：

1. `src/gateway/server-http.ts`
2. `src/gateway/http-common.ts`
3. `src/gateway/http-utils.ts`
4. `src/commands/doctor-security.ts`
5. `src/commands/health-format.ts`
