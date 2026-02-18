# design_arch_nodes_helpers_doctor_config_flow

研究日期：2026-02-16  
研究范围：

- `src/gateway/server-methods/nodes.helpers.ts`
- `src/gateway/server-methods/nodes.handlers.invoke-result.ts`
- `src/commands/doctor-config-flow.ts`

本批状态：已完成（3/3）

## 1. 模块职责定位

这批是上一轮 `node.*` 与 `doctor.ts` 主流程的“实现细节层”：

- `nodes.helpers.ts`：Gateway `node` 相关请求的共享错误处理/解析工具集。
- `nodes.handlers.invoke-result.ts`：`node.invoke.result` 的专用 handler，负责回填 invoke 结果。
- `doctor-config-flow.ts`：doctor 的配置读取、迁移、修复和写回决策入口。

## 2. 文件级研究结论

## 2.1 `src/gateway/server-methods/nodes.helpers.ts`

职责：把 `nodes.ts` / `browser.ts` / `exec-approvals.ts` 里重复的校验与错误响应逻辑抽成统一 helper。

核心行为：

- `respondInvalidParams`：统一把 AJV 校验错误映射成 `INVALID_REQUEST`，见 `src/gateway/server-methods/nodes.helpers.ts:10`。
- `respondUnavailableOnThrow`：把 handler 内部抛错收敛成 `UNAVAILABLE`，减少重复 try/catch，见 `src/gateway/server-methods/nodes.helpers.ts:25`。
- `uniqueSortedStrings`：对字符串数组做 trim + 去重 + 排序，用于节点能力/命令列表归一化，见 `src/gateway/server-methods/nodes.helpers.ts:33`。
- `safeParseJson`：容错解析 `payloadJSON`；空字符串返回 `undefined`，解析失败回退为 `{ payloadJSON: <raw> }`，确保原始数据不丢，见 `src/gateway/server-methods/nodes.helpers.ts:40`。
- `respondUnavailableOnNodeInvokeError`：把 node invoke 错误统一映射为 `UNAVAILABLE`，并携带 `details.nodeError`，见 `src/gateway/server-methods/nodes.helpers.ts:55`。

关联调用点：

- `src/gateway/server-methods/nodes.ts:30`
- `src/gateway/server-methods/browser.ts:13`
- `src/gateway/server-methods/exec-approvals.ts:21`

风险评估：`low`

- 主要是“错误语义统一层”；逻辑本身不复杂，但若未来协议 error code 策略调整，helper 与调用方需同步。

## 2.2 `src/gateway/server-methods/nodes.handlers.invoke-result.ts`

职责：处理节点上报的 `node.invoke.result`，把结果回填到 `nodeRegistry` 等待中的 invoke 请求。

核心行为：

- 预归一化 `normalizeNodeInvokeResultParams`：
  - `payloadJSON: null` 会被剔除；
  - `payloadJSON` 不是字符串时，优先转移到 `payload`；
  - `error: null` 会被剔除。
  见 `src/gateway/server-methods/nodes.handlers.invoke-result.ts:5`。
- 参数校验失败走 `respondInvalidParams`，见 `src/gateway/server-methods/nodes.handlers.invoke-result.ts:32`。
- 绑定调用节点身份：若连接层可解析出 `callerNodeId` 且与 `params.nodeId` 不一致，直接拒绝（`nodeId mismatch`），见 `src/gateway/server-methods/nodes.handlers.invoke-result.ts:48`。
- 调 `context.nodeRegistry.handleInvokeResult(...)` 回填结果；若返回 false（通常是超时后的迟到结果），不报错而返回 `{ ok: true, ignored: true }` 并打 debug 日志，见 `src/gateway/server-methods/nodes.handlers.invoke-result.ts:54`。

风险评估：`medium`

- 迟到结果被“成功忽略”是有意降噪策略，但会让“真正异常的未知 invoke id”与“正常超时迟到”共享同一路径，需要结合日志定位。

## 2.3 `src/commands/doctor-config-flow.ts`

职责：doctor 配置阶段的总入口，负责“读取快照 -> 迁移/修复候选 -> 交互决策 -> 输出 cfg/path/writeFlag”。

核心流程：

1. 预迁移：
   - 自动迁移 legacy state dir；
   - 必要时复制 legacy config 到 `~/.openclaw/openclaw.json`。
   见 `src/commands/doctor-config-flow.ts:457`、`src/commands/doctor-config-flow.ts:465`。
2. 快照读取与告警：
   - `readConfigFileSnapshot` 后处理 invalid/warnings/legacyIssues 提示；
   - 对 legacy key 调 `migrateLegacyConfig`。
   见 `src/commands/doctor-config-flow.ts:470`、`src/commands/doctor-config-flow.ts:486`。
3. 规范化与自动启用：
   - `normalizeLegacyConfigValues`
   - `applyPluginAutoEnable`
   见 `src/commands/doctor-config-flow.ts:511`、`src/commands/doctor-config-flow.ts:523`。
4. Telegram allowFrom 修复（repair 模式）：
   - 扫描非数字账号项；
   - 用已配置 bot token 调 `getChat` 解析 `@username -> numeric id`（4s 超时、多 token 尝试、去重）。
   见 `src/commands/doctor-config-flow.ts:225`、`src/commands/doctor-config-flow.ts:273`、`src/commands/doctor-config-flow.ts:535`。
5. 未知 key 清理与写回决策：
   - `stripUnknownConfigKeys` 可删掉 schema 外字段；
   - 非 repair 模式下通过 confirm 决定是否应用候选修复。
   见 `src/commands/doctor-config-flow.ts:77`、`src/commands/doctor-config-flow.ts:556`、`src/commands/doctor-config-flow.ts:570`。
6. 最终输出：
   - 返回 `{ cfg, path, shouldWriteConfig }` 给 `doctor.ts` 主流程。
   见 `src/commands/doctor-config-flow.ts:585`。

风险评估：`medium`

- 该文件聚合了配置解析、迁移、网络解析（Telegram）、交互确认，分支密度高；回归往往体现为 repair 与 non-repair 模式行为差异。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor-config-flow.e2e.test.ts src/gateway/server.node-invoke-approval-bypass.e2e.test.ts src/gateway/server.roles-allowlist-update.e2e.test.ts`
  - 12/12 通过。
- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/gateway-misc.test.ts`
  - 12/12 通过。

关键覆盖点：

- doctor 配置流：
  - invalid config 在 doctor 阶段可 best-effort 保留，见 `src/commands/doctor-config-flow.e2e.test.ts:8`。
  - repair 模式会移除 unknown keys，见 `src/commands/doctor-config-flow.e2e.test.ts:36`。
  - Telegram `@username` 自动解析为 numeric ID，见 `src/commands/doctor-config-flow.e2e.test.ts:68`。
- `node.invoke.result`：
  - 迟到 invoke 结果按 `ignored=true` 成功返回，见 `src/gateway/gateway-misc.test.ts:121`。
  - `payloadJSON: null` 结果在真实网关调用链可被接收并完成请求，见 `src/gateway/server.roles-allowlist-update.e2e.test.ts:344`。
  - invoke-result 路径在 node.invoke 真实闭环中可稳定回填，见 `src/gateway/server.node-invoke-approval-bypass.e2e.test.ts:109`。

## 4. 本批完成文件

- `src/gateway/server-methods/nodes.helpers.ts`
- `src/gateway/server-methods/nodes.handlers.invoke-result.ts`
- `src/commands/doctor-config-flow.ts`

## 5. 下一批建议

继续沿“节点调用闭环 + doctor 子流程”推进，避免重复已研究项：

1. `src/gateway/node-registry.ts`
2. `src/gateway/server-methods/exec-approvals.ts`
3. `src/commands/doctor-auth.ts`
