# design_arch_node_registry_exec_approvals_doctor_auth

研究日期：2026-02-16  
研究范围：

- `src/gateway/node-registry.ts`
- `src/gateway/server-methods/exec-approvals.ts`
- `src/commands/doctor-auth.ts`

本批状态：已完成（3/3）

## 1. 模块职责定位

这批是“节点远程执行闭环 + 执行审批配置面 + doctor 鉴权修复面”的组合层：

- `node-registry.ts`：维护在线 node 会话和 `node.invoke` 请求-响应配对状态。
- `exec-approvals.ts`：Gateway 的 `exec.approvals.*` RPC 处理器（本地文件 + 远端 node 透传）。
- `doctor-auth.ts`：doctor 中 auth profile 修复、清理与健康提示流程。

## 2. 文件级研究结论

## 2.1 `src/gateway/node-registry.ts`

职责：作为 Gateway 运行期的 node 状态中心，提供 register/unregister/list/get/invoke/result-routing/sendEvent。

核心行为：

- 会话注册：
  - `register` 从 `connect` 帧提取 node 元信息（`nodeId/caps/commands/permissions/pathEnv/...`）并写入双索引（`nodesById` + `nodesByConn`），见 `src/gateway/node-registry.ts:43`。
- 会话注销：
  - `unregister` 会清理会话并取消该 node 的所有 pending invoke；
  - 对每个 pending 调用 `reject(new Error("node disconnected (...)"))`，避免调用端永远挂起。
  见 `src/gateway/node-registry.ts:81`。
- 远程调用：
  - `invoke` 先验证 node 是否在线，离线返回 `NOT_CONNECTED`；
  - 向节点发送 `node.invoke.request` 事件，发送失败返回 `UNAVAILABLE`；
  - 建立 `pendingInvokes`，默认 30s 超时后返回 `TIMEOUT`。
  见 `src/gateway/node-registry.ts:107`。
- 结果回填：
  - `handleInvokeResult` 按 `id + nodeId` 匹配 pending；
  - 匹配成功清理 timer 并 resolve；
  - 未匹配返回 `false`（由上层决定忽略/报错策略）。
  见 `src/gateway/node-registry.ts:157`。

生命周期调用链（关键）：

- node 连接成功后由 WS 消息处理层执行 `register`，见 `src/gateway/server/ws-connection/message-handler.ts:865`。
- node 断开时由 WS 连接层执行 `unregister` 并触发订阅清理，见 `src/gateway/server/ws-connection.ts:245`。
- `NodeRegistry` 作为 Gateway context 单例注入到全部 handlers，见 `src/gateway/server.impl.ts:377`、`src/gateway/server.impl.ts:570`。

风险评估：`medium`

- 目前没有针对 `NodeRegistry` 的直接单元测试文件；主要依赖 e2e 间接覆盖。涉及并发与超时的细节（pending map/timer）回归更难精准定位。

## 2.2 `src/gateway/server-methods/exec-approvals.ts`

职责：处理审批配置的读写和 node 侧审批配置透传。

核心行为：

- 本地配置读写：
  - `exec.approvals.get` 会先 `ensureExecApprovals()` 再回包 snapshot；
  - 响应前调用 `redactExecApprovals`，仅返回 `socket.path`，屏蔽 `socket.token`。
  见 `src/gateway/server-methods/exec-approvals.ts:81`、`src/gateway/server-methods/exec-approvals.ts:72`。
- 并发写保护（base hash）：
  - `exec.approvals.set` 在文件已存在时强制校验 `baseHash`，防止旧快照覆盖新配置；
  - `baseHash` 缺失/不一致会返回 `INVALID_REQUEST`，并提示先重新 get。
  见 `src/gateway/server-methods/exec-approvals.ts:27`、`src/gateway/server-methods/exec-approvals.ts:98`。
- 写入规范化：
  - set 路径会 `normalizeExecApprovals` + `mergeExecApprovalsSocketDefaults` 后 `saveExecApprovals`；
  - 保持 socket 默认路径/现有 token 的可继承行为。
  见 `src/gateway/server-methods/exec-approvals.ts:116`。
- node 透传：
  - `exec.approvals.node.get` 透传 `system.execApprovals.get`；
  - `exec.approvals.node.set` 透传 `system.execApprovals.set`；
  - 两者统一使用 `respondUnavailableOnThrow` + `respondUnavailableOnNodeInvokeError` + `safeParseJson`。
  见 `src/gateway/server-methods/exec-approvals.ts:131`。

权限边界：

- `exec.approvals.*` 属于 admin 前缀，非 `operator.admin` 会被统一拒绝，见 `src/gateway/server-methods.ts:54`、`src/gateway/server-methods.ts:144`。

风险评估：`medium`

- 当前测试更多覆盖 infra/CLI 语义与上层工具调用，Gateway handler 本身缺少直接测试（尤其 baseHash 冲突与 node.set 错误路径）。

## 2.3 `src/commands/doctor-auth.ts`

职责：doctor 运行时的 auth profile 修复与健康诊断子流程。

核心行为：

- `maybeRepairAnthropicOAuthProfileId`：
  - 通过 `repairOAuthProfileIdMismatch` 检测 legacy profile id（如 `anthropic:default`）与 store 中真实 OAuth profile 的错配；
  - 提示并确认后才应用 config 迁移。
  见 `src/commands/doctor-auth.ts:20`、`src/agents/auth-profiles/repair.ts:84`。
- `maybeRemoveDeprecatedCliAuthProfiles`：
  - 识别并提示移除 `anthropic:claude-cli` / `openai-codex:codex-cli`；
  - 同步清理 store 的 `profiles/usageStats/order/lastGood`；
  - 同步清理 config 的 `auth.profiles` 与 `auth.order`。
  见 `src/commands/doctor-auth.ts:112`。
- `noteAuthProfileHealth`：
  - 先输出 cooldown/disabled profile 提示；
  - 再基于 `buildAuthHealthSummary` 检测 `expired/expiring/missing` 的 oauth/token；
  - 可选择立即刷新 OAuth（`resolveApiKeyForProfile`），刷新后重建 summary；
  - 剩余问题按 provider/profile 生成可执行 hint。
  见 `src/commands/doctor-auth.ts:230`、`src/agents/auth-health.ts:156`。

在 doctor 主流程中的位置：

- 配置迁移后立刻执行 auth 修复和健康检查，见 `src/commands/doctor.ts:114`。

风险评估：`medium`

- 该模块同时读写 store 与 config，并夹带交互分支；回归常见于“确认分支与非交互行为差异”。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor-auth.deprecated-cli-profiles.e2e.test.ts src/gateway/server.node-invoke-approval-bypass.e2e.test.ts src/gateway/server.roles-allowlist-update.e2e.test.ts src/agents/bash-tools.exec.approval-id.e2e.test.ts`
  - 14/14 通过。
- `pnpm vitest run --config vitest.unit.config.ts src/infra/exec-approvals.test.ts src/cli/exec-approvals-cli.test.ts`
  - 58/58 通过。
- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/gateway-misc.test.ts`
  - 12/12 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/agents/auth-health.e2e.test.ts`
  - 2/2 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/server.models-voicewake-misc.e2e.test.ts`
  - 9/9 通过。

关键覆盖点：

- `doctor-auth`：
  - deprecated CLI profile 从 store + config 一并清理，见 `src/commands/doctor-auth.deprecated-cli-profiles.e2e.test.ts:50`。
- `NodeRegistry` 闭环（间接）：
  - node 侧收到 `node.invoke.request` 并回传 `node.invoke.result`，见 `src/gateway/server.node-invoke-approval-bypass.e2e.test.ts:96`、`src/gateway/server.node-invoke-approval-bypass.e2e.test.ts:109`。
  - `payloadJSON: null` 的 invoke-result 回包路径可正常完成，见 `src/gateway/server.roles-allowlist-update.e2e.test.ts:344`。
  - node 连接时会收到 `voicewake.changed` 事件，覆盖 `NodeRegistry.sendEvent` 连接后下发路径，见 `src/gateway/server.models-voicewake-misc.e2e.test.ts:170`。
- `exec-approvals` 语义（infra/调用侧）：
  - socket defaults 合并策略，见 `src/infra/exec-approvals.test.ts:83`。
  - CLI 会正确分流到 `exec.approvals.get` / `exec.approvals.node.get`，见 `src/cli/exec-approvals-cli.test.ts:73`。
  - node host 工具链会调用 `exec.approvals.node.get` 参与 allowlist 决策，见 `src/agents/bash-tools.exec.approval-id.e2e.test.ts:79`。

已知覆盖缺口：

- 本批未发现直接面向 `src/gateway/server-methods/exec-approvals.ts` 的 handler 级测试（baseHash 冲突与 node.set 错误分支仍是间接证据）。
- `src/gateway/node-registry.ts` 也暂无专门 unit test 文件，主要依赖网关 e2e 行为覆盖。

## 4. 本批完成文件

- `src/gateway/node-registry.ts`
- `src/gateway/server-methods/exec-approvals.ts`
- `src/commands/doctor-auth.ts`

## 5. 下一批建议

继续沿当前链路补“同层近邻”且避免重复：

1. `src/gateway/server/ws-connection/message-handler.ts`
2. `src/gateway/server/ws-connection.ts`
3. `src/commands/doctor-gateway-health.ts`
