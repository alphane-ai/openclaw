# chunk_006_src_auto-reply_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：47
- 实际可读文件数：47
- 缺失/不可读文件数：0
- 主目录组：`src/auto-reply`
- 代码总行数（近似）：12381

## 2. 模块要点
- 文件类型分布：module=43，test=4，doc=0，config=0。
- 导入语句总数（近似）：394。
- 重点文件（按行数）与导出摘要：
  - `src/auto-reply/reply/commands.test.ts`: 1370 行，imports=19，exports=无显式导出。
  - `src/auto-reply/reply/agent-runner.misc.runreplyagent.test.ts`: 1167 行，imports=12，exports=无显式导出。
  - `src/auto-reply/reply/agent-runner.runreplyagent.test.ts`: 1033 行，imports=11，exports=无显式导出。
  - `src/auto-reply/reply/commands-allowlist.ts`: 716 行，imports=19，exports=handleAllowlistCommand。
  - `src/auto-reply/reply/commands-subagents.ts`: 649 行，imports=18，exports=extractMessageText, handleSubagentsCommand。
  - `src/auto-reply/reply/agent-runner-execution.ts`: 573 行，imports=24，exports=AgentRunLoopResult, runAgentTurnWithFallback。
  - `src/auto-reply/reply/agent-runner.ts`: 524 行，imports=29，exports=runReplyAgent。
  - `src/auto-reply/reply/directive-handling.impl.ts`: 466 行，imports=15，exports=handleDirectiveOnly。
  - `src/auto-reply/reply/directive-handling.model.ts`: 403 行，imports=11，exports=maybeHandleModelDirectiveInfo, resolveModelSelectionFromDirective。
  - `src/auto-reply/reply/bash-command.ts`: 399 行，imports=12，exports=handleBashChatCommand, resetBashChatCommandForTests。
  - `src/auto-reply/reply/commands-session.ts`: 387 行，imports=14，exports=handleActivationCommand, handleSendPolicyCommand, handleUsageCommand, handleRestartCommand, handleStopCommand, handleAbortTrigger。
  - `src/auto-reply/reply/commands-context-report.ts`: 338 行，imports=17，exports=buildContextReply。
  - `src/auto-reply/reply/commands-models.ts`: 327 行，imports=7，exports=ModelsProviderData, buildModelsProviderData, resolveModelsCommandReply, handleModelsCommand。
  - `src/auto-reply/reply/commands-tts.ts`: 280 行，imports=4，exports=handleTtsCommands。
  - `src/auto-reply/reply/commands-config.ts`: 274 行，imports=9，exports=handleConfigCommand, handleDebugCommand。
  - `src/auto-reply/reply/commands-status.ts`: 254 行，imports=18，exports=buildStatusReply。
  - `src/auto-reply/reply/directive-handling.auth.ts`: 247 行，imports=5，exports=ModelAuthDetailMode, resolveAuthLabel, formatAuthLabel, resolveProfileOverride。
  - `src/auto-reply/reply/block-reply-pipeline.ts`: 243 行，imports=4，exports=BlockReplyPipeline, BlockReplyBuffer, createAudioAsVoiceBuffer, createBlockReplyPayloadKey, createBlockReplyPipeline。
  - `src/auto-reply/reply/commands-ptt.ts`: 209 行，imports=4，exports=handlePTTCommand。
  - `src/auto-reply/reply/agent-runner-memory.ts`: 206 行，imports=17，exports=runMemoryFlushIfNeeded。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 23 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 18 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 5 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 4 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/auto-reply` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

