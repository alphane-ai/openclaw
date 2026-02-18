**1) 覆盖确认**
- 完整遍历 `/tmp/research_round4/chunk_14_slack.txt` 中列出的 62 个 Slack 相关文件。
- 文件清单（顺序与原列表一致）：
  - src/slack/accounts.ts
  - src/slack/actions.read.test.ts
  - src/slack/actions.ts
  - src/slack/channel-migration.test.ts
  - src/slack/channel-migration.ts
  - src/slack/client.test.ts
  - src/slack/client.ts
  - src/slack/directory-live.ts
  - src/slack/format.test.ts
  - src/slack/format.ts
  - src/slack/http/index.ts
  - src/slack/http/registry.test.ts
  - src/slack/http/registry.ts
  - src/slack/index.ts
  - src/slack/message-actions.ts
  - src/slack/monitor.test-helpers.ts
  - src/slack/monitor.test.ts
  - src/slack/monitor.threading.missing-thread-ts.test.ts
  - src/slack/monitor.tool-result.test.ts
  - src/slack/monitor.ts
  - src/slack/monitor/allow-list.ts
  - src/slack/monitor/auth.ts
  - src/slack/monitor/channel-config.ts
  - src/slack/monitor/commands.ts
  - src/slack/monitor/context.ts
  - src/slack/monitor/events.ts
  - src/slack/monitor/events/channels.ts
  - src/slack/monitor/events/members.ts
  - src/slack/monitor/events/messages.ts
  - src/slack/monitor/events/pins.ts
  - src/slack/monitor/events/reactions.ts
  - src/slack/monitor/media.test.ts
  - src/slack/monitor/media.ts
  - src/slack/monitor/message-handler.ts
  - src/slack/monitor/message-handler/dispatch.ts
  - src/slack/monitor/message-handler/prepare.test.ts
  - src/slack/monitor/message-handler/prepare.ts
  - src/slack/monitor/message-handler/types.ts
  - src/slack/monitor/monitor.test.ts
  - src/slack/monitor/policy.ts
  - src/slack/monitor/provider.ts
  - src/slack/monitor/replies.ts
  - src/slack/monitor/room-context.ts
  - src/slack/monitor/slash.test-harness.ts
  - src/slack/monitor/slash.test.ts
  - src/slack/monitor/slash.ts
  - src/slack/monitor/thread-resolution.ts
  - src/slack/monitor/types.ts
  - src/slack/probe.ts
  - src/slack/resolve-channels.test.ts
  - src/slack/resolve-channels.ts
  - src/slack/resolve-users.ts
  - src/slack/scopes.ts
  - src/slack/send.ts
  - src/slack/targets.test.ts
  - src/slack/targets.ts
  - src/slack/threading-tool-context.test.ts
  - src/slack/threading-tool-context.ts
  - src/slack/threading.test.ts
  - src/slack/threading.ts
  - src/slack/token.ts
  - src/slack/types.ts

**2) 模块要点**
- `accounts.ts` 负责合并全局/账户配置、规范化 token、记录 token 来源以及按照聊天类型返回正确的 `replyToMode`。
- `actions.ts` 抽象出 WebClient 交互（读、写、反应、thread、pins 等），统一 token 解析并将发送委托给 `sendMessageSlack`。
- `send.ts` 完成 chunking（`auto-reply/chunk` + `markdown` 处理）、自定义身份（`chat:write.customize`）、media 上传、thread/DM 目标解析和 token 回退策略。
- `format.ts` 提供 Slack mrkdwn 转换与 chunk 切分，保障特殊字符/链接/表格在 Slack 中安全呈现；`targets.ts` 负责用户/频道目标解析。
- `client.ts` 封装 Slack WebClient，默认带重试配置；`probe.ts` 用于探测 `auth.test`；`scopes.ts` 用于检查当前 token 的权限。
- `directory-live.ts` 支持 Slack 目录插件，实时拉取用户与频道做模糊匹配；`message-actions.ts` 与现有 actions 组合使用。
- `resolve-channels.ts` 与 `resolve-users.ts` 用 token 校准 allowlist 条目，provider 中会在 `registerSlackMonitorEvents` 前触发，支撑配置写入与 `channel-config`。
- `threading*` 系列实现对 thread_ts 的修补、session key 的推导、以及工具上下文的构建，确保回复、工具标记、状态更新一致。
- `monitor/*` 组合：`provider.ts` 初始化 Slack Bolt（socket/http）、配置限流/allowlist、注入 `context`；`context.ts` 提供缓存、权限判断、session key、thread status 控制等辅助；`events` 目录记录 channel/member/pin/reaction 系统事件；`message-handler` 引入 `prepare`/`dispatch` 流程；`replies.ts`/`slash.ts` 分别负责回复投递与 slash 命令。
- `channel-migration.ts` 支持旧 channel id 迁移；监控、测试 (`*.test.ts`、`monitor.tool-result.test.ts` 等) 覆盖了流动 pipeline、thread 解析和 helpers。

**3) 关键调用链**
1. **Slack inbound message**：Bolt 事件 → `registerSlackMessageEvents`（`events/messages.ts`） → `handleSlackMessage`（`monitor/message-handler.ts`）→ 去抖 `createInboundDebouncer` → `prepareSlackMessage`（解析 allowlist、pairing、history、ack 反应、session key、media、thread context）→ `dispatchPreparedSlackMessage` → `dispatchInboundMessage` + `createReplyDispatcherWithTyping` → `deliverReplies`/`createSlackReplyDeliveryPlan` → `sendMessageSlack`（chunk、media 处理）→ Slack API。
2. **slash 命令**：Bolt command/action 或自定义按钮触发 → `registerSlackMonitorSlashCommands` → 授权/allowlist/命令解析 → `finalizeInboundContext` 构建 `ctxPayload` → `dispatchReplyWithDispatcher` → `deliverSlackSlashReplies`（`deliverSlackSlashReplies` 同步 `respond`）→ Slack 响应。
3. **Outbound action/send path**：`actions.ts`（`react`, `send`, `list`）→ 统一 token + retry（`resolveToken` + `createSlackWebClient`）→ `sendMessageSlack`（`chunkMarkdownTextWithMode`, `markdownToSlackMrkdwnChunks`, `uploadSlackFile`）→ Slack REST API。`send.ts` 也处理 custom identity scopes、thread/channel 解析 (`parseSlackTarget`)、media 限制。

**4) 风险**
- Slack bot/app token 缺失或格式不对会在 `resolveSlackAccount`/`sendMessageSlack` 抛错，默认仅允许 `DEFAULT_ACCOUNT_ID` 使用 env 变量，其他账户必须在配置中显式设置。
- `replyToMode`、`thread_resolution` 与 `threadInheritParent` 逻辑复杂，若 session key 切换或 threadHistoryScope 配置不当，可能导致历史上下文被截断或重复，影响 agent 记忆。
- `groupPolicy`、`channelsConfig`、`allowFrom` 解析依赖 `resolveSlackChannelAllowlist/resolveSlackUserAllowlist` 的 WebClient 调用，若 token 作用范围不够或 Slack API 限率，注册阶段就会回退到原有配置，影响漏斗逻辑。
- 自定义身份（`chat:write.customize`）依赖额外 scope，缺失时降级并记录；media 下载依赖 `url_private_download`，但 `resolveSlackMedia` 会拒绝非 Slack 域以防 token 泄露，可能导致某些文件无法抓取。冗余的 `seenMessages` 去重与 `inbound debounce` 也增加了误判风险。

**5) 与已研究模块关联**
- 与 `auto-reply` 系列（`dispatch.ts`、`reply-receiver`、`commands-registry`、`chunk.ts`、`templating.ts`）高度耦合：Slack monitor 准备上下文后调用 `dispatchInboundMessage`/`createReplyDispatcherWithTyping`，出厂 reply 流与其他渠道一致。
- 与 `channels`（`command-gating.ts`、`conversation-label.ts`、`ack-reactions.ts`、`session-key.ts`）共享逻辑，如命令授权、mention gating、ack reaction、session key 生成以及 `resolveAgentRoute` 路由，确保跨渠道一致性。
- 与 `pairing/pairing-store`、`routing/resolve-route`、`config/sessions`、`channels/plugins/config-writes` 等共同确保 pairing DM、channel allowlist 写入、session 更新等全链路行为在主控模块中可追踪。
