# design_arch_sessions_resolve_migrations

研究日期：2026-02-16  
研究范围：

- `src/gateway/server-methods/sessions.ts`
- `src/gateway/sessions-resolve.ts`
- `src/infra/state-migrations.ts`

本批状态：已完成（3/3）

## 1. 模块职责定位

这 3 个模块组成“会话生命周期操作 + 键解析 + 历史状态迁移”链路：

- `server-methods/sessions.ts`：Gateway RPC 的会话操作入口（list/preview/resolve/patch/reset/delete/compact）。
- `sessions-resolve.ts`：`sessions.resolve` 的选择器实现（按 key/sessionId/label 定位会话）。
- `state-migrations.ts`：历史 state 目录和 sessions/auth/pairing 结构迁移与 canonicalization。

它们是前一批 `session-utils/main-session` 的直接消费层。

## 2. 文件级研究结论

## 2.1 `src/gateway/server-methods/sessions.ts`

职责：对外暴露所有 `sessions.*` Gateway 方法，并负责“写前 canonicalize + 写后清理 + 运行态收尾”。

核心行为：

- 方法入口：`sessions.list/preview/resolve/patch/reset/delete/compact`，见 `src/gateway/server-methods/sessions.ts:142`。
- 统一键规范化：所有写操作都通过 `migrateAndPruneSessionStoreKey` 把 legacy key 迁移到 canonical key，并清理别名/大小写幽灵键，见 `src/gateway/server-methods/sessions.ts:71`。
- reset/delete 前收尾：
  - 清队列 `clearSessionQueues`
  - 停 subagent `stopSubagentsForRequester`
  - 中止 active run `abortEmbeddedPiRun + waitForEmbeddedPiRunEnd`
  见 `src/gateway/server-methods/sessions.ts:115`。
- `sessions.delete` 禁删主会话（main session），见 `src/gateway/server-methods/sessions.ts:360`。
- `sessions.compact` 先锁内存 store 找到目标，再在锁外处理 transcript，最后回写 token 统计字段清空，见 `src/gateway/server-methods/sessions.ts:414`、`src/gateway/server-methods/sessions.ts:476`。

关键依赖：

- 键与 store 路径：`resolveGatewaySessionStoreTarget`（`session-utils`）
- patch 语义：`applySessionsPatchToStore`（`sessions-patch`）
- resolve 语义：`resolveSessionKeyFromResolveParams`（`sessions-resolve`）

风险评估：`medium`

- 风险点 1：`ensureSessionRuntimeCleanup` 成功与否决定 reset/delete 的可用性；active run 未停会直接返回 `UNAVAILABLE`，这是正确但对调用方有重试要求。
- 风险点 2：`sessions.compact` 的 transcript 截断是“保留最后 N 行”，对超长多模态事件序列可能截断上下文边界。

## 2.2 `src/gateway/sessions-resolve.ts`

职责：把 `sessions.resolve` 参数解析为唯一 canonical session key。

核心行为：

- 选择器互斥：`key`、`sessionId`、`label` 只能三选一，否则 `INVALID_REQUEST`，见 `src/gateway/sessions-resolve.ts:30`。
- key 分支：
  - 先按 canonicalKey 命中；
  - 未命中时尝试 legacy key 并立即迁移到 canonical key（同时 prune 旧键），见 `src/gateway/sessions-resolve.ts:47`。
- sessionId 分支：
  - 通过 `listSessionsFromStore` 做过滤，再二次精确匹配 `session.sessionId===输入` 或 `session.key===输入`，见 `src/gateway/sessions-resolve.ts:72`。
- label 分支：
  - 先 `parseSessionLabel`，再按 label + agent/spawnedBy 过滤并要求唯一，见 `src/gateway/sessions-resolve.ts:109`。

风险评估：`medium`

- 风险点：sessionId 分支内部查询设置 `limit: 8`（`src/gateway/sessions-resolve.ts:84`），在高命中模糊搜索场景下可能截断候选，导致“存在但未命中”或“误判多/少”。

## 2.3 `src/infra/state-migrations.ts`

职责：历史状态目录和会话结构迁移（`~/.clawdbot`/`~/.moltbot` -> `~/.openclaw`，legacy sessions/agent/auth/pairing 文件归档和 canonicalization）。

核心行为：

- state dir 迁移：`autoMigrateLegacyStateDir`
  - 处理 legacy 路径、symlink 链、mirror tree 检测、目标存在冲突、回滚策略，见 `src/infra/state-migrations.ts:426`。
- 迁移探测：`detectLegacyStateMigrations`
  - 输出 sessions/agentDir/whatsappAuth/pairingAllowFrom 四类检测结果与 preview，见 `src/infra/state-migrations.ts:573`。
- sessions 迁移：`migrateLegacySessions`
  - 键 canonicalization（含 group/subagent/main alias）
  - legacy+target store 合并（按 updatedAt 选新）
  - transcript 文件移动与 legacy 目录清理/备份
  见 `src/infra/state-migrations.ts:680`。
- 全量迁移：`runLegacyStateMigrations` 包含 sessions + agentDir + whatsappAuth + telegram pairing allowFrom，见 `src/infra/state-migrations.ts:914`。
- 启动时自动迁移：`autoMigrateLegacyState`
  - 先做 state dir；
  - 再只做 sessions + agentDir（不含 whatsappAuth/pairingAllowFrom），见 `src/infra/state-migrations.ts:955`。

风险评估：`medium`

- 风险点 1：启动自动迁移与手动全量迁移覆盖范围不同（启动不迁移 whatsapp/telegram pairing 文件），运维层面需明确预期。
- 风险点 2：canonicalization 强制 lower-case，对历史中大小写敏感会话标识是不可逆归一化。

## 3. 测试证据

执行结果：

- `pnpm vitest run --config vitest.e2e.config.ts src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts`
  - 9/9 通过。
- `pnpm vitest run --config vitest.e2e.config.ts src/commands/doctor-state-migrations.e2e.test.ts`
  - 22/22 通过。
- `pnpm test:fast src/infra/state-migrations.state-dir.test.ts`
  - 1/1 通过。

覆盖要点（代码证据）：

- sessions.resolve/patch/reset/delete/compact 主路径：`src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts:140`、`src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts:203`、`src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts:354`、`src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts:545`。
- legacy main alias 清理链路：`src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts:468`。
- state migration 的 sessions/agent/auth/pairing 迁移与 canonicalization：`src/commands/doctor-state-migrations.e2e.test.ts:39`、`src/commands/doctor-state-migrations.e2e.test.ts:158`、`src/commands/doctor-state-migrations.e2e.test.ts:181`、`src/commands/doctor-state-migrations.e2e.test.ts:276`。
- state-dir symlink 链兼容：`src/infra/state-migrations.state-dir.test.ts:28`。

## 4. 本批完成文件

- `src/gateway/server-methods/sessions.ts`
- `src/gateway/sessions-resolve.ts`
- `src/infra/state-migrations.ts`

## 5. 下一批建议

继续沿着这一链路往下游走，避免重复：

1. `src/gateway/sessions-patch.ts`（patch 字段语义与校验）
2. `src/gateway/server-node-events.ts`（session key 在节点事件中的读写与迁移）
3. `src/commands/doctor-state-migrations.ts`（doctor 命令包装层与 operator 行为）
