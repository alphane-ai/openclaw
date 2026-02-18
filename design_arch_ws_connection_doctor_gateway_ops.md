# design_arch_ws_connection_doctor_gateway_ops

研究日期：2026-02-16  
研究范围：

- `src/gateway/server/ws-connection/message-handler.ts`
- `src/gateway/server/ws-connection.ts`
- `src/gateway/server/ws-connection/auth-messages.ts`
- `src/commands/doctor-gateway-health.ts`
- `src/commands/doctor-gateway-services.ts`

本批状态：已完成（5/5）

## 1. 模块职责定位

这批覆盖 Gateway 连接入口和 doctor 的网关运行修复链路：

- `ws-connection.ts`：每条 WebSocket 连接生命周期外层（open/close/timer/log）+ 消息处理器挂载。
- `message-handler.ts`：握手、鉴权、设备签名校验、pairing 升级、`hello-ok` 响应与后续 RPC 分发。
- `auth-messages.ts`：统一网关鉴权失败提示文案（CLI vs Control UI/Webchat 差异化）。
- `doctor-gateway-health.ts`：doctor 阶段的网关健康检查与 channel probe 问题归集。
- `doctor-gateway-services.ts`：doctor 阶段的本地 gateway service 审计、修复与遗留服务清理。

## 2. 文件级研究结论

## 2.1 `src/gateway/server/ws-connection.ts`

职责：连接层 orchestration，负责把一条裸 WS 连接提升为可握手可路由的网关连接。

核心行为：

- 连接建立时立即下发 `connect.challenge`（nonce）并设置 handshake timeout，见 `src/gateway/server/ws-connection.ts:161`、`src/gateway/server/ws-connection.ts:265`。
- 统一清洗日志字段（control chars/format chars/过长头），降低日志污染风险，见 `src/gateway/server/ws-connection.ts:25`。
- 断连时处理：
  - presence 下线广播；
  - node 连接则触发 `nodeRegistry.unregister` + `nodeUnsubscribeAll`；
  - 打印 close 事件日志元信息。
  见 `src/gateway/server/ws-connection.ts:228`、`src/gateway/server/ws-connection.ts:243`。
- 将具体消息处理委托给 `attachGatewayWsMessageHandler`，见 `src/gateway/server/ws-connection.ts:277`。

风险评估：`medium`

- 连接关闭路径承担大量清理责任；若后续新增状态资源未接入 close 流程，容易出现“逻辑断开但状态残留”。

## 2.2 `src/gateway/server/ws-connection/message-handler.ts`

职责：处理握手前后所有 WS message，执行 auth/device/pairing 策略并路由 RPC。

核心行为（握手阶段）：

- 首帧必须是 `connect` 请求，且 params 必须通过 schema；否则返回 `INVALID_REQUEST` 并关闭，见 `src/gateway/server/ws-connection/message-handler.ts:203`。
- 协议版本协商失败（`min/maxProtocol` 不覆盖当前协议）直接拒绝，见 `src/gateway/server/ws-connection/message-handler.ts:249`。
- 角色仅允许 `operator|node`，见 `src/gateway/server/ws-connection/message-handler.ts:277`。
- Control UI/Webchat 连接执行 origin 校验，见 `src/gateway/server/ws-connection/message-handler.ts:304`。
- 鉴权分层：
  - 共享 token/password（可 tailscale）；
  - 设备 token 路径（单独 rate-limit scope）；
  - 两者失败时统一走 `formatGatewayAuthFailureMessage`。
  见 `src/gateway/server/ws-connection/message-handler.ts:349`、`src/gateway/server/ws-connection/message-handler.ts:618`、`src/gateway/server/ws-connection/message-handler.ts:405`。
- 设备身份校验：
  - deviceId 与公钥派生一致；
  - 签名时钟偏差限制；
  - 非 local 连接强制 nonce；
  - 签名 payload 支持 legacy loopback 兼容。
  见 `src/gateway/server/ws-connection/message-handler.ts:479`、`src/gateway/server/ws-connection/message-handler.ts:496`、`src/gateway/server/ws-connection/message-handler.ts:516`、`src/gateway/server/ws-connection/message-handler.ts:577`。
- pairing 策略：
  - 未配对、角色升级、scope 升级都会触发 pairing request；
  - silent pairing 可自动 approve；
  - 非 silent 返回 `NOT_PAIRED` + requestId。
  见 `src/gateway/server/ws-connection/message-handler.ts:654`。

核心行为（握手成功后）：

- `node` 连接会过滤 declared commands 到 allowlist，再注册 node session；
- 更新 paired node metadata，刷新 remote skills，向 node 下发 `voicewake.changed`；
- 返回 `hello-ok`（含 snapshot/features/policy/device token）。
见 `src/gateway/server/ws-connection/message-handler.ts:767`、`src/gateway/server/ws-connection/message-handler.ts:865`、`src/gateway/server/ws-connection/message-handler.ts:827`。

握手后请求分发：

- 仅接受合法 request frame，最终调用 `handleGatewayRequest`。
见 `src/gateway/server/ws-connection/message-handler.ts:928`、`src/gateway/server/ws-connection/message-handler.ts:962`。

风险评估：`high`

- 该文件同时承载 auth、安全、pairing、presence、node 启动副作用，分支密度非常高；小改动容易引发跨场景回归（CLI、Control UI、node host）。

## 2.3 `src/gateway/server/ws-connection/auth-messages.ts`

职责：根据 `authMode/authProvided/reason/client` 生成可执行的鉴权错误文案。

核心行为：

- 对 token/password 缺失或不匹配给出客户端特定 hint：
  - CLI：提示设置 `gateway.remote.token/password`；
  - Control UI/Webchat：提示在 Control UI settings 输入凭据。
  见 `src/gateway/server/ws-connection/auth-messages.ts:18`、`src/gateway/server/ws-connection/auth-messages.ts:23`。
- 覆盖 tailscale、rate limit、device token mismatch 等专用 reason，见 `src/gateway/server/ws-connection/auth-messages.ts:41`。
- `message-handler.ts` 的 unauthorized 分支统一调用本模块，见 `src/gateway/server/ws-connection/message-handler.ts:405`。

风险评估：`low`

- 逻辑简单，但属于 UX 关键文案层；错误提示退化会直接影响故障定位效率。

## 2.4 `src/commands/doctor-gateway-health.ts`

职责：doctor 流程里的网关可达性 + channels probe 汇总。

核心行为：

- 优先执行 `healthCommand`（默认 10s，非交互场景可更短），见 `src/commands/doctor-gateway-health.ts:15`。
- 若报 `gateway closed`，输出 “Gateway not running” + 连接详情提示；其他错误走 `formatHealthCheckFailure`，见 `src/commands/doctor-gateway-health.ts:23`。
- health 成功后额外调用 `channels.status`（probe），把插件收集到的问题聚合成 “Channel warnings”，见 `src/commands/doctor-gateway-health.ts:33`。
- 返回 `{ healthOk }` 供后续 daemon 修复决策使用，见 `src/commands/doctor-gateway-health.ts:57`。

风险评估：`medium`

- 依赖网关 RPC 与各 channel plugin 的 issue collector；若某插件结构变化，告警展示可能失真但不会中断 doctor 主流程。

## 2.5 `src/commands/doctor-gateway-services.ts`

职责：doctor 流程里的本地服务审计和修复入口（仅 local mode，且非 Nix）。

核心行为：

- `maybeRepairGatewayServiceConfig`：
  - Nix/remote 模式直接跳过；
  - 读取当前 service command；
  - 使用 `auditGatewayServiceConfig` 判定问题（runtime、PATH、launchd/systemd 字段等）；
  - 可检测 Bun 或 version-manager Node，并尝试迁移到系统 Node；
  - 根据 issue level 决定普通确认或 aggressive 覆盖确认；
  - 最终调用 `service.install(...)` 写入推荐配置。
  见 `src/commands/doctor-gateway-services.ts:91`、`src/daemon/service-audit.ts:340`。
- `maybeScanExtraGatewayServices`：
  - 扫描额外 gateway-like 服务（含 legacy clawdbot/moltbot）；
  - 对可处理的 darwin/user legacy launchd 项执行 bootout/unload + plist 移入 Trash；
  - 输出 cleanup hints 与单机单 gateway 建议。
  见 `src/commands/doctor-gateway-services.ts:212`、`src/commands/doctor-gateway-services.ts:61`、`src/daemon/inspect.ts:297`。

在 doctor 主流程的位置：

- state/sandbox 检查后执行 service 扫描与修复，health check 之前，见 `src/commands/doctor.ts:191`。

风险评估：`medium`

- 涉及跨平台服务管理和本机环境差异，且包含交互分支；最容易在“平台特定路径 + 非交互模式”出现边界回归。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/server.auth.e2e.test.ts src/gateway/server.models-voicewake-misc.e2e.test.ts src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts src/commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.e2e.test.ts src/commands/doctor.warns-state-directory-is-missing.e2e.test.ts`
  - 45/45 通过。

关键覆盖点：

- WS 握手与鉴权主路径：
  - 握手返回 `hello-ok`，见 `src/gateway/server.auth.e2e.test.ts:137`。
  - `connect.challenge` 下发，见 `src/gateway/server.auth.e2e.test.ts:329`。
  - 协议不匹配拒绝，见 `src/gateway/server.auth.e2e.test.ts:342`。
  - 非本地 host 缺少 nonce 拒绝，见 `src/gateway/server.auth.e2e.test.ts:367`。
  - device signature 校验失败拒绝，见 `src/gateway/server.auth.e2e.test.ts:265`。
  - Control UI 缺 token 文案提示命中 Control UI settings（间接覆盖 `auth-messages.ts`），见 `src/gateway/server.auth.e2e.test.ts:488`。
- node 连接后事件下发链路：
  - node connect 后接收 `voicewake.changed`，见 `src/gateway/server.models-voicewake-misc.e2e.test.ts:170`。
- doctor 网关流程触达：
  - non-interactive 下 health 失败不触发 restart（`gateway closed` 场景），见 `src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts:33`。
  - doctor 流程可执行“legacy gateway services migration skip”相关分支（service install 未触发），见 `src/commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.e2e.test.ts:61`。

已知覆盖缺口：

- `auth-messages.ts` 无独立单测，当前主要由 `server.auth.e2e` 间接覆盖。
- `doctor-gateway-health.ts` 和 `doctor-gateway-services.ts` 目前以 doctor 集成测试触达为主，缺少模块级直测。

## 4. 本批完成文件

- `src/gateway/server/ws-connection/message-handler.ts`
- `src/gateway/server/ws-connection.ts`
- `src/gateway/server/ws-connection/auth-messages.ts`
- `src/commands/doctor-gateway-health.ts`
- `src/commands/doctor-gateway-services.ts`

## 5. 下一批建议

继续沿“鉴权/网络边界 + doctor 网关修复”的近邻模块：

1. `src/gateway/auth.ts`
2. `src/gateway/net.ts`
3. `src/commands/doctor-gateway-daemon-flow.ts`
