# chunk_013_src_media-understanding_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：43
- 实际可读文件数：43
- 缺失/不可读文件数：0
- 主目录组：`src/media-understanding`
- 代码总行数（近似）：5449

## 2. 模块要点
- 文件类型分布：module=32，test=11，doc=0，config=0。
- 导入语句总数（近似）：184。
- 重点文件（按行数）与导出摘要：
  - `src/media-understanding/apply.e2e.test.ts`: 921 行，imports=8，exports=无显式导出。
  - `src/media-understanding/runner.ts`: 741 行，imports=20，exports=ActiveMediaModel, RunCapabilityResult, buildProviderRegistry, normalizeMediaAttachments, createMediaAttachmentCache, clearMediaUnderstandingBinaryCacheForTests。
  - `src/media-understanding/apply.ts`: 581 行，imports=12，exports=ApplyMediaUnderstandingResult, applyMediaUnderstanding。
  - `src/media-understanding/runner.entries.ts`: 555 行，imports=20，exports=ProviderRegistry, buildModelDecision, formatDecisionSummary, runProviderEntry, runCliEntry。
  - `src/media-understanding/attachments.ts`: 426 行，imports=14，exports=normalizeAttachments, resolveAttachmentKind, isVideoAttachment, isAudioAttachment, isImageAttachment, selectAttachments。
  - `src/media-understanding/resolve.ts`: 188 行，imports=8，exports=resolveTimeoutMs, resolvePrompt, resolveMaxChars, resolveMaxBytes, resolveCapabilityConfig, resolveScopeDecision。
  - `src/media-understanding/resolve.test.ts`: 133 行，imports=3，exports=无显式导出。
  - `src/media-understanding/providers/google/video.test.ts`: 130 行，imports=3，exports=无显式导出。
  - `src/media-understanding/runner.auto-audio.test.ts`: 119 行，imports=7，exports=无显式导出。
  - `src/media-understanding/types.ts`: 116 行，imports=0，exports=MediaUnderstandingKind, MediaUnderstandingCapability, MediaAttachment, MediaUnderstandingOutput, MediaUnderstandingDecisionOutcome, MediaUnderstandingModelDecision。
  - `src/media-understanding/runner.deepgram.test.ts`: 111 行，imports=7，exports=无显式导出。
  - `src/media-understanding/format.ts`: 99 行，imports=1，exports=extractMediaUserText, formatMediaUnderstandingBody, formatAudioTranscripts。
  - `src/media-understanding/audio-preflight.ts`: 98 行，imports=6，exports=transcribeFirstAudio。
  - `src/media-understanding/providers/google/inline-data.ts`: 96 行，imports=2，exports=generateGeminiInlineDataText。
  - `src/media-understanding/format.test.ts`: 92 行，imports=2，exports=无显式导出。
  - `src/media-understanding/providers/deepgram/audio.test.ts`: 86 行，imports=3，exports=无显式导出。
  - `src/media-understanding/providers/openai/audio.test.ts`: 83 行，imports=3，exports=无显式导出。
  - `src/media-understanding/providers/deepgram/audio.ts`: 78 行，imports=2，exports=DEFAULT_DEEPGRAM_AUDIO_BASE_URL, DEFAULT_DEEPGRAM_AUDIO_MODEL, transcribeDeepgramAudio。
  - `src/media-understanding/providers/image.ts`: 67 行，imports=8，exports=describeImageWithModel。
  - `src/media-understanding/providers/openai/audio.ts`: 67 行，imports=3，exports=DEFAULT_OPENAI_AUDIO_BASE_URL, transcribeOpenAiCompatibleAudio。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 16 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 12 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/media-understanding` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

