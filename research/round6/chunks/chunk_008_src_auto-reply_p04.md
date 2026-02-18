# chunk_008_src_auto-reply_p04 研究笔记

## 1. 覆盖确认
- 清单文件数：24
- 实际可读文件数：24
- 缺失/不可读文件数：0
- 主目录组：`src/auto-reply`
- 代码总行数（近似）：5356

## 2. 模块要点
- 文件类型分布：module=19，test=5，doc=0，config=0。
- 导入语句总数（近似）：125。
- 重点文件（按行数）与导出摘要：
  - `src/auto-reply/reply/session.test.ts`: 1295 行，imports=13，exports=无显式导出。
  - `src/auto-reply/status.ts`: 704 行，imports=21，exports=formatTokenCount, formatContextUsageShort, buildStatusMessage, buildHelpMessage, CommandsMessageOptions, CommandsMessageResult。
  - `src/auto-reply/status.test.ts`: 583 行，imports=7，exports=无显式导出。
  - `src/auto-reply/reply/session.ts`: 471 行，imports=18，exports=SessionInitResult, initSessionState。
  - `src/auto-reply/reply/session-updates.ts`: 287 行，imports=10，exports=prependSystemEvents, ensureSkillSnapshot, incrementCompactionCount。
  - `src/auto-reply/thinking.ts`: 228 行，imports=0，exports=ThinkLevel, VerboseLevel, NoticeLevel, ElevatedLevel, ElevatedMode, ReasoningLevel。
  - `src/auto-reply/templating.ts`: 205 行，imports=5，exports=OriginatingChannelType, MsgContext, FinalizedMsgContext, TemplateContext, applyTemplate。
  - `src/auto-reply/reply/stage-sandbox-media.ts`: 198 行，imports=11，exports=stageSandboxMedia。
  - `src/auto-reply/reply/typing.ts`: 197 行，imports=1，exports=TypingController, createTypingController。
  - `src/auto-reply/tool-meta.ts`: 144 行，imports=2，exports=shortenPath, shortenMeta, formatToolAggregate, formatToolPrefix。
  - `src/auto-reply/reply/typing-mode.ts`: 143 行，imports=3，exports=TypingModeContext, DEFAULT_GROUP_TYPING_MODE, resolveTypingMode, TypingSignaler, createTypingSignaler。
  - `src/auto-reply/skill-commands.ts`: 142 行，imports=6，exports=listSkillCommandsForWorkspace, listSkillCommandsForAgents, resolveSkillCommandInvocation。
  - `src/auto-reply/skill-commands.test.ts`: 132 行，imports=4，exports=无显式导出。
  - `src/auto-reply/reply/streaming-directives.ts`: 129 行，imports=4，exports=createStreamingDirectiveAccumulator。
  - `src/auto-reply/reply/session-usage.ts`: 128 行，imports=4，exports=persistSessionUsageUpdate。
  - `src/auto-reply/thinking.test.ts`: 91 行，imports=2，exports=无显式导出。
  - `src/auto-reply/types.ts`: 64 行，imports=2，exports=BlockReplyContext, ModelSelectedContext, GetReplyOptions, ReplyPayload。
  - `src/auto-reply/tool-meta.test.ts`: 62 行，imports=3，exports=无显式导出。
  - `src/auto-reply/send-policy.ts`: 45 行，imports=1，exports=SendPolicyOverride, normalizeSendPolicyOverride, parseSendPolicyCommand。
  - `src/auto-reply/reply/subagents-utils.ts`: 33 行，imports=2，exports=resolveSubagentLabel, formatRunLabel, formatRunStatus, sortSubagentRuns。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 12 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 8 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 1 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/auto-reply` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

