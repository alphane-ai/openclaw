# chunk_003_src_agents_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：76
- 实际可读文件数：76
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：13302

## 2. 模块要点
- 文件类型分布：module=36，test=40，doc=0，config=0。
- 导入语句总数（近似）：306。
- 重点文件（按行数）与导出摘要：
  - `src/agents/models-config.providers.ts`: 906 行，imports=12，exports=ProviderConfig, XIAOMI_DEFAULT_MODEL_ID, QIANFAN_BASE_URL, QIANFAN_DEFAULT_MODEL_ID, resolveOllamaApiBase, normalizeGoogleModelId。
  - `src/agents/model-fallback.e2e.test.ts`: 585 行，imports=10，exports=无显式导出。
  - `src/agents/model-auth.e2e.test.ts`: 545 行，imports=8，exports=无显式导出。
  - `src/agents/models.profiles.live.test.ts`: 513 行，imports=12，exports=无显式导出。
  - `src/agents/model-scan.ts`: 495 行，imports=3，exports=ProbeResult, ModelScanResult, OpenRouterScanOptions, scanOpenRouterModels。
  - `src/agents/model-selection.ts`: 467 行，imports=5，exports=ModelRef, ThinkLevel, ModelAliasIndex, modelKey, normalizeProviderId, isCliProvider。
  - `src/agents/ollama-stream.ts`: 420 行，imports=4，exports=OLLAMA_NATIVE_BASE_URL, convertToOllamaMessages, buildAssistantMessage, createOllamaStreamFn。
  - `src/agents/model-auth.ts`: 407 行，imports=9，exports=getCustomProviderApiKey, resolveAwsSdkEnvVarName, ResolvedProviderAuth, resolveApiKeyForProvider, EnvApiKeyResult, ModelAuthMode。
  - `src/agents/cli-runner.ts`: 397 行，imports=17，exports=runCliAgent, runClaudeCliAgent。
  - `src/agents/cli-runner/helpers.ts`: 395 行，imports=17，exports=enqueueCliRun, CliOutput, buildSystemPrompt, normalizeCliModel, parseCliJson, parseCliJsonl。
  - `src/agents/model-fallback.ts`: 394 行，imports=7，exports=runWithModelFallback, runWithImageModelFallback。
  - `src/agents/compaction.ts`: 378 行，imports=5，exports=BASE_CHUNK_RATIO, MIN_CHUNK_RATIO, SAFETY_MARGIN, estimateMessagesTokens, splitMessagesByTokenShare, chunkMessagesByMaxTokens。
  - `src/agents/memory-search.ts`: 308 行，imports=6，exports=ResolvedMemorySearchConfig, resolveMemorySearchConfig。
  - `src/agents/identity.per-channel-prefix.e2e.test.ts`: 301 行，imports=3，exports=无显式导出。
  - `src/agents/compaction.e2e.test.ts`: 294 行，imports=3，exports=无显式导出。
  - `src/agents/ollama-stream.test.ts`: 291 行，imports=2，exports=无显式导出。
  - `src/agents/openclaw-tools.session-status.e2e.test.ts`: 278 行，imports=3，exports=无显式导出。
  - `src/agents/openclaw-tools.camera.e2e.test.ts`: 264 行，imports=3，exports=无显式导出。
  - `src/agents/memory-search.e2e.test.ts`: 259 行，imports=2，exports=无显式导出。
  - `src/agents/model-forward-compat.ts`: 250 行，imports=5，exports=ANTIGRAVITY_OPUS_46_FORWARD_COMPAT_CANDIDATES, resolveForwardCompatModel。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 44 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 17 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 15 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 4 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

