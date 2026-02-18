# chunk_014_ui_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：87
- 实际可读文件数：87
- 缺失/不可读文件数：0
- 主目录组：`ui/src`
- 代码总行数（近似）：13466

## 2. 模块要点
- 文件类型分布：module=68，test=18，doc=0，config=1。
- 导入语句总数（近似）：241。
- 重点文件（按行数）与导出摘要：
  - `ui/src/ui/types.ts`: 567 行，imports=0，exports=ChannelsStatusSnapshot, ChannelUiMetaEntry, CRON_CHANNEL_LAST, ChannelAccountSnapshot, WhatsAppSelf, WhatsAppDisconnect。
  - `ui/src/ui/views/chat.ts`: 565 行，imports=12，exports=CompactionIndicatorStatus, ChatProps, renderChat。
  - `ui/src/ui/views/agents-panels-status-files.ts`: 506 行，imports=5，exports=renderAgentChannels, renderAgentCron, renderAgentFiles。
  - `ui/src/ui/views/agents.ts`: 490 行，imports=5，exports=AgentsPanel, AgentsProps, AgentContext, renderAgents。
  - `ui/src/ui/views/agents-panels-tools-skills.ts`: 478 行，imports=7，exports=renderAgentTools, renderAgentSkills。
  - `ui/src/ui/controllers/config/form-utils.node.test.ts`: 472 行，imports=4，exports=无显式导出。
  - `ui/src/ui/views/agents-utils.ts`: 471 行，imports=3，exports=TOOL_SECTIONS, PROFILE_OPTIONS, normalizeAgentLabel, resolveAgentEmoji, agentBadgeText, formatBytes。
  - `ui/src/ui/views/channels.ts`: 326 行，imports=14，exports=renderChannels。
  - `ui/src/ui/views/channels.nostr-profile-form.ts`: 322 行，imports=2，exports=NostrProfileFormState, NostrProfileFormCallbacks, renderNostrProfileForm, createNostrProfileFormState。
  - `ui/src/ui/usage-helpers.ts`: 322 行，imports=0，exports=UsageQueryTerm, UsageQueryResult, UsageSessionQueryTarget, extractQueryTerms, matchesUsageQuery, filterSessionsByQuery。
  - `ui/src/ui/gateway.ts`: 313 行，imports=5，exports=GatewayEventFrame, GatewayResponseFrame, GatewayHelloOk, GatewayBrowserClientOptions, GatewayBrowserClient。
  - `ui/src/ui/controllers/config.test.ts`: 296 行，imports=2，exports=无显式导出。
  - `ui/src/ui/chat/grouped-render.ts`: 283 行，imports=10，exports=renderReadingIndicatorGroup, renderStreamingGroup, renderMessageGroup。
  - `ui/src/ui/config-form.browser.test.ts`: 260 行，imports=3，exports=无显式导出。
  - `ui/src/ui/icons.ts`: 257 行，imports=1，exports=icons, IconName, icon, renderIcon, renderEmojiIcon, setEmojiIcon。
  - `ui/src/ui/controllers/cron.ts`: 245 行，imports=4，exports=CronState, supportsAnnounceDelivery, normalizeCronFormState, loadCronStatus, loadCronJobs, buildCronSchedule。
  - `ui/src/ui/controllers/chat.ts`: 242 行，imports=4，exports=ChatState, ChatEventPayload, loadChatHistory, sendChatMessage, abortChatRun, handleChatEvent。
  - `ui/src/ui/views/channels.nostr.ts`: 238 行，imports=6，exports=renderNostrCard。
  - `ui/src/ui/tool-display.json`: 237 行，imports=0，exports=无显式导出。
  - `ui/src/ui/navigation.ts`: 223 行，imports=1，exports=TAB_GROUPS, Tab, normalizeBasePath, normalizePath, pathForTab, tabFromPath。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- network: 命中 25 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 19 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 18 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 5 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `ui/src` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

