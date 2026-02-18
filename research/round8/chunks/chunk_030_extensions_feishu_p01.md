# chunk_030_extensions_feishu_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：48
- 实际可读文件数：48
- 缺失/不可读文件数：0
- 主目录组：`extensions/feishu`
- 代码总行数（近似）：8185

## 2. 模块要点
- 文件类型分布：module=34，test=7，doc=5，config=2。
- 导入语句总数（近似）：166。
- 重点文件（按行数）与导出摘要：
  - `extensions/feishu/src/bot.ts`: 953 行，imports=14，exports=FeishuMessageEvent, FeishuBotAddedEvent, parseFeishuMessageEvent, handleFeishuMessage。
  - `extensions/feishu/src/docx.ts`: 537 行，imports=9，exports=registerFeishuDocTools。
  - `extensions/feishu/src/media.ts`: 477 行，imports=9，exports=DownloadImageResult, DownloadMessageResourceResult, downloadImageFeishu, downloadMessageResourceFeishu, UploadImageResult, UploadFileResult。
  - `extensions/feishu/src/bitable.ts`: 462 行，imports=4，exports=registerFeishuBitableTools。
  - `extensions/feishu/src/send.ts`: 363 行，imports=8，exports=FeishuMessageInfo, getMessageFeishu, SendFeishuMessageParams, sendMessageFeishu, SendFeishuCardParams, sendCardFeishu。
  - `extensions/feishu/src/onboarding.ts`: 360 行，imports=5，exports=feishuOnboardingAdapter。
  - `extensions/feishu/src/channel.ts`: 352 行，imports=11，exports=feishuPlugin。
  - `extensions/feishu/src/monitor.ts`: 331 行，imports=8，exports=MonitorFeishuOpts, monitorFeishuProvider, stopFeishuMonitor。
  - `extensions/feishu/src/bot.test.ts`: 266 行，imports=5，exports=无显式导出。
  - `extensions/feishu/src/reply-dispatcher.ts`: 240 行，imports=10，exports=CreateFeishuReplyDispatcherParams, createFeishuReplyDispatcher。
  - `extensions/feishu/src/wiki.ts`: 233 行，imports=6，exports=registerFeishuWikiTools。
  - `extensions/feishu/src/drive.ts`: 228 行，imports=6，exports=registerFeishuDriveTools。
  - `extensions/feishu/src/streaming-card.ts`: 224 行，imports=2，exports=FeishuStreamingSession。
  - `extensions/feishu/src/config-schema.ts`: 207 行，imports=1，exports=FeishuGroupSchema, FeishuAccountConfigSchema, FeishuConfigSchema。
  - `extensions/feishu/src/media.test.ts`: 188 行，imports=2，exports=无显式导出。
  - `extensions/feishu/src/directory.ts`: 178 行，imports=4，exports=FeishuDirectoryPeer, FeishuDirectoryGroup, listFeishuDirectoryPeers, listFeishuDirectoryGroups, listFeishuDirectoryPeersLive, listFeishuDirectoryGroupsLive。
  - `extensions/feishu/src/perm.ts`: 174 行，imports=6，exports=registerFeishuPermTools。
  - `extensions/feishu/src/reactions.ts`: 161 行，imports=3，exports=FeishuReaction, addReactionFeishu, removeReactionFeishu, listReactionsFeishu, FeishuEmoji, FeishuEmojiType。
  - `extensions/feishu/src/accounts.ts`: 145 行，imports=3，exports=listFeishuAccountIds, resolveDefaultFeishuAccountId, resolveFeishuCredentials, resolveFeishuAccount, listEnabledFeishuAccounts。
  - `extensions/feishu/src/dynamic-agent.ts`: 132 行，imports=5，exports=MaybeCreateDynamicAgentResult, maybeCreateDynamicAgent。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 27 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 19 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 1 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/feishu` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

