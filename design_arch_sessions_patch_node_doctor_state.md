# design_arch_sessions_patch_node_doctor_state

研究日期：2026-02-16  
研究范围：

- `src/gateway/sessions-patch.ts`
- `src/gateway/server-node-events.ts`
- `src/commands/doctor-state-migrations.ts`

本批状态：已完成（3/3）

## 1. 模块职责定位

这批是上一轮 `sessions.*` 主入口的下游实现层：

- `sessions-patch.ts`：`sessions.patch` 的字段级变更语义和约束执行器。
- `server-node-events.ts`：节点上报事件到会话/系统事件/agent 运行链路的桥接层。
- `doctor-state-migrations.ts`：commands 层对 `infra/state-migrations` 的稳定导出边界。

## 2. 文件级研究结论

## 2.1 `src/gateway/sessions-patch.ts`

职责：把 `SessionsPatchParams` 变更安全地应用到单条 session store entry。

核心行为：

- 入口 `applySessionsPatchToStore` 会先基于 `storeKey` 解析 agent，再加载该 agent 的默认模型作为 override fallback，见 `src/gateway/sessions-patch.ts:61`、`src/gateway/sessions-patch.ts:70`。
- 新会话兜底：entry 不存在时自动生成 `sessionId=randomUUID()`，见 `src/gateway/sessions-patch.ts:75`。
- 不变量控制：
  - `spawnedBy` / `spawnDepth` 仅允许 subagent 会话设置，且一旦设置不可改不可清空，见 `src/gateway/sessions-patch.ts:82`、`src/gateway/sessions-patch.ts:103`。
  - `label` 必须通过 `parseSessionLabel` 且全 store 唯一，见 `src/gateway/sessions-patch.ts:125`。
- 思考/输出相关字段：
  - `thinkingLevel` 支持清空回默认，并在 `xhigh` 不支持时做显式报错或自动降级到 `high`，见 `src/gateway/sessions-patch.ts:146`、`src/gateway/sessions-patch.ts:320`。
  - `verboseLevel` 走统一 parser+apply，见 `src/gateway/sessions-patch.ts:164`。
  - `reasoningLevel/responseUsage/elevatedLevel` 各自有 normalize + null 清空语义，见 `src/gateway/sessions-patch.ts:173`、`src/gateway/sessions-patch.ts:190`、`src/gateway/sessions-patch.ts:207`。
- 执行策略字段：`execHost/execSecurity/execAsk/execNode` 都有严格枚举或非空校验，见 `src/gateway/sessions-patch.ts:221`、`src/gateway/sessions-patch.ts:234`、`src/gateway/sessions-patch.ts:247`、`src/gateway/sessions-patch.ts:260`。
- 模型覆盖：
  - patch `model` 时依赖 gateway model catalog；catalog 缺失直接 `UNAVAILABLE`。
  - 模型变化会通过 `applyModelOverrideToSessionEntry` 同步处理 provider/model override 与 auth override 清理。
  见 `src/gateway/sessions-patch.ts:273`。

消费关系：

- 由 `sessionsHandlers["sessions.patch"]` 调用，见 `src/gateway/server-methods/sessions.ts:244`。
- 行为级 e2e 由 `sessions.*` 通道覆盖，见 `src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts:203`。

风险评估：`medium`

- 字段分支多且耦合默认模型/目录能力，后续新增 patch 字段时容易遗漏互斥和幂等不变量。

## 2.2 `src/gateway/server-node-events.ts`

职责：处理 `node.event` 上报，把节点事件映射到 session/agent/system event/heartbeat。

核心行为：

- 入口 `handleNodeEvent` 基于 `evt.event` 分支，见 `src/gateway/server-node-events.ts:87`。
- `voice.transcript`：
  - 解析 payload、做长度上限保护（20k），无 sessionKey 时回退 mainKey；
  - `touchSessionStore` 更新 canonical 会话键并清理 legacy 键；
  - 调 `addChatRun` 建 run 映射，再触发 `agentCommand(deliver:false, messageChannel:"node")`。
  见 `src/gateway/server-node-events.ts:89`。
- `agent.request`：
  - 把节点深链请求转为 `agentCommand`；
  - session 缺失时回退 `node-<nodeId>` 键；支持 deliver/to/channel/timeout 透传。
  见 `src/gateway/server-node-events.ts:140`。
- `chat.subscribe/unsubscribe`：基于 payloadJSON 的 `sessionKey` 做 node subscription 管理，见 `src/gateway/server-node-events.ts:201`。
- `exec.started|finished|denied`：
  - 规范化并压缩输出（最长 180 chars）；
  - 成功且空输出的 `exec.finished` 会抑制通知，减少噪音；
  - 其余发 `enqueueSystemEvent` 并触发 `requestHeartbeatNow`。
  见 `src/gateway/server-node-events.ts:223`。

上游调用点：

- `node.event` RPC 动态导入并调用 `handleNodeEvent`，见 `src/gateway/server-methods/nodes.ts:472`。

风险评估：`medium`

- 当前单测只覆盖 exec 事件分支，`voice.transcript` / `agent.request` / subscribe 分支无直接测试，回归风险高于同层模块。

## 2.3 `src/commands/doctor-state-migrations.ts`

职责：作为 commands 层“迁移 API 入口别名”，统一 re-export `infra/state-migrations` 的类型与函数。

核心行为：

- 该文件本身不含业务逻辑，只 re-export 迁移能力和测试 reset 函数，见 `src/commands/doctor-state-migrations.ts:1`。
- 实际调用方：
  - `doctor.ts` 用它来做 `detectLegacyStateMigrations` / `runLegacyStateMigrations`，见 `src/commands/doctor.ts:48`、`src/commands/doctor.ts:163`。
  - `doctor-config-flow.ts` 用它做 `autoMigrateLegacyStateDir`，见 `src/commands/doctor-config-flow.ts:22`、`src/commands/doctor-config-flow.ts:457`。

风险评估：`low`

- 主要风险是 re-export 列表与 infra 实现漂移（删改未同步），会在编译期或 e2e 中暴露。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/sessions-patch.test.ts src/gateway/server-node-events.test.ts`
  - 14/14 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts`
  - 4/4 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor-state-migrations.e2e.test.ts`
  - 22/22 通过。

关键覆盖点：

- `sessions-patch`：thinking/elevated、spawnDepth 限制、model patch 清理 auth override，见 `src/gateway/sessions-patch.test.ts:7`、`src/gateway/sessions-patch.test.ts:101`、`src/gateway/sessions-patch.test.ts:131`。
- `server-node-events`：exec.started/finished/denied 文案与噪音抑制，见 `src/gateway/server-node-events.test.ts:49`、`src/gateway/server-node-events.test.ts:86`、`src/gateway/server-node-events.test.ts:122`。
- doctor 非交互迁移触发：`yes/nonInteractive` 下不 prompt 且执行迁移，见 `src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.e2e.test.ts:13`。
- doctor 迁移实现覆盖（通过 commands shim 触达 infra）：见 `src/commands/doctor-state-migrations.e2e.test.ts:39`。

## 4. 本批完成文件

- `src/gateway/sessions-patch.ts`
- `src/gateway/server-node-events.ts`
- `src/commands/doctor-state-migrations.ts`

## 5. 下一批建议

继续沿当前链路，优先补测试空白和桥接层：

1. `src/gateway/server-methods/nodes.ts`（`node.event` 入口与上下文注入）
2. `src/gateway/server-node-events-types.ts`（事件处理上下文契约）
3. `src/commands/doctor.ts`（迁移触发策略 + 交互分支）
