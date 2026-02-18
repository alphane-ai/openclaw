# chunk_007_src_auto-reply_p03 研究笔记

## 1. 覆盖确认
- 清单文件数：66
- 实际可读文件数：66
- 缺失/不可读文件数：0
- 主目录组：`src/auto-reply`
- 代码总行数（近似）：12926

## 2. 模块要点
- 文件类型分布：module=54，test=12，doc=0，config=0。
- 导入语句总数（近似）：408。
- 重点文件（按行数）与导出摘要：
  - `src/auto-reply/reply/reply-flow.test.ts`: 1318 行，imports=14，exports=无显式导出。
  - `src/auto-reply/reply/reply-utils.test.ts`: 782 行，imports=12，exports=无显式导出。
  - `src/auto-reply/reply/model-selection.ts`: 592 行，imports=10，exports=ModelDirectiveSelection, StoredModelOverride, resolveStoredModelOverride, createModelSelectionState, resolveModelDirectiveSelection, resolveContextTokens。
  - `src/auto-reply/reply/get-reply-directives.ts`: 483 行，imports=22，exports=ReplyDirectiveContinuation, ReplyDirectiveResult, resolveReplyDirectives。
  - `src/auto-reply/reply/get-reply-run.ts`: 465 行，imports=30，exports=runPreparedReply。
  - `src/auto-reply/reply/dispatch-from-config.ts`: 456 行，imports=15，exports=DispatchFromConfigResult, dispatchReplyFromConfig。
  - `src/auto-reply/reply/route-reply.test.ts`: 450 行，imports=14，exports=无显式导出。
  - `src/auto-reply/reply/dispatch-from-config.test.ts`: 445 行，imports=6，exports=无显式导出。
  - `src/auto-reply/reply/get-reply-inline-actions.ts`: 404 行，imports=19，exports=InlineActionResult, handleInlineActions。
  - `src/auto-reply/reply/reply-state.test.ts`: 382 行，imports=9，exports=无显式导出。
  - `src/auto-reply/reply/line-directives.ts`: 343 行，imports=3，exports=parseLineDirectives, hasLineDirectives。
  - `src/auto-reply/reply/get-reply.ts`: 342 行，imports=21，exports=getReplyFromConfig。
  - `src/auto-reply/reply/model-selection.test.ts`: 326 行，imports=3，exports=无显式导出。
  - `src/auto-reply/reply/followup-runner.test.ts`: 308 行，imports=8，exports=无显式导出。
  - `src/auto-reply/reply/get-reply-directives-apply.ts`: 291 行，imports=11，exports=ApplyDirectiveResult, applyInlineDirectiveOverrides。
  - `src/auto-reply/reply/followup-runner.ts`: 289 行，imports=22，exports=createFollowupRunner。
  - `src/auto-reply/reply/reply-plumbing.test.ts`: 254 行，imports=8，exports=无显式导出。
  - `src/auto-reply/reply/reply-dispatcher.ts`: 237 行，imports=7，exports=ReplyDispatchKind, ReplyDispatcherOptions, ReplyDispatcherWithTypingOptions, ReplyDispatcher, createReplyDispatcher, createReplyDispatcherWithTyping。
  - `src/auto-reply/reply/directive-handling.persist.ts`: 236 行，imports=13，exports=persistInlineDirectives, resolveDefaultModel。
  - `src/auto-reply/reply/directive-handling.parse.ts`: 216 行，imports=9，exports=InlineDirectives, parseInlineDirectives, isDirectiveOnly。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 27 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 14 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 8 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 1 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/auto-reply` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

