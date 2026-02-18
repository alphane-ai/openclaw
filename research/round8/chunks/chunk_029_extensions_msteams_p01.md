# chunk_029_extensions_msteams_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：65
- 实际可读文件数：65
- 缺失/不可读文件数：0
- 主目录组：`extensions/msteams`
- 代码总行数（近似）：9793

## 2. 模块要点
- 文件类型分布：module=48，test=14，doc=1，config=2。
- 导入语句总数（近似）：200。
- 重点文件（按行数）与导出摘要：
  - `extensions/msteams/src/monitor-handler/message-handler.ts`: 653 行，imports=13，exports=createMSTeamsMessageHandler。
  - `extensions/msteams/src/send.ts`: 520 行，imports=12，exports=SendMSTeamsMessageParams, SendMSTeamsMessageResult, SendMSTeamsPollParams, SendMSTeamsPollResult, SendMSTeamsCardParams, SendMSTeamsCardResult。
  - `extensions/msteams/src/messenger.ts`: 496 行，imports=10，exports=MSTeamsConversationReference, MSTeamsAdapter, MSTeamsReplyRenderOptions, MSTeamsRenderedMessage, MSTeamsSendRetryOptions, MSTeamsSendRetryEvent。
  - `extensions/msteams/src/attachments.test.ts`: 460 行，imports=3，exports=无显式导出。
  - `extensions/msteams/src/channel.ts`: 454 行，imports=10，exports=msteamsPlugin。
  - `extensions/msteams/src/graph-upload.ts`: 454 行，imports=1，exports=OneDriveUploadResult, uploadToOneDrive, OneDriveSharingLink, createSharingLink, uploadAndShareOneDrive, uploadToSharePoint。
  - `extensions/msteams/src/onboarding.ts`: 408 行，imports=4，exports=msteamsOnboardingAdapter。
  - `extensions/msteams/src/attachments/graph.ts`: 354 行，imports=4，exports=buildMSTeamsGraphMessageUrls, downloadMSTeamsGraphMedia。
  - `extensions/msteams/src/messenger.test.ts`: 329 行，imports=8，exports=无显式导出。
  - `extensions/msteams/src/polls.ts`: 316 行，imports=3，exports=MSTeamsPollVote, MSTeamsPoll, MSTeamsPollStore, MSTeamsPollCard, extractMSTeamsPollVote, buildMSTeamsPollCard。
  - `extensions/msteams/src/monitor.ts`: 306 行，imports=12，exports=MonitorMSTeamsOpts, MonitorMSTeamsResult, monitorMSTeamsProvider。
  - `extensions/msteams/src/attachments/shared.ts`: 292 行，imports=1，exports=IMAGE_EXT_RE, IMG_SRC_RE, ATTACHMENT_TAG_RE, DEFAULT_MEDIA_HOST_ALLOWLIST, DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST, GRAPH_ROOT。
  - `extensions/msteams/src/attachments/download.ts`: 284 行，imports=3，exports=downloadMSTeamsAttachments, downloadMSTeamsImageAttachments。
  - `extensions/msteams/src/policy.ts`: 258 行，imports=2，exports=MSTeamsResolvedRouteConfig, resolveMSTeamsRouteConfig, resolveMSTeamsGroupToolPolicy, MSTeamsReplyPolicy, MSTeamsAllowlistMatch, resolveMSTeamsAllowlistMatch。
  - `extensions/msteams/src/file-consent-helpers.test.ts`: 244 行，imports=3，exports=无显式导出。
  - `extensions/msteams/src/mentions.test.ts`: 236 行，imports=2，exports=无显式导出。
  - `extensions/msteams/src/resolve-allowlist.ts`: 217 行，imports=1，exports=MSTeamsChannelResolution, MSTeamsUserResolution, normalizeMSTeamsMessagingTarget, normalizeMSTeamsUserInput, parseMSTeamsConversationId, parseMSTeamsTeamChannelInput。
  - `extensions/msteams/src/policy.test.ts`: 210 行，imports=3，exports=无显式导出。
  - `extensions/msteams/src/media-helpers.test.ts`: 199 行，imports=2，exports=无显式导出。
  - `extensions/msteams/src/errors.ts`: 191 行，imports=0，exports=formatUnknownError, MSTeamsSendErrorKind, MSTeamsSendErrorClassification, classifyMSTeamsSendError, formatMSTeamsSendErrorHint。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 28 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 9 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/msteams` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

