# chunk_013_src_discord_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：34
- 实际可读文件数：34
- 缺失/不可读文件数：0
- 主目录组：`src/discord`
- 代码总行数（近似）：6216

## 2. 模块要点
- 文件类型分布：module=27，test=7，doc=0，config=0。
- 导入语句总数（近似）：189。
- 重点文件（按行数）与导出摘要：
  - `src/discord/monitor/provider.ts`: 693 行，imports=32，exports=MonitorDiscordOpts, monitorDiscordProvider, __testing。
  - `src/discord/send.sends-basic-channel-messages.test.ts`: 538 行，imports=4，exports=无显式导出。
  - `src/discord/send.shared.ts`: 491 行，imports=15，exports=DiscordSendComponentFactory, DiscordSendComponents, DiscordSendEmbeds, parseAndResolveRecipient, SUPPRESS_NOTIFICATIONS_FLAG, buildDiscordTextChunks。
  - `src/discord/send.outbound.ts`: 445 行，imports=21，exports=sendMessageDiscord, sendStickerDiscord, sendPollDiscord, sendVoiceMessageDiscord。
  - `src/discord/monitor/threading.ts`: 437 行，imports=10，exports=DiscordThreadChannel, DiscordThreadStarter, __resetDiscordThreadStarterCacheForTest, resolveDiscordThreadChannel, resolveDiscordThreadParentInfo, resolveDiscordThreadStarter。
  - `src/discord/send.creates-thread.test.ts`: 428 行，imports=5，exports=无显式导出。
  - `src/discord/voice-message.ts`: 324 行，imports=8，exports=VoiceMessageMetadata, getAudioDuration, generateWaveform, ensureOggOpus, getVoiceMessageMetadata, sendDiscordVoiceMessage。
  - `src/discord/resolve-channels.ts`: 306 行，imports=4，exports=DiscordChannelResolution, resolveDiscordChannelAllowlist。
  - `src/discord/send.messages.ts`: 181 行，imports=4，exports=readMessagesDiscord, fetchMessageDiscord, editMessageDiscord, deleteMessageDiscord, pinMessageDiscord, unpinMessageDiscord。
  - `src/discord/probe.ts`: 176 行，imports=4，exports=DiscordProbe, DiscordPrivilegedIntentStatus, DiscordPrivilegedIntentsSummary, DiscordApplicationSummary, resolveDiscordPrivilegedIntentsFromFlags, fetchDiscordApplicationSummary。
  - `src/discord/send.components.ts`: 170 行，imports=11，exports=sendDiscordComponentMessage。
  - `src/discord/send.types.ts`: 164 行，imports=2，exports=DiscordSendError, DISCORD_MAX_EMOJI_BYTES, DISCORD_MAX_STICKER_BYTES, DiscordSendResult, DiscordReactOpts, DiscordReactionUser。
  - `src/discord/targets.ts`: 163 行，imports=3，exports=DiscordTargetKind, DiscordTarget, parseDiscordTarget, resolveDiscordChannelId, resolveDiscordTarget。
  - `src/discord/resolve-users.ts`: 163 行，imports=4，exports=DiscordUserResolution, resolveDiscordUserAllowlist。
  - `src/discord/send.guild.ts`: 141 行，imports=4，exports=fetchMemberInfoDiscord, fetchRoleInfoDiscord, addRoleDiscord, removeRoleDiscord, fetchChannelInfoDiscord, listGuildChannelsDiscord。
  - `src/discord/send.permissions.ts`: 132 行，imports=5，exports=isThreadChannelType, fetchChannelPermissionsDiscord。
  - `src/discord/send.channels.ts`: 124 行，imports=4，exports=createChannelDiscord, editChannelDiscord, deleteChannelDiscord, moveChannelDiscord, setChannelPermissionDiscord, removeChannelPermissionDiscord。
  - `src/discord/send.reactions.ts`: 123 行，imports=4，exports=reactMessageDiscord, removeReactionDiscord, removeOwnReactionsDiscord, fetchReactionsDiscord。
  - `src/discord/resolve-channels.test.ts`: 114 行，imports=2，exports=无显式导出。
  - `src/discord/targets.test.ts`: 113 行，imports=5，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- network: 命中 19 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 16 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 9 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/discord` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

