# chunk_015_src_slack_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：62
- 实际可读文件数：62
- 缺失/不可读文件数：0
- 主目录组：`src/slack`
- 代码总行数（近似）：9912

## 2. 模块要点
- 文件类型分布：module=46，test=16，doc=0，config=0。
- 导入语句总数（近似）：313。
- 重点文件（按行数）与导出摘要：
  - `src/slack/monitor.tool-result.test.ts`: 823 行，imports=5，exports=无显式导出。
  - `src/slack/monitor/message-handler/prepare.ts`: 667 行，imports=35，exports=prepareSlackMessage。
  - `src/slack/monitor/message-handler/prepare.test.ts`: 639 行，imports=15，exports=无显式导出。
  - `src/slack/monitor/slash.ts`: 637 行，imports=18，exports=registerSlackMonitorSlashCommands。
  - `src/slack/monitor/media.test.ts`: 548 行，imports=4，exports=无显式导出。
  - `src/slack/monitor/context.ts`: 420 行，imports=15，exports=inferSlackChannelType, normalizeSlackChannelType, SlackMonitorContext, createSlackMonitorContext。
  - `src/slack/monitor/media.ts`: 396 行，imports=6，exports=fetchWithSlackAuth, SlackMediaResult, resolveSlackMedia, SlackThreadStarter, resolveSlackThreadStarter, resetSlackThreadStarterCacheForTest。
  - `src/slack/monitor/provider.ts`: 366 行，imports=24，exports=monitorSlackProvider。
  - `src/slack/send.ts`: 297 行，imports=12，exports=SlackSendIdentity, SlackSendResult, sendMessageSlack。
  - `src/slack/monitor/monitor.test.ts`: 290 行，imports=9，exports=无显式导出。
  - `src/slack/actions.ts`: 264 行，imports=7，exports=SlackActionClientOpts, SlackMessageSummary, SlackPin, reactSlackMessage, removeSlackReaction, removeOwnSlackReactions。
  - `src/slack/monitor.test-helpers.ts`: 212 行，imports=1，exports=getSlackTestState, getSlackHandlers, getSlackClient, flush, waitForSlackEvent, startSlackMonitor。
  - `src/slack/monitor/message-handler/dispatch.ts`: 198 行，imports=14，exports=dispatchPreparedSlackMessage。
  - `src/slack/monitor/slash.test.ts`: 191 行，imports=2，exports=无显式导出。
  - `src/slack/resolve-users.ts`: 189 行，imports=2，exports=SlackUserLookup, SlackUserResolution, resolveSlackUserAllowlist。
  - `src/slack/monitor.threading.missing-thread-ts.test.ts`: 185 行，imports=2，exports=无显式导出。
  - `src/slack/directory-live.ts`: 185 行，imports=4，exports=listSlackDirectoryPeersLive, listSlackDirectoryGroupsLive。
  - `src/slack/monitor.test.ts`: 174 行，imports=2，exports=无显式导出。
  - `src/slack/monitor/replies.ts`: 170 行，imports=9，exports=deliverReplies, SlackRespondFn, resolveSlackThreadTs, createSlackReplyDeliveryPlan, deliverSlackSlashReplies。
  - `src/slack/monitor/events/channels.ts`: 157 行，imports=9，exports=registerSlackChannelEvents。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 31 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 15 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 8 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/slack` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

