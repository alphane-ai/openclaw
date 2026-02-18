# chunk_012_src_discord_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：44
- 实际可读文件数：44
- 缺失/不可读文件数：0
- 主目录组：`src/discord`
- 代码总行数（近似）：12930

## 2. 模块要点
- 文件类型分布：module=28，test=16，doc=0，config=0。
- 导入语句总数（近似）：281。
- 重点文件（按行数）与导出摘要：
  - `src/discord/monitor/agent-components.ts`: 1578 行，imports=29，exports=AgentComponentContext, buildAgentButtonCustomId, buildAgentSelectCustomId, AgentComponentButton, AgentSelectMenu, createAgentComponentButton。
  - `src/discord/components.ts`: 1121 行，imports=3，exports=DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_MODAL_CUSTOM_ID_KEY, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DiscordComponentButtonStyle, DiscordComponentSelectType, DiscordComponentModalFieldType。
  - `src/discord/monitor.test.ts`: 956 行，imports=5，exports=无显式导出。
  - `src/discord/monitor/native-command.ts`: 935 行，imports=24，exports=createDiscordCommandArgFallbackButton, createDiscordNativeCommand。
  - `src/discord/monitor/monitor.test.ts`: 820 行，imports=15，exports=无显式导出。
  - `src/discord/monitor/exec-approvals.ts`: 810 行，imports=15，exports=extractDiscordChannelId, buildExecApprovalCustomId, parseExecApprovalData, DiscordExecApprovalHandlerOpts, DiscordExecApprovalHandler, ExecApprovalButtonContext。
  - `src/discord/monitor/exec-approvals.test.ts`: 664 行，imports=9，exports=无显式导出。
  - `src/discord/monitor.tool-result.accepts-guild-messages-mentionpatterns-match.e2e.test.ts`: 664 行，imports=6，exports=无显式导出。
  - `src/discord/monitor/message-handler.preflight.ts`: 656 行，imports=27，exports=preflightDiscordMessage。
  - `src/discord/monitor/allow-list.ts`: 531 行，imports=4，exports=DiscordAllowList, DiscordAllowListMatch, DiscordGuildEntryResolved, DiscordChannelConfigResolved, normalizeDiscordAllowList, normalizeDiscordSlug。
  - `src/discord/monitor/message-handler.process.ts`: 455 行，imports=30，exports=processDiscordMessage。
  - `src/discord/monitor.tool-result.sends-status-replies-responseprefix.test.ts`: 411 行，imports=6，exports=无显式导出。
  - `src/discord/monitor/listeners.ts`: 331 行，imports=10，exports=DiscordMessageEvent, DiscordMessageHandler, registerDiscordListener, DiscordMessageListener, DiscordReactionListener, DiscordReactionRemoveListener。
  - `src/discord/monitor/message-utils.ts`: 315 行，imports=5，exports=DiscordMediaInfo, DiscordChannelInfo, __resetDiscordChannelInfoCacheForTest, resolveDiscordMessageChannelId, resolveDiscordChannelInfo, resolveMediaList。
  - `src/discord/chunk.ts`: 278 行，imports=1，exports=ChunkDiscordTextOpts, chunkDiscordText, chunkDiscordTextWithMode。
  - `src/discord/monitor/message-handler.inbound-contract.test.ts`: 183 行，imports=8，exports=无显式导出。
  - `src/discord/chunk.test.ts`: 156 行，imports=2，exports=无显式导出。
  - `src/discord/monitor/message-handler.process.test.ts`: 156 行，imports=4，exports=无显式导出。
  - `src/discord/api.ts`: 137 行，imports=2，exports=DiscordApiError, DiscordFetchOptions, fetchDiscord。
  - `src/discord/audit.ts`: 137 行，imports=5，exports=DiscordChannelPermissionsAuditEntry, DiscordChannelPermissionsAudit, collectDiscordAuditChannelIds, auditDiscordChannelPermissions。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- network: 命中 20 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 18 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 13 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/discord` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

