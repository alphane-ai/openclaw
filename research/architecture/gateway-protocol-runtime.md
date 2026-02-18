# Gateway Protocol 与 Runtime 契约研究（2026-02-17）

## 覆盖范围
本轮覆盖协议与 runtime 关联未研究文件（28 个）：

- `src/gateway/control-ui-contract.ts`
- `src/gateway/protocol/client-info.ts`
- `src/gateway/protocol/index.test.ts`
- `src/gateway/protocol/index.ts`
- `src/gateway/protocol/schema.ts`
- `src/gateway/protocol/schema/agent.ts`
- `src/gateway/protocol/schema/agents-models-skills.ts`
- `src/gateway/protocol/schema/channels.ts`
- `src/gateway/protocol/schema/config.ts`
- `src/gateway/protocol/schema/cron.ts`
- `src/gateway/protocol/schema/devices.ts`
- `src/gateway/protocol/schema/error-codes.ts`
- `src/gateway/protocol/schema/exec-approvals.ts`
- `src/gateway/protocol/schema/frames.ts`
- `src/gateway/protocol/schema/logs-chat.ts`
- `src/gateway/protocol/schema/nodes.ts`
- `src/gateway/protocol/schema/primitives.ts`
- `src/gateway/protocol/schema/protocol-schemas.ts`
- `src/gateway/protocol/schema/sessions.ts`
- `src/gateway/protocol/schema/snapshot.ts`
- `src/gateway/protocol/schema/types.ts`
- `src/gateway/protocol/schema/wizard.ts`
- `src/gateway/server-constants.ts`
- `src/gateway/server-methods-list.ts`
- `src/gateway/server-methods.ts`
- `src/gateway/server-runtime-state.ts`
- `src/gateway/server-shared.ts`
- `src/gateway/server-ws-runtime.ts`

## 协议层结论（`src/gateway/protocol/*`）
- `schema/*` 按领域拆分（agent/channels/config/cron/devices/exec-approvals/logs-chat/nodes/sessions/wizard），统一在 `schema.ts` 和 `index.ts` 聚合。
- 协议对象普遍收紧 `additionalProperties`，以降低客户端与服务端字段漂移风险。
- `frames.ts` 定义 connect/request/response/event/tick/shutdown 的判别联合，是 WS 帧协议的核心边界。
- `error-codes.ts` + `formatValidationErrors` 提供统一错误形态，减少调用端处理分歧。

## Runtime 边界结论
- `server-methods-list.ts` 定义基础 methods/events，并动态并入 channel plugin 的 `gatewayMethods`。
- `server-methods.ts` 负责 method 级授权（role + scope），再将请求分发给 `coreGatewayHandlers` 与扩展 handlers。
- `server-runtime-state.ts` 负责启动态组装：HTTP server(s)、WS server、upgrade handler、broadcast、chat run state、dedupe cache、canvas host。
- `server-ws-runtime.ts` 将 runtime state 与 `attachGatewayWsConnectionHandler` 连接，形成 WS 入口。
- `server-constants.ts` 集中 payload、缓冲、握手超时、tick、health refresh、dedupe TTL 等系统阈值。
- `server-shared.ts` 提供 dedupe entry 的共享类型定义。
- `control-ui-contract.ts` 作为 control UI 契约占位，和协议层并行演进。

## 关键调用链
1. WS 连接 -> `attachGatewayWsHandlers` -> 帧解析/鉴权 -> `handleGatewayRequest` -> 对应 `server-methods/*`。
2. `handleGatewayRequest` -> `authorizeGatewayMethod`（role/scope）-> core/extra handler -> response/error shape。
3. gateway 启动 -> `createGatewayRuntimeState` -> HTTP/Upgrade/WS 装配 -> broadcast 与 chat state 初始化。
4. method 能力声明 -> `listGatewayMethods`（基础 + plugin）-> connect features 下发给客户端。

## 风险与关注点
- method 列表、授权规则、具体 handler 三处需要严格同步；新增方法若漏任一处会造成“可见不可用”或越权风险。
- `channels.status` 等扩展友好 schema 存在 `unknown` 容忍度，插件升级时要同步约定，避免前端解释歧义。
- dedupe/缓冲/payload 阈值为常量驱动，需结合真实负载验证默认值，防止大 payload 或慢连接导致堆积。

## 与已研究模块关系
- 与已研究 `src/gateway/server/ws-connection/*` 形成上下游：前者定义契约与运行态，后者执行连接期交互与消息生命周期。
- 与已研究 `src/commands/doctor-*`：health/status/config/exec approvals 的 RPC 能力由本层暴露并被 CLI 调用。
