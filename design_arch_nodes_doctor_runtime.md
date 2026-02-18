# design_arch_nodes_doctor_runtime

研究日期：2026-02-16  
研究范围：

- `src/gateway/server-methods/nodes.ts`
- `src/gateway/server-node-events-types.ts`
- `src/commands/doctor.ts`

本批状态：已完成（3/3）

## 1. 模块职责定位

这批覆盖“节点 RPC 入口 + 节点事件上下文契约 + doctor 运行编排主流程”：

- `nodes.ts`：Gateway 对 node 能力的主 RPC 入口（pair/list/describe/invoke/event）。
- `server-node-events-types.ts`：`node.event` 处理所需上下文契约定义。
- `doctor.ts`：doctor 命令全流程 orchestrator（配置修复、迁移、健康检查、服务修复、写回配置）。

## 2. 文件级研究结论

## 2.1 `src/gateway/server-methods/nodes.ts`

职责：统一处理所有 `node.*` Gateway 方法，并执行角色鉴权后节点能力路由。

核心行为：

- 配对相关：`node.pair.request/list/approve/reject/verify` 直接桥接 infra pairing 能力，并在 approve/reject 时广播 `node.pair.resolved`，见 `src/gateway/server-methods/nodes.ts:48`。
- 节点查询：
  - `node.list` 合并已配对与实时连接节点，按 connected 优先 + 名称排序，见 `src/gateway/server-methods/nodes.ts:211`。
  - `node.describe` 返回单节点详情，未知节点直接 `INVALID_REQUEST`，见 `src/gateway/server-methods/nodes.ts:292`。
- 节点调用：`node.invoke`
  - 输入校验 + 禁止 `system.execApprovals.*` 直调（强制走 `exec.approvals.node.*`），见 `src/gateway/server-methods/nodes.ts:372`。
  - 调 `resolveNodeCommandAllowlist` + `isNodeCommandAllowed` 做命令 allowlist 判定，见 `src/gateway/server-methods/nodes.ts:398`。
  - 调 `sanitizeNodeInvokeParamsForForwarding` 做参数净化和审批绑定，见 `src/gateway/server-methods/nodes.ts:414`。
  - 调 `nodeRegistry.invoke` 发往节点，并统一解析 payloadJSON，见 `src/gateway/server-methods/nodes.ts:430`。
- 节点事件：`node.event`
  - 接收 `payload/payloadJSON` 后动态导入 `handleNodeEvent`，并从 client connect 信息推导 nodeId，见 `src/gateway/server-methods/nodes.ts:455`。

风险评估：`medium`

- 风险点 1：`node.event` 的 `payload` 自动 `JSON.stringify` 路径在大对象场景可能产生额外序列化开销。
- 风险点 2：`nodeContext` 映射字段较多，后续 gateway context 字段变更时若不同步，`handleNodeEvent` 可能静默失能。

## 2.2 `src/gateway/server-node-events-types.ts`

职责：定义 `handleNodeEvent` 所需 `NodeEventContext`/`NodeEvent` 类型契约。

核心行为：

- `NodeEventContext` 显式声明了 node event 处理可访问的依赖边界（chat run registry、node subscribe、health snapshot、catalog loader 等），见 `src/gateway/server-node-events-types.ts:8`。
- `NodeEvent` 统一 `event + payloadJSON` 形态，解耦上游 RPC 和下游 handler，见 `src/gateway/server-node-events-types.ts:33`。

风险评估：`low`

- 类型文件本身无运行逻辑；主要价值是约束 `nodes.ts` 构造上下文时不漏字段。

## 2.3 `src/commands/doctor.ts`

职责：doctor 命令的顶层工作流编排器。

核心流程：

1. 启动与更新：打印 wizard header，先执行 `maybeOfferUpdateBeforeDoctor`（必要时提前返回），见 `src/commands/doctor.ts:71`。
2. 配置与凭证检查：`loadAndMaybeMigrateDoctorConfig`、auth profile 修复/健康检查、gateway 模式和 token 提示，见 `src/commands/doctor.ts:95`。
3. 迁移入口：调用 `detectLegacyStateMigrations`，按 `nonInteractive`/confirm 决定是否执行 `runLegacyStateMigrations`，见 `src/commands/doctor.ts:163`。
4. 安全与系统修复：state integrity、sandbox、gateway services、security、hooks model 兼容提示，见 `src/commands/doctor.ts:186`。
5. 健康与守护：gateway health + daemon 修复，最终根据 `shouldWriteConfig` 决定写回配置并打印 backup，见 `src/commands/doctor.ts:270`。

关键决策点：

- `nonInteractive=true` 时 legacy state 迁移默认执行且不弹确认。
- `gateway.mode=local` 且 auth 缺失时，会提示/可自动生成 token（交互态）。
- 最终配置再做一次 snapshot 验证，invalid 时打印 issues 但流程仍完成并 `outro`。

风险评估：`medium`

- doctor 聚合外部依赖多，分支复杂；回归通常体现在“交互与非交互路径行为差异”。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/server.node-invoke-approval-bypass.e2e.test.ts src/gateway/server.roles-allowlist-update.e2e.test.ts`
  - 9/9 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts src/commands/doctor.warns-state-directory-is-missing.e2e.test.ts src/commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.e2e.test.ts`
  - 10/10 通过。

覆盖要点（代码证据）：

- `node.invoke` 参数净化与审批绕过防护：`src/gateway/server.node-invoke-approval-bypass.e2e.test.ts:127`。
- `node.event`/`node.list`/allowlist 行为：`src/gateway/server.roles-allowlist-update.e2e.test.ts:130`、`src/gateway/server.roles-allowlist-update.e2e.test.ts:239`。
- doctor 非交互迁移、state 缺失告警、legacy allowFrom 迁移：
  - `src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts:13`
  - `src/commands/doctor.warns-state-directory-is-missing.e2e.test.ts:8`
  - `src/commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.e2e.test.ts:17`

## 4. 本批完成文件

- `src/gateway/server-methods/nodes.ts`
- `src/gateway/server-node-events-types.ts`
- `src/commands/doctor.ts`

## 5. 下一批建议

沿当前链路继续补“近邻实现层”并避免重复：

1. `src/gateway/server-methods/nodes.helpers.ts`
2. `src/gateway/server-methods/nodes.handlers.invoke-result.ts`
3. `src/commands/doctor-config-flow.ts`
