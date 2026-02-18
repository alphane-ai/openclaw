# chunk_017_src_line_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：46
- 实际可读文件数：46
- 缺失/不可读文件数：0
- 主目录组：`src/line`
- 代码总行数（近似）：7709

## 2. 模块要点
- 文件类型分布：module=31，test=15，doc=0，config=0。
- 导入语句总数（近似）：161。
- 重点文件（按行数）与导出摘要：
  - `src/line/send.ts`: 584 行，imports=7，exports=createImageMessage, createLocationMessage, sendMessageLine, pushMessageLine, replyMessageLine, pushMessagesLine。
  - `src/line/flex-templates/media-control-cards.ts`: 556 行，imports=1，exports=createMediaPlayerCard, createAppleTvRemoteCard, createDeviceControlCard。
  - `src/line/bot-message-context.ts`: 469 行，imports=10，exports=LineSourceInfo, getLineSourceInfo, buildLineMessageContext, buildLinePostbackContext, LineMessageContext, LinePostbackContext。
  - `src/line/flex-templates/schedule-cards.ts`: 468 行，imports=2，exports=createReceiptCard, createEventCard, createAgendaCard。
  - `src/line/markdown-to-line.ts`: 452 行，imports=2，exports=ProcessedLineMessage, extractMarkdownTables, MarkdownTable, convertTableToFlexBubble, extractCodeBlocks, CodeBlock。
  - `src/line/rich-menu.ts`: 397 行，imports=7，exports=RichMenuSize, RichMenuAreaRequest, CreateRichMenuParams, createRichMenu, uploadRichMenuImage, setDefaultRichMenu。
  - `src/line/flex-templates/basic-cards.ts`: 396 行，imports=2，exports=createInfoCard, createListCard, createImageCard, createActionCard, createCarousel, createNotificationBubble。
  - `src/line/template-messages.ts`: 352 行，imports=3，exports=createConfirmTemplate, createButtonTemplate, createTemplateCarousel, createCarouselColumn, createImageCarousel, createImageCarouselColumn。
  - `src/line/markdown-to-line.test.ts`: 340 行，imports=2，exports=无显式导出。
  - `src/line/bot-handlers.ts`: 324 行，imports=12，exports=LineHandlerContext, handleLineWebhookEvents。
  - `src/line/monitor.ts`: 323 行，imports=17，exports=MonitorLineProviderOptions, LineProviderMonitor, getLineRuntimeState, monitorLineProvider。
  - `src/line/bot-handlers.test.ts`: 215 行，imports=2，exports=无显式导出。
  - `src/line/auto-reply-delivery.test.ts`: 184 行，imports=4，exports=无显式导出。
  - `src/line/accounts.ts`: 182 行，imports=3，exports=DEFAULT_ACCOUNT_ID, resolveLineAccount, listLineAccountIds, resolveDefaultLineAccountId, normalizeAccountId。
  - `src/line/auto-reply-delivery.ts`: 176 行，imports=6，exports=LineAutoReplyDeps, deliverLineAutoReply。
  - `src/line/index.ts`: 156 行，imports=0，exports=(anonymous-or-reexport)。
  - `src/line/webhook-node.test.ts`: 155 行，imports=4，exports=无显式导出。
  - `src/line/types.ts`: 154 行，imports=2，exports=LineTokenSource, LineConfig, LineAccountConfig, LineGroupConfig, ResolvedLineAccount, LineMessageType。
  - `src/line/template-messages.test.ts`: 149 行，imports=2，exports=无显式导出。
  - `src/line/webhook.test.ts`: 143 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 27 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 10 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 1 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- command_exec: 命中 1 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/line` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

