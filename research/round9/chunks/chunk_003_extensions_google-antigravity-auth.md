# chunk_003_extensions_google-antigravity-auth 研究笔记

## 1. 覆盖确认
- 清单文件数：94
- 实际可读文件数：94
- 缺失/不可读文件数：0
- 主目录组：`extensions/irc, extensions/googlechat, extensions/mattermost, extensions/line`
- 代码总行数（近似）：12794

## 2. 模块要点
- 文件类型分布：module=52，test=20，doc=4，config=18。
- 导入语句总数（近似）：243。
- 重点文件（按行数）与导出摘要：
  - `extensions/googlechat/src/monitor.ts`: 960 行，imports=8，exports=GoogleChatRuntimeEnv, GoogleChatMonitorOptions, registerGoogleChatWebhookTarget, handleGoogleChatWebhookRequest, isSenderAllowed, monitorGoogleChatProvider。
  - `extensions/line/src/channel.ts`: 802 行，imports=2，exports=linePlugin。
  - `extensions/google-gemini-cli-auth/oauth.ts`: 640 行，imports=5，exports=GeminiCliOAuthCredentials, GeminiCliOAuthContext, clearCredentialsCache, extractGeminiCliCredentials, loginGeminiCliOAuth。
  - `extensions/googlechat/src/channel.ts`: 569 行，imports=9，exports=googlechatDock, googlechatPlugin。
  - `extensions/irc/src/onboarding.ts`: 480 行，imports=4，exports=ircOnboardingAdapter。
  - `extensions/irc/src/client.ts`: 440 行，imports=3，exports=IrcPrivmsgEvent, IrcClientOptions, IrcNickServOptions, IrcClient, buildIrcNickServCommands, connectIrcClient。
  - `extensions/google-antigravity-auth/index.ts`: 425 行，imports=3，exports=无显式导出。
  - `extensions/irc/src/channel.ts`: 368 行，imports=11，exports=ircPlugin。
  - `extensions/line/src/card-command.ts`: 345 行，imports=2，exports=registerLineCardCommand。
  - `extensions/mattermost/src/channel.ts`: 338 行，imports=11，exports=mattermostPlugin。
  - `extensions/irc/src/inbound.ts`: 335 行，imports=7，exports=handleIrcInbound。
  - `extensions/lobster/src/lobster-tool.ts`: 330 行，imports=5，exports=createLobsterTool。
  - `extensions/line/src/channel.sendPayload.test.ts`: 307 行，imports=4，exports=无显式导出。
  - `extensions/imessage/src/channel.ts`: 295 行，imports=2，exports=imessagePlugin。
  - `extensions/googlechat/src/api.ts`: 283 行，imports=4，exports=sendGoogleChatMessage, updateGoogleChatMessage, deleteGoogleChatMessage, uploadGoogleChatAttachment, downloadGoogleChatMedia, createGoogleChatReaction。
  - `extensions/googlechat/src/onboarding.ts`: 270 行，imports=3，exports=googlechatOnboardingAdapter。
  - `extensions/irc/src/accounts.ts`: 269 行，imports=3，exports=ResolvedIrcAccount, listIrcAccountIds, resolveDefaultIrcAccountId, resolveIrcAccount, listEnabledIrcAccounts。
  - `extensions/llm-task/src/llm-task-tool.ts`: 250 行，imports=6，exports=createLlmTaskTool。
  - `extensions/lobster/src/lobster-tool.test.ts`: 242 行，imports=7，exports=无显式导出。
  - `extensions/mattermost/src/mattermost/client.ts`: 221 行，imports=0，exports=MattermostClient, MattermostUser, MattermostChannel, MattermostPost, MattermostFileInfo, normalizeMattermostBaseUrl。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 33 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 14 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 9 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/irc, extensions/googlechat, extensions/mattermost, extensions/line, extensions/lobster, extensions/google-gemini-cli-auth` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

