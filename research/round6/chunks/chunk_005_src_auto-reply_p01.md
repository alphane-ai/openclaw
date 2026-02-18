# chunk_005_src_auto-reply_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：66
- 实际可读文件数：66
- 缺失/不可读文件数：0
- 主目录组：`src/auto-reply`
- 代码总行数（近似）：12710

## 2. 模块要点
- 文件类型分布：module=21，test=45，doc=0，config=0。
- 导入语句总数（近似）：299。
- 重点文件（按行数）与导出摘要：
  - `src/auto-reply/commands-registry.data.ts`: 651 行，imports=5，exports=getChatCommands, getNativeCommandSurfaces。
  - `src/auto-reply/commands-registry.ts`: 518 行，imports=7，exports=listChatCommands, isCommandEnabled, listChatCommandsForConfig, listNativeCommandSpecs, listNativeCommandSpecsForConfig, findCommandByNativeName。
  - `src/auto-reply/chunk.ts`: 504 行，imports=5，exports=TextChunkProvider, ChunkMode, resolveTextChunkLimit, resolveChunkMode, chunkByNewline, chunkByParagraph。
  - `src/auto-reply/command-control.test.ts`: 481 行，imports=10，exports=无显式导出。
  - `src/auto-reply/reply/abort.test.ts`: 415 行，imports=9，exports=无显式导出。
  - `src/auto-reply/inbound.test.ts`: 405 行，imports=14，exports=无显式导出。
  - `src/auto-reply/chunk.test.ts`: 398 行，imports=2，exports=无显式导出。
  - `src/auto-reply/command-auth.ts`: 329 行，imports=6，exports=CommandAuthorization, resolveCommandAuthorization。
  - `src/auto-reply/commands-registry.test.ts`: 327 行，imports=5，exports=无显式导出。
  - `src/auto-reply/reply.block-streaming.test.ts`: 315 行，imports=6，exports=无显式导出。
  - `src/auto-reply/reply.triggers.trigger-handling.filters-usage-summary-current-model-provider.e2e.test.ts`: 281 行，imports=5，exports=无显式导出。
  - `src/auto-reply/reply.directive.directive-behavior.accepts-thinking-xhigh-codex-models.e2e.test.ts`: 273 行，imports=6，exports=无显式导出。
  - `src/auto-reply/reply/abort.ts`: 272 行，imports=13，exports=isAbortTrigger, isAbortRequestText, getAbortMemory, setAbortMemory, getAbortMemorySizeForTest, resetAbortMemoryForTest。
  - `src/auto-reply/envelope.ts`: 254 行，imports=6，exports=AgentEnvelopeParams, EnvelopeFormatOptions, resolveEnvelopeFormatOptions, formatAgentEnvelope, formatInboundEnvelope, formatInboundFromLabel。
  - `src/auto-reply/reply.directive.directive-behavior.lists-allowlisted-models-model-list.e2e.test.ts`: 249 行，imports=5，exports=无显式导出。
  - `src/auto-reply/heartbeat.test.ts`: 240 行，imports=3，exports=无显式导出。
  - `src/auto-reply/reply.directive.directive-behavior.shows-current-verbose-level-verbose-has-no.e2e.test.ts`: 227 行，imports=6，exports=无显式导出。
  - `src/auto-reply/reply.directive.parse.test.ts`: 225 行，imports=3，exports=无显式导出。
  - `src/auto-reply/reply.directive.directive-behavior.applies-inline-reasoning-mixed-messages-acks-immediately.e2e.test.ts`: 222 行，imports=6，exports=无显式导出。
  - `src/auto-reply/reply.triggers.trigger-handling.includes-error-cause-embedded-agent-throws.e2e.test.ts`: 212 行，imports=4，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 23 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 18 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 4 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/auto-reply` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

