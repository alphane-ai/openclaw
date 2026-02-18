# design_arch_gateway_hooks_tools_http_plugins

研究日期：2026-02-17  
研究范围：

- `src/gateway/agent-event-assistant-text.ts`
- `src/gateway/agent-prompt.ts`
- `src/gateway/agent-prompt.e2e.test.ts`
- `src/gateway/open-responses.schema.ts`
- `src/gateway/openai-http.e2e.test.ts`
- `src/gateway/openresponses-http.e2e.test.ts`
- `src/gateway/openresponses-parity.e2e.test.ts`
- `src/gateway/hooks.ts`
- `src/gateway/hooks.test.ts`
- `src/gateway/hooks-mapping.ts`
- `src/gateway/hooks-mapping.test.ts`
- `src/gateway/tools-invoke-http.ts`
- `src/gateway/tools-invoke-http.test.ts`
- `src/gateway/server-http.hooks-request-timeout.test.ts`
- `src/gateway/server.plugin-http-auth.test.ts`
- `src/gateway/server.canvas-auth.e2e.test.ts`
- `src/gateway/server.hooks.e2e.test.ts`
- `src/gateway/server/hooks.ts`
- `src/gateway/server/plugins-http.ts`
- `src/gateway/server/plugins-http.test.ts`

本批状态：已完成（20/20）

## 1. 这批模块在系统中的位置

这批是上一批 `server-http/openai-http/openresponses-http` 的直接邻接层，主要补上了三类能力：

- Hooks 入站链路：配置解析、鉴权、payload 归一化、mapping 变换、agent/wake 分发。
- Tools HTTP 调用链路：`/tools/invoke` 的安全边界、工具策略收敛与执行错误分级。
- 兼容协议契约测试：OpenAI / OpenResponses 的外部协议行为与 schema 稳定性。

## 2. 功能性与基本实现逻辑

## 2.1 Prompt 与流式事件胶水

- `agent-event-assistant-text.ts`
  - 只做 assistant 事件文本提取：优先 `delta`，其次 `text`，都没有则空串。
  - 给 OpenAI/OpenResponses 流式输出复用，保证事件解析统一。

- `agent-prompt.ts`
  - `buildAgentMessageFromConversationEntries` 的关键规则：
    - 优先把最后一个 `user/tool` 当 current message（避免 assistant 上一条被误当当前输入）。
    - 其余条目转 history context；无历史时直接回传当前 body。
  - 这是 `openai-http.ts` 与 `openresponses-http.ts` 的提示词构建核心依赖。

- `agent-prompt.e2e.test.ts`
  - 锁定了“空输入/无历史/有历史/tool 优先”的行为契约。

## 2.2 OpenResponses 协议 schema

- `open-responses.schema.ts`
  - 以 Zod 定义完整协议面：
    - 输入 content part（`input_text/output_text/input_image/input_file`）
    - item param（`message/function_call/function_call_output/reasoning/item_reference`）
    - tool definition、tool_choice
    - response resource + streaming event type
  - 作用是把 OpenResponses 兼容层的请求/响应形状固定为可验证契约，防止实现漂移。

## 2.3 Hooks 入站管道

- `hooks.ts`
  - `resolveHooksConfig`：在启动侧收敛 hooks 配置，强约束 token/path/session policy。
  - `extractHookToken`：支持 `Authorization: Bearer` 与 `x-openclaw-token`。
  - `resolveHookSessionKey`：
    - 默认禁止 request 直接传 sessionKey（需 `allowRequestSessionKey=true`）。
    - 支持 prefix allowlist；默认 sessionKey 与自动生成 key 都要过 prefix 校验。
  - `normalizeWakePayload` / `normalizeAgentPayload`：输入清洗与强校验（message/channel/model 等）。
  - `resolveHookTargetAgentId` + `isHookAgentAllowed`：unknown agent 回退 default agent，显式路由受 allowedAgentIds 约束。

- `hooks-mapping.ts`
  - 支持 preset（如 gmail）与自定义 mappings。
  - 支持模板渲染（payload/header/query/path/now）+ transform module 动态加载。
  - 有路径收敛防护：transform module 必须在 transformsDir 内，防目录穿越。
  - `applyHookMappings` 按顺序匹配，支持 transform override；返回 `action/null(skipped)/error` 三态。

- `server/hooks.ts`
  - 把 hooks 请求桥接到 gateway runtime：
    - wake：写 system event，可触发 heartbeat now。
    - agent：封装成一次性 cron isolated turn，异步执行并回写结果事件。
  - 通过 `createHooksRequestHandler` 接入 HTTP 层。

- `server-http.hooks-request-timeout.test.ts`
  - 验证 request body timeout 映射为 408，而不是通用 400。

- `server.hooks.e2e.test.ts`
  - 覆盖 auth、wake、agent、query token 拒绝、invalid channel、空消息、bad json、session policy、agent allowlist、auth throttle/reset。

## 2.4 Tools Invoke HTTP

- `tools-invoke-http.ts`
  - 固定端点 `/tools/invoke`，POST only。
  - 先走 gateway auth，再读 body，必填 `tool`。
  - 会话键逻辑：`sessionKey` 缺失或 `main` 时解析为配置主会话键。
  - 工具可用性由多层策略合并：profile/provider/global/agent/group/subagent。
  - HTTP 专用 deny list 强制生效（默认禁高风险工具，除非 `gateway.tools.allow` 显式放开）。
  - 对工具参数支持 action 自动注入（仅在 schema 有 action 且 args 未给时）。
  - 错误分级：
    - `ToolInputError` -> 400
    - 其他执行异常 -> 500

- `tools-invoke-http.test.ts`
  - 覆盖调用成功、profile/alsoAllow、路由优先级、denylist、gateway tool allow/deny 优先级、main session key 回退、400/500 错误分级。

## 2.5 Plugin HTTP 边界

- `server/plugins-http.ts`
  - 先走 registry 的静态 `httpRoutes`（精确 path），后走通用 `httpHandlers`。
  - 任一 handler 抛错统一记日志并返回 500。

- `server/plugins-http.test.ts`
  - 覆盖空处理器、链式处理、route 优先于 handler、异常处理 500。

- `server.plugin-http-auth.test.ts`
  - 锁定安全边界：`/api/channels/*` 必须 gateway auth；非 channel plugin 路由可按插件自己的公开策略处理。

- `server.canvas-auth.e2e.test.ts`
  - 验证 canvas auth 回退策略：
    - 私网/CGNAT + 已授权 WS 同 IP 可回退通过；公网 IP 不能靠回退通过。
    - 多次失败可触发 429 + `Retry-After`（HTTP 与 WS upgrade 都覆盖）。

## 2.6 OpenAI/OpenResponses 兼容行为回归保护

- `openai-http.e2e.test.ts`
  - 覆盖 disabled 状态、method/auth、agentId 来源优先级、sessionKey 透传、history/system/developer/tool prompt 组装、stream chunk/fallback、auth rate-limit 429。

- `openresponses-http.e2e.test.ts`
  - 覆盖 disabled、schema 校验、tool_choice、input_file(base64)、usage 映射、stream 事件类型一致性、URL 输入安全阻断、allowlist 与 URL part cap。

- `openresponses-parity.e2e.test.ts`
  - 用 schema 与 prompt 断言保证 OpenResponses 协议关键能力（image/file/tool/function_call_output）与实现一致。

## 3. 测试证据

本批执行并通过：

- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/hooks.test.ts src/gateway/hooks-mapping.test.ts src/gateway/tools-invoke-http.test.ts src/gateway/server-http.hooks-request-timeout.test.ts src/gateway/server.plugin-http-auth.test.ts src/gateway/server/plugins-http.test.ts`
  - 6 files, 46/46 tests 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/openai-http.e2e.test.ts src/gateway/openresponses-http.e2e.test.ts src/gateway/openresponses-parity.e2e.test.ts src/gateway/server.canvas-auth.e2e.test.ts src/gateway/server.hooks.e2e.test.ts`
  - 5 files, 31/31 tests 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/agent-prompt.e2e.test.ts`
  - 1 file, 4/4 tests 通过。

合计：12 files，81/81 tests 通过。

## 4. 本批完成文件

- `src/gateway/agent-event-assistant-text.ts`
- `src/gateway/agent-prompt.ts`
- `src/gateway/agent-prompt.e2e.test.ts`
- `src/gateway/open-responses.schema.ts`
- `src/gateway/openai-http.e2e.test.ts`
- `src/gateway/openresponses-http.e2e.test.ts`
- `src/gateway/openresponses-parity.e2e.test.ts`
- `src/gateway/hooks.ts`
- `src/gateway/hooks.test.ts`
- `src/gateway/hooks-mapping.ts`
- `src/gateway/hooks-mapping.test.ts`
- `src/gateway/tools-invoke-http.ts`
- `src/gateway/tools-invoke-http.test.ts`
- `src/gateway/server-http.hooks-request-timeout.test.ts`
- `src/gateway/server.plugin-http-auth.test.ts`
- `src/gateway/server.canvas-auth.e2e.test.ts`
- `src/gateway/server.hooks.e2e.test.ts`
- `src/gateway/server/hooks.ts`
- `src/gateway/server/plugins-http.ts`
- `src/gateway/server/plugins-http.test.ts`

## 5. 下一批建议

继续按“HTTP ingress -> server 组合层 -> methods”向下游推进，优先：

1. `src/gateway/server/http-listen.ts`
2. `src/gateway/server.ts`
3. `src/gateway/server.impl.ts`
4. `src/gateway/server-methods.ts`
5. `src/gateway/server-methods-list.ts`
6. `src/gateway/server-methods/health.ts`
7. `src/gateway/server-methods/connect.ts`
8. `src/gateway/server-methods/chat.ts`
9. `src/gateway/server-methods/send.ts`
10. `src/gateway/server-methods/server-methods.test.ts`
