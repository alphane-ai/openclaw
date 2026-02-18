# design_arch_gateway_sessions

研究日期：2026-02-16  
研究范围：

- `src/config/sessions/group.ts`
- `src/config/sessions/main-session.ts`
- `src/config/sessions/session-key.ts`
- `src/gateway/session-utils.ts`
- `src/gateway/server-session-key.ts`
- `src/gateway/server-chat.ts`
- `src/gateway/session-utils.test.ts`
- `src/gateway/server-chat.agent-events.test.ts`

本批状态：已完成（8/8）

## 1. 模块职责定位

这一批是 `routing/session-key` 的直接下游，覆盖两条链路：

- 会话键规范化链路：`config/sessions/*` + `gateway/session-utils.ts`
- 运行态事件回填链路：`gateway/server-session-key.ts` + `gateway/server-chat.ts`

重点不重复 `src/routing/*` 已研究内容，而是补“落盘键如何被网关读写、运行态如何按 runId 回填 sessionKey”。

## 2. 文件级研究结论

## 2.1 `src/config/sessions/main-session.ts`

职责：统一“主会话键(main session key)”决策，并处理 `main` 别名到规范键的折叠。

核心行为：

- `resolveMainSessionKey`：
  - `session.scope=global` 时返回 `global`，见 `src/config/sessions/main-session.ts:15`。
  - 非 global 时，按 `agents.list` 的 `default` -> 首项 -> `main` 选 agent，再拼成 `agent:<id>:<mainKey>`，见 `src/config/sessions/main-session.ts:18`、`src/config/sessions/main-session.ts:23`。
- `resolveAgentMainSessionKey`：给定 `agentId` 计算该 agent 主会话键，见 `src/config/sessions/main-session.ts:32`。
- `canonicalizeMainSessionAlias`：把 `main` / 自定义 `mainKey` / `agent:<id>:main` 等别名折叠到规范键；global scope 下进一步折叠为 `global`，见 `src/config/sessions/main-session.ts:51`。

关联调用（证据）：

- 会话工具层：`src/gateway/session-utils.ts:441`
- 运行时迁移：`src/infra/state-migrations.ts:115`
- 心跳主链路：`src/infra/heartbeat-runner.ts:292`
- gateway hooks/system：`src/gateway/server/hooks.ts:25`、`src/gateway/server-methods/system.ts:39`

风险评估：`low`

- 别名收敛逻辑集中，调用方一致性较好；主要风险来自未来新增别名时未同步到此处。

## 2.2 `src/config/sessions/session-key.ts` + `src/config/sessions/group.ts`

职责：把消息上下文映射为会话键，并保证 direct/group 的隔离策略一致。

核心行为：

- `deriveSessionKey`：
  - `global` 直接返回 `global`；
  - group/channel 通过 `resolveGroupSessionKey` 返回 `provider:group|channel:id`；
  - 其余走 `From`（E164 标准化）或 `unknown`，见 `src/config/sessions/session-key.ts:12`。
- `resolveSessionKey`：
  - 显式 `ctx.SessionKey` 优先（转小写）；
  - direct 统一折叠到 `agent:main:<mainKey>`；
  - group/channel 保持隔离并补 `agent:main:` 前缀，见 `src/config/sessions/session-key.ts:28`。
- `resolveGroupSessionKey`：
  - 自动识别 group/channel/chatType/WhatsApp 群组后缀 `@g.us`；
  - 归一化 provider/kind/id 为稳定键，见 `src/config/sessions/group.ts:59`。

测试证据：

- direct 折叠、group 保留、mainKey 自定义、deliveryContext 写回，都在 `src/config/sessions.test.ts:36` 起覆盖。

风险评估：`medium`

- 会话键默认小写归一化（包括显式 SessionKey），对大小写敏感外部 ID 存在潜在冲突风险（当前实现偏向“键稳定性优先”）。

## 2.3 `src/gateway/session-utils.ts`

职责：gateway 侧会话键 canonicalization、跨 agent store 路径解析、legacy 键清理、会话列表聚合。

关键实现点：

- `resolveSessionStoreKey`：
  - 统一处理 `global/unknown`；
  - 已带 `agent:` 的键会经 `canonicalizeMainSessionAlias` 折叠；
  - 裸键会补默认 agent 前缀，并把 `main`/自定义 mainKey 映射到规范主键，见 `src/gateway/session-utils.ts:424`。
- `resolveGatewaySessionStoreTarget`：
  - 返回 `{agentId,storePath,canonicalKey,storeKeys[]}`；
  - 在 `scanLegacyKeys` 开启时会扫描大小写变体和 `agent:<id>:main` 历史别名，见 `src/gateway/session-utils.ts:497`。
- `pruneLegacyStoreKeys`：清理 canonical 外的 alias/case 变体“幽灵键”，见 `src/gateway/session-utils.ts:244`。
- `loadSessionEntry`：按 canonicalKey 选正确 storePath 并做大小写兜底匹配，见 `src/gateway/session-utils.ts:185`。
- `listSessionsFromStore`：过滤 `cron run` 会话、支持 `agentId/spawnedBy/label/search/activeMinutes` 视图，并补 `derivedTitle/lastMessagePreview`，见 `src/gateway/session-utils.ts:666`。

主要消费方：

- `sessions.*` 网关方法：`src/gateway/server-methods/sessions.ts:65`、`src/gateway/server-methods/sessions.ts:142`
- chat/agent/usage/node-events：`src/gateway/server-methods/chat.ts:273`、`src/gateway/server-methods/agent.ts:354`、`src/gateway/server-node-events.ts:112`

风险评估：`medium`

- canonical + legacy 清理逻辑较强，但路径分支多（单文件 store / `{agentId}` 模板 / mixed-case 兼容），后续改动需要保持 tests 同步。

## 2.4 `src/gateway/server-session-key.ts`

职责：当 runId 事件缺失运行时上下文时，从 session store 反查 sessionKey。

核心行为：

- 优先读取内存态 `agent run context`；命中即返回，见 `src/gateway/server-session-key.ts:7`。
- 未命中时读取配置 + 会话 store，按 `entry.sessionId === runId` 线性扫描；命中后把 store key 还原为请求侧键并回写 run context，见 `src/gateway/server-session-key.ts:11`、`src/gateway/server-session-key.ts:14`、`src/gateway/server-session-key.ts:18`。

调用点：

- 由 `createAgentEventHandler` 注入使用，见 `src/gateway/server.impl.ts:480`。
- 真正消费在 agent event handler：`src/gateway/server-chat.ts:328`。

风险评估：`medium`

- 反查是 O(n) 线性扫描；在超大 sessions store 下可能增加事件回填时延。
- 调用 `resolveStorePath(cfg.session?.store)` 未显式传 `agentId`，若部署使用 `{agentId}` 多 store，run context 丢失时仅会扫描默认 agent store，跨 agent 回填可能漏命中。

## 2.5 `src/gateway/server-chat.ts`

职责：把 agent 事件转换为 chat/agent 广播，并确保事件落到正确 session。

与本批相关的关键点：

- 会话键来源优先级：`chatRunRegistry` 绑定键优先，回退 `resolveSessionKeyForRun(evt.runId)`，见 `src/gateway/server-chat.ts:327`。
- tool 事件会按 verbose 等级裁剪 `result/partialResult`，并区分 WS recipient 与 node/channel 订阅推送策略，见 `src/gateway/server-chat.ts:337`、`src/gateway/server-chat.ts:361`、`src/gateway/server-chat.ts:377`。
- lifecycle 完成时清理 `run context + seq`，避免 runId 泄漏，见 `src/gateway/server-chat.ts:419`。

风险评估：`low`

- handler 的职责边界清晰；主要复杂点在 tool verbose 与 lifecycle 分支，但已有专门测试覆盖。

## 2.6 测试覆盖结论

- `src/config/sessions.test.ts`
  - 覆盖 direct/group/global 的 session key 生成与 `updateLastRoute` 关键字段写回。
  - 本次执行：27/27 通过。
- `src/gateway/session-utils.test.ts`
  - 覆盖 main alias 折叠、`{agentId}` store 路径、legacy mixed-case 键识别与清理。
  - 本次执行：36/36 通过。
- `src/gateway/server-chat.agent-events.test.ts`
  - 覆盖 tool 事件分发、verbose 裁剪、lifecycle 清理。
  - 本次执行：8/8 通过。

执行命令：

- `pnpm test:fast src/config/sessions.test.ts`
- `pnpm vitest run --config vitest.gateway.config.ts src/gateway/session-utils.test.ts src/gateway/server-chat.agent-events.test.ts`

## 3. 关键闭环（本批新增）

“配置 main/session 规则 -> gateway canonical key -> 运行时 runId 回填 sessionKey”闭环：

1. `config/sessions/main-session.ts` 决定主会话键别名归一化。
2. `gateway/session-utils.ts` 负责 canonical key 与 storePath 决策、legacy 清理。
3. `gateway/server-session-key.ts` 在 run context 缺失时按 sessionId 反查。
4. `gateway/server-chat.ts` 用 sessionKey 绑定 agent/chat 事件广播。

## 4. 本批完成文件

- `src/config/sessions/group.ts`
- `src/config/sessions/main-session.ts`
- `src/config/sessions/session-key.ts`
- `src/gateway/session-utils.ts`
- `src/gateway/server-session-key.ts`
- `src/gateway/server-chat.ts`
- `src/gateway/session-utils.test.ts`
- `src/gateway/server-chat.agent-events.test.ts`

## 5. 下一批建议

优先继续这条链路的未覆盖关联模块：

1. `src/gateway/server-methods/sessions.ts`（写路径与清理策略真实入口）
2. `src/gateway/sessions-resolve.ts`（resolve API 与 canonical key 的桥接层）
3. `src/infra/state-migrations.ts`（历史 session key 迁移与别名折叠）
