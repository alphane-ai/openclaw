# design_arch_routing

研究日期：2026-02-16
研究范围：`src/routing/*`
本批状态：已完成（5/5）

## 1. 模块职责定位

`src/routing` 是“消息到 Agent 会话”的路由核心，负责两件事：

- 根据 `cfg.bindings` + 运行时上下文（channel/account/peer/guild/team/roles）选出目标 `agentId`。
- 根据路由结果生成稳定 `sessionKey` / `mainSessionKey`，供存储、并发和上下文归并使用。

关键入口：

- `resolveAgentRoute`：`src/routing/resolve-route.ts:295`
- `buildAgentSessionKey`：`src/routing/resolve-route.ts:90`
- `listBoundAccountIds`：`src/routing/bindings.ts:47`
- `toAgentStoreSessionKey`：`src/routing/session-key.ts:41`

## 2. 文件级研究结论

## 2.1 `src/routing/resolve-route.ts`

职责：根据绑定规则解析当前消息应命中的 agent 与会话键。

核心行为：

- 输入规格：`ResolveAgentRouteInput` 支持 `peer`、`parentPeer`、`guildId`、`teamId`、`memberRoleIds`，见 `src/routing/resolve-route.ts:25`。
- 匹配分层（优先级从高到低）：
  1. `binding.peer`
  2. `binding.peer.parent`
  3. `binding.guild+roles`
  4. `binding.guild`
  5. `binding.team`
  6. `binding.account`
  7. `binding.channel`
  8. `default`
  见 `src/routing/resolve-route.ts:366`。
- 线程继承：线程 peer 未命中时可回退到 `parentPeer` 绑定，见 `src/routing/resolve-route.ts:356`。
- 结果结构：返回 `agentId/channel/accountId/sessionKey/mainSessionKey/matchedBy`，见 `src/routing/resolve-route.ts:38`。
- 缓存：对 `(cfg.bindings 引用, channel, accountId)` 建 WeakMap + Map 缓存，超过 2000 键时清空，见 `src/routing/resolve-route.ts:176`。

外部调用（代码证据）：

- Discord：`src/discord/monitor/agent-components.ts:106`
- Signal：`src/signal/monitor/event-handler.ts:80`
- Slack：`src/slack/monitor/message-handler/prepare.ts:189`
- Telegram：`src/telegram/bot-handlers.ts:200`
- iMessage：`src/imessage/monitor/inbound-processing.ts:208`
- Web auto-reply：`src/web/auto-reply/monitor.ts:219`
- Line：`src/line/bot-message-context.ts:85`

风险评估：`medium`

- 风险点 1：规则优先级为硬编码 tier，新增条件时容易引入隐式回归。
- 风险点 2：`roles` 匹配是“任一角色命中即可”（OR 语义），若期望 AND 语义会误配。

## 2.2 `src/routing/bindings.ts`

职责：将配置中的 `bindings` 标准化为“按 channel/account/agent 可消费”的结构。

核心行为：

- `listBindings` 容错返回空数组，见 `src/routing/bindings.ts:16`。
- `normalizeBindingChannelId` 优先走 `normalizeChatChannelId`，失败时降级为 `trim().toLowerCase()`，见 `src/routing/bindings.ts:7`。
- 过滤规则：丢弃空 account 或 `*` 的 account（用于某些函数的“精确账号”语义），见 `src/routing/bindings.ts:36`。
- 构建 map：`buildChannelAccountBindings` 产出 `Map<channel, Map<agent, account[]>>`，见 `src/routing/bindings.ts:86`。
- `resolvePreferredAccountId` 当前策略为“有 boundAccounts 就取第一个，否则默认账号”，见 `src/routing/bindings.ts:104`。

外部调用（代码证据）：

- 健康检查命令：`src/commands/health.ts:355`
- Telegram 账号解析：`src/telegram/accounts.ts:40`

风险评估：`low`

- 风险点：`resolvePreferredAccountId` 只取第一个绑定账号，策略简洁但不具备优选排序语义。

## 2.3 `src/routing/session-key.ts`

职责：会话键规范化、构造、兼容迁移与分类。

核心行为：

- 常量：`DEFAULT_AGENT_ID/main`、`DEFAULT_MAIN_KEY/main`、`DEFAULT_ACCOUNT_ID/default`，见 `src/routing/session-key.ts:13`。
- 兼容转换：
  - `toAgentRequestSessionKey` 将存储键还原为请求键（取 parsed.rest），见 `src/routing/session-key.ts:33`。
  - `toAgentStoreSessionKey` 将请求键包装为 `agent:<agentId>:...`，见 `src/routing/session-key.ts:41`。
- 键形态分类：`missing | agent | legacy_or_alias | malformed_agent`，见 `src/routing/session-key.ts:65`。
- DM scope：`main | per-peer | per-channel-peer | per-account-channel-peer`，见 `src/routing/session-key.ts:150`。
- identityLinks：可跨 provider 归并 direct peer 到 canonical 身份，见 `src/routing/session-key.ts:190`。
- 线程键：`base:thread:<id>` 后缀生成，见 `src/routing/session-key.ts:248`。

外部调用（代码证据）：

- gateway session key 路径：`src/gateway/server-session-key.ts:17`
- agent workspace 入口校验：`src/agents/workspace-run.ts:34`
- heartbeat：`src/infra/heartbeat-runner.ts:287`

风险评估：`medium`

- 风险点 1：键格式由字符串拼接维护，扩展时易出现“兼容但不规范”的边缘键。
- 风险点 2：`toAgentStoreSessionKey` 对 `subagent:` 前缀有特殊拼接，调用方若重复包装会导致层级膨胀。

## 2.4 测试文件

- `src/routing/resolve-route.test.ts`
- `src/routing/session-key.test.ts`

测试覆盖结论：

- 已覆盖默认路由、各 tier 优先级、parentPeer 继承、roles 路由、legacy `dm` 兼容、dmScope 各模式。
- 定向执行结果：45/45 通过。
- 执行命令：`pnpm test:fast src/routing/resolve-route.test.ts src/routing/session-key.test.ts`

## 3. 依赖与边界

上游输入：

- `OpenClawConfig`（`bindings`, `agents`, `session`）
- 各 channel monitor 的运行时上下文（peer/guild/team/roles/account）

下游影响：

- 会话存储键格式
- agent 选择结果
- 后续消息上下文隔离/归并行为

关键外部依赖：

- `normalizeChatType`（支持 `dm -> direct`）：`src/channels/chat-type.ts:3`
- `normalizeChatChannelId`：`src/channels/registry.ts:138`
- `resolveDefaultAgentId`：`src/agents/agent-scope.ts:61`
- `parseAgentSessionKey`：`src/sessions/session-key-utils.ts:6`

## 4. 本批已完成文件清单

- `src/routing/bindings.ts`
- `src/routing/resolve-route.ts`
- `src/routing/session-key.ts`
- `src/routing/resolve-route.test.ts`
- `src/routing/session-key.test.ts`

## 5. 下一批建议

优先建议继续研究与 routing 强耦合且规模适中的模块：

1. `src/telegram/accounts.ts` + `src/commands/health.ts`（bindings 消费侧）
2. `src/gateway/server-session-key.ts` + `src/config/sessions/*`（session key 生命周期）
3. `src/discord/monitor/*` 中调用 `resolveAgentRoute` 的主路径（高频入口）
