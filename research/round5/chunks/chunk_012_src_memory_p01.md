# chunk_012_src_memory_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：63
- 实际可读文件数：63
- 缺失/不可读文件数：0
- 主目录组：`src/memory`
- 代码总行数（近似）：12340

## 2. 模块要点
- 文件类型分布：module=43，test=20，doc=0，config=0。
- 导入语句总数（近似）：249。
- 重点文件（按行数）与导出摘要：
  - `src/memory/qmd-manager.test.ts`: 1416 行，imports=9，exports=无显式导出。
  - `src/memory/qmd-manager.ts`: 1239 行，imports=15，exports=QmdMemoryManager。
  - `src/memory/manager-sync-ops.ts`: 1078 行，imports=16，exports=memoryManagerSyncOps。
  - `src/memory/manager-embedding-ops.ts`: 787 行，imports=10，exports=memoryManagerEmbeddingOps。
  - `src/memory/manager.ts`: 566 行，imports=16，exports=MemoryIndexManager。
  - `src/memory/embeddings.test.ts`: 462 行，imports=4，exports=无显式导出。
  - `src/memory/batch-gemini.ts`: 367 行，imports=5，exports=GeminiBatchRequest, GeminiBatchStatus, GeminiBatchOutputLine, runGeminiEmbeddingBatches。
  - `src/memory/manager.batch.test.ts`: 354 行，imports=5，exports=无显式导出。
  - `src/memory/index.test.ts`: 341 行，imports=5，exports=无显式导出。
  - `src/memory/internal.ts`: 337 行，imports=4，exports=MemoryFileEntry, MemoryChunk, ensureDir, normalizeRelPath, normalizeExtraMemoryPaths, isMemoryPath。
  - `src/memory/backend-config.ts`: 319 行，imports=8，exports=ResolvedMemoryBackendConfig, ResolvedQmdCollection, ResolvedQmdUpdateConfig, ResolvedQmdLimitsConfig, ResolvedQmdSessionConfig, ResolvedQmdConfig。
  - `src/memory/batch-voyage.ts`: 297 行，imports=7，exports=VoyageBatchRequest, VoyageBatchStatus, VoyageBatchOutputLine, VOYAGE_BATCH_ENDPOINT, runVoyageEmbeddingBatches。
  - `src/memory/batch-openai.ts`: 287 行，imports=5，exports=OpenAiBatchRequest, OpenAiBatchStatus, OpenAiBatchOutputLine, OPENAI_BATCH_ENDPOINT, runOpenAiEmbeddingBatches。
  - `src/memory/embeddings.ts`: 258 行，imports=9，exports=EmbeddingProvider, EmbeddingProviderId, EmbeddingProviderRequest, EmbeddingProviderFallback, EmbeddingProviderResult, EmbeddingProviderOptions。
  - `src/memory/search-manager.ts`: 239 行，imports=5，exports=MemorySearchManagerResult, getMemorySearchManager。
  - `src/memory/search-manager.test.ts`: 231 行，imports=3，exports=无显式导出。
  - `src/memory/internal.test.ts`: 193 行，imports=5，exports=无显式导出。
  - `src/memory/manager-search.ts`: 188 行，imports=3，exports=SearchSource, SearchRowResult, searchVector, listChunks, searchKeyword。
  - `src/memory/batch-voyage.test.ts`: 175 行，imports=4，exports=无显式导出。
  - `src/memory/embeddings-gemini.ts`: 170 行，imports=4，exports=GeminiEmbeddingClient, DEFAULT_GEMINI_EMBEDDING_MODEL, createGeminiEmbeddingProvider, resolveGeminiEmbeddingClient。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 30 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 24 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 13 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 13 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- command_exec: 命中 6 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/memory` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

