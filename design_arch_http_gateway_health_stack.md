# design_arch_http_gateway_health_stack

研究日期：2026-02-16  
研究范围：

- `src/gateway/server-http.ts`
- `src/gateway/http-common.ts`
- `src/gateway/http-utils.ts`
- `src/gateway/http-endpoint-helpers.ts`
- `src/gateway/openai-http.ts`
- `src/gateway/openresponses-http.ts`
- `src/commands/doctor-security.ts`
- `src/commands/health-format.ts`
- `src/commands/health.ts`
- `src/gateway/http-endpoint-helpers.test.ts`

本批状态：已完成（10/10）

## 1. 模块职责定位

这一批是网关 HTTP 接入面与健康/安全可观测面的同一条链路：

- `server-http.ts`：网关 HTTP/WS 总入口路由与鉴权编排。
- `http-common.ts` + `http-utils.ts` + `http-endpoint-helpers.ts`：HTTP 端点通用基建（鉴权、读 body、统一错误响应、agent/session 归一化）。
- `openai-http.ts` + `openresponses-http.ts`：两套兼容 API（`/v1/chat/completions` 与 `/v1/responses`）到 `agentCommand` 的适配层。
- `doctor-security.ts`：doctor 安全告警聚合（网关暴露面 + 各通道 DM 策略）。
- `health.ts` + `health-format.ts`：健康快照采集 + CLI 输出格式化。
- `http-endpoint-helpers.test.ts`：验证端点公共 helper 的行为边界。

## 2. 文件级研究结论

## 2.1 `src/gateway/server-http.ts`

职责：网关 HTTP 请求分发枢纽与升级握手入口。

核心逻辑：

- `createGatewayHttpServer` 按顺序分发请求：hooks -> tools invoke -> slack -> plugin -> openresponses -> openai -> canvas/a2ui -> control-ui -> 404。见 `src/gateway/server-http.ts:438`。
- `/api/channels/*` 插件路由默认套 gateway auth（Bearer + rate limit），非 channel 插件路由由插件自行保证鉴权。见 `src/gateway/server-http.ts:498`。
- canvas HTTP/WS 访问额外走 `authorizeCanvasRequest`：
  - 本地直连直接通过；
  - 否则先尝试 Bearer；
  - 再做“私网/loopback + 已授权 WS 客户端同 IP”回退。见 `src/gateway/server-http.ts:109`。
- hooks 子系统内建 token 失败限流窗口，防爆破：60 秒窗口内超过阈值返回 429，并带 `Retry-After`。见 `src/gateway/server-http.ts:195`。
- `attachGatewayUpgradeHandler` 处理 WS upgrade，并对 canvas WS 路径执行同样鉴权。见 `src/gateway/server-http.ts:600`。

风险评估：`medium`

- 请求链路顺序变更会直接影响端点优先级与鉴权覆盖；canvas 的“IP 回退策略”属于安全敏感点。

## 2.2 `src/gateway/http-common.ts`

职责：HTTP 返回与 body 读取的统一基础工具。

核心逻辑：

- 统一 JSON/text/error 结构：`sendJson`、`sendUnauthorized`、`sendRateLimited`、`sendInvalidRequest`。见 `src/gateway/http-common.ts:5`。
- `sendGatewayAuthFailure` 把 auth 结果映射到 401/429。见 `src/gateway/http-common.ts:40`。
- `readJsonBodyOrError` 统一将 body 错误映射为 413/408/400，避免端点重复实现。见 `src/gateway/http-common.ts:54`。
- SSE 通用辅助：`setSseHeaders` + `writeDone`。见 `src/gateway/http-common.ts:79`。

风险评估：`low`

- 属于纯基础库，风险主要来自响应约定变化对上层兼容性的影响。

## 2.3 `src/gateway/http-utils.ts`

职责：从 HTTP 请求提取鉴权与会话上下文。

核心逻辑：

- `getBearerToken` 从 `Authorization: Bearer ...` 提取 token。见 `src/gateway/http-utils.ts:16`。
- agent 选择优先级：Header (`x-openclaw-agent-id` / `x-openclaw-agent`) > model (`openclaw:<agent>` / `agent:<agent>`) > `main`。见 `src/gateway/http-utils.ts:52`。
- `resolveSessionKey` 优先使用显式 header session key；否则基于 `prefix + user/randomUUID` 生成，并包裹 agent main session key。见 `src/gateway/http-utils.ts:65`。

风险评估：`low-medium`

- 属于多端点共享逻辑，任何 agent/model 解析规则变化都会同时影响 OpenAI/OpenResponses 请求分流。

## 2.4 `src/gateway/http-endpoint-helpers.ts`

职责：POST+JSON+Bearer 鉴权型端点的标准入口模板。

核心逻辑：

- `handleGatewayPostJsonEndpoint` 一次处理 pathname 检查、方法检查、Bearer 鉴权、JSON body 解析，并返回三态：
  - `false`：路径不匹配（让下个 handler 继续）
  - `undefined`：已处理失败响应
  - `{ body }`：可进入业务逻辑
  见 `src/gateway/http-endpoint-helpers.ts:7`。

风险评估：`low`

- 该 helper 是 endpoint 防呆关键点，行为稳定性由测试文件保障。

## 2.5 `src/gateway/openai-http.ts`

职责：实现 OpenAI Chat Completions 兼容层。

核心逻辑：

- 端点固定 `/v1/chat/completions`，先走公共 helper 处理 method/auth/body。见 `src/gateway/openai-http.ts:144`。
- `buildAgentPrompt` 将 OpenAI messages 转换为内部对话串：
  - `system/developer` 合并进 `extraSystemPrompt`；
  - user/assistant/tool 归一化进 conversation entries。见 `src/gateway/openai-http.ts:77`。
- 非流式：调用 `agentCommand`，将 payload 聚合回 OpenAI completion JSON。见 `src/gateway/openai-http.ts:178`。
- 流式：监听 `agent-events`，发 chat.completion.chunk；若无增量事件则回退一次性内容输出。见 `src/gateway/openai-http.ts:233`。

风险评估：`medium`

- 兼容层对外协议固定，delta 事件与 fallback 逻辑必须保持稳定，否则会影响第三方 SDK 行为。

## 2.6 `src/gateway/openresponses-http.ts`

职责：实现 OpenResponses `/v1/responses`，并支持 tool-call / multimodal 输入。

核心逻辑：

- 请求体先用 `CreateResponseBodySchema` 做 schema 校验。见 `src/gateway/openresponses-http.ts:375`。
- 输入处理支持 `input_image` / `input_file`：
  - base64/url 两种 source；
  - URL 数量总上限 `maxUrlParts`；
  - 文件/图片 mimes、大小、重定向、超时、PDF 限制全部可配置。见 `src/gateway/openresponses-http.ts:107` 与 `src/gateway/openresponses-http.ts:394`。
- `tool_choice` 支持 `none/required/function(name)`，并可注入“必须调工具”的 system prompt 约束。见 `src/gateway/openresponses-http.ts:147`。
- 非流式返回 `ResponseResource`：
  - 普通文本 -> `message/output_text`；
  - 若 agent 进入 `tool_calls`，返回 `function_call` 且 status=`incomplete`。见 `src/gateway/openresponses-http.ts:543`。
- 流式通过 SSE 发送 OpenResponses 事件族（`response.created`、`response.output_text.delta`、`response.completed` 等），并在 lifecycle end/error 时 finalize。见 `src/gateway/openresponses-http.ts:622`。

风险评估：`high-medium`

- 这里承担外部协议兼容 + 多模态输入安全边界（URL allowlist/限制），属于高变更风险模块。

## 2.7 `src/commands/doctor-security.ts`

职责：doctor 阶段输出安全告警摘要。

核心逻辑：

- 网关暴露检查：若 bind 非 loopback，且无有效 token/password，输出 `CRITICAL`；有凭据则输出 `WARNING`。见 `src/commands/doctor-security.ts:11`。
- 按 channel plugin 安全接口聚合 DM 策略告警：`open/disabled/allowlist` 场景分别提示；多 sender + `dmScope=main` 时建议改成隔离 session。见 `src/commands/doctor-security.ts:74`。
- 最后统一追加 `openclaw security audit --deep` 指引。见 `src/commands/doctor-security.ts:184`。

风险评估：`medium`

- 主要风险在策略文案与真实行为不一致（误导运维决策）。

## 2.8 `src/commands/health-format.ts`

职责：将 health 失败错误渲染为稳定可读文案。

核心逻辑：

- 非 rich 模式保持老格式：`Health check failed: ...`。
- rich 模式下把 `Gateway target/Source/Config` 等键值对抽出并缩进着色，避免单行过长难读。见 `src/commands/health-format.ts:21`。

风险评估：`low`

- 纯展示层；关键是不要破坏非 rich 输出的向后兼容。

## 2.9 `src/commands/health.ts`

职责：汇总全通道+多 agent 健康快照，并输出 JSON/文本。

核心逻辑：

- `getHealthSnapshot`：
  - 解析 agent 顺序与 default agent；
  - 计算每 agent 的 heartbeat 与 sessions 摘要；
  - 遍历所有 channel plugin 与账号，执行 `probeAccount`，聚合 `channels/accounts` 结构；
  - 失败 probe 转结构化 `{ ok:false, error }`，不抛异常中断全局快照。见 `src/commands/health.ts:348`。
- `formatHealthChannelLines`：对 linked/configured/probe 结果进行可读摘要，支持 `default` 与 `all` 账号视图。见 `src/commands/health.ts:248`。
- `healthCommand`：始终通过 gateway RPC `health` 查询，不直接连 provider；支持 `--json`、`--verbose`，并输出 agent/session/bindings 细节。见 `src/commands/health.ts:525`。

风险评估：`medium`

- 模块跨越“探测 + 汇总 + 展示”，分支多且依赖插件实现差异，是健康可观测主入口。

## 2.10 `src/gateway/http-endpoint-helpers.test.ts`

职责：锁定公共 helper 的三态返回契约与副作用行为。

覆盖点：

- path 不匹配返回 `false`；
- 非 POST 返回 `undefined` 且调用 `sendMethodNotAllowed`；
- auth 失败返回 `undefined`；
- auth + body 成功返回 `{ body }`。见 `src/gateway/http-endpoint-helpers.test.ts:22`。

风险评估：`low`

- 这是关键契约测试，能直接阻止 endpoint helper 行为回归。

## 3. 测试证据

本批执行：

- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor-security.e2e.test.ts src/commands/health.e2e.test.ts src/commands/health.snapshot.e2e.test.ts src/commands/health.command.coverage.e2e.test.ts src/gateway/openai-http.e2e.test.ts src/gateway/openresponses-http.e2e.test.ts src/gateway/openresponses-parity.e2e.test.ts`
  - 7 files, 40/40 tests 通过。
- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/http-endpoint-helpers.test.ts src/gateway/server-http.hooks-request-timeout.test.ts`
  - 2 files, 5/5 tests 通过。

关键覆盖结论：

- `doctor-security` 覆盖 exposed-without-auth、env token、空白 token、loopback 免告警、多 sender dmScope 提示。见 `src/commands/doctor-security.e2e.test.ts:45`。
- `health` 覆盖 JSON 输出、文本输出、多账号 probe timing、失败格式化。见 `src/commands/health.e2e.test.ts:23`。
- `getHealthSnapshot` 覆盖 telegram 未配置/已配置、tokenFile、探测错误、agent heartbeat disable。见 `src/commands/health.snapshot.e2e.test.ts:90`。
- `openai-http` 覆盖 disabled/validation/rate-limit/streaming。见 `src/gateway/openai-http.e2e.test.ts:69`。
- `openresponses-http` 覆盖 disabled、schema/stream、unsafe URL blocking、URL allowlist 与 URL part cap。见 `src/gateway/openresponses-http.e2e.test.ts:93`。
- `openresponses-parity` 覆盖 schema/tool/function_call_output 到 prompt 转换等协议对齐。见 `src/gateway/openresponses-parity.e2e.test.ts:10`。

已知覆盖缺口：

- `server-http.ts` 主路由顺序本身没有单独“大一统路由顺序”测试，当前主要通过各端点 e2e 间接覆盖。

## 4. 本批完成文件

- `src/gateway/server-http.ts`
- `src/gateway/http-common.ts`
- `src/gateway/http-utils.ts`
- `src/gateway/http-endpoint-helpers.ts`
- `src/gateway/openai-http.ts`
- `src/gateway/openresponses-http.ts`
- `src/commands/doctor-security.ts`
- `src/commands/health-format.ts`
- `src/commands/health.ts`
- `src/gateway/http-endpoint-helpers.test.ts`

## 5. 下一批建议

沿着同一链路继续，优先研究更靠近此批的网关 HTTP 近邻模块：

1. `src/gateway/tools-invoke-http.ts`
2. `src/gateway/server.plugin-http-auth.test.ts`
3. `src/gateway/server.canvas-auth.e2e.test.ts`
4. `src/commands/doctor-gateway-health.ts`（回看与本批 health/security 交汇处）
5. `src/gateway/hooks.ts`
