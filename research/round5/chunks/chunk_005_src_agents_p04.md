# chunk_005_src_agents_p04 研究笔记

## 1. 覆盖确认
- 清单文件数：65
- 实际可读文件数：65
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：12110

## 2. 模块要点
- 文件类型分布：module=31，test=34，doc=0，config=0。
- 导入语句总数（近似）：351。
- 重点文件（按行数）与导出摘要：
  - `src/agents/pi-embedded-runner/run/attempt.ts`: 1201 行，imports=66，exports=injectHistoryImagesIntoMessages, runEmbeddedAttempt。
  - `src/agents/pi-embedded-runner/run.ts`: 998 行，imports=25，exports=runEmbeddedPiAgent。
  - `src/agents/pi-embedded-subscribe.ts`: 702 行，imports=15，exports=subscribeEmbeddedPiSession。
  - `src/agents/pi-embedded-utils.e2e.test.ts`: 620 行，imports=3，exports=无显式导出。
  - `src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.subscribeembeddedpisession.e2e.test.ts`: 542 行，imports=4，exports=无显式导出。
  - `src/agents/pi-embedded-runner/run/images.ts`: 457 行，imports=8，exports=DetectedImageRef, detectImageReferences, loadImageFromRef, modelSupportsImages, detectAndLoadPromptImages。
  - `src/agents/pi-embedded-subscribe.handlers.messages.ts`: 395 行，imports=9，exports=resolveSilentReplyFallbackText, handleMessageStart, handleMessageUpdate, handleMessageEnd。
  - `src/agents/pi-embedded-runner/run.overflow-compaction.e2e.test.ts`: 375 行，imports=8，exports=无显式导出。
  - `src/agents/pi-embedded-runner/model.test.ts`: 352 行，imports=5，exports=无显式导出。
  - `src/agents/pi-embedded-runner/tool-result-truncation.ts`: 329 行，imports=4，exports=HARD_MAX_TOOL_RESULT_CHARS, truncateToolResultText, calculateMaxToolResultChars, truncateOversizedToolResultsInSession, truncateOversizedToolResultsInMessages, isOversizedToolResult。
  - `src/agents/pi-embedded-subscribe.handlers.tools.ts`: 317 行，imports=11，exports=handleToolExecutionStart, handleToolExecutionUpdate, handleToolExecutionEnd。
  - `src/agents/pi-embedded-runner/run/payloads.ts`: 311 行，imports=10，exports=buildEmbeddedRunPayloads。
  - `src/agents/pi-embedded-runner/run/payloads.e2e.test.ts`: 306 行，imports=4，exports=无显式导出。
  - `src/agents/pi-embedded-runner/run/images.e2e.test.ts`: 277 行，imports=6，exports=无显式导出。
  - `src/agents/pi-embedded-subscribe.tools.ts`: 277 行，imports=5，exports=sanitizeToolResult, extractToolResultText, extractToolResultMediaPaths, isToolResultError, extractToolErrorMessage, extractMessagingToolSend。
  - `src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.waits-multiple-compaction-retries-before-resolving.e2e.test.ts`: 265 行，imports=3，exports=无显式导出。
  - `src/agents/pi-embedded-runner/tool-result-truncation.e2e.test.ts`: 216 行，imports=3，exports=无显式导出。
  - `src/agents/pi-embedded-subscribe.handlers.tools.media.test.ts`: 191 行，imports=3，exports=无显式导出。
  - `src/agents/pi-embedded-runner/runs.ts`: 154 行，imports=1，exports=queueEmbeddedPiMessage, abortEmbeddedPiRun, isEmbeddedPiRunActive, isEmbeddedPiRunStreaming, getActiveEmbeddedRunCount, waitForEmbeddedPiRunEnd。
  - `src/agents/pi-embedded-subscribe.reply-tags.e2e.test.ts`: 153 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 28 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 17 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 7 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 1 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

