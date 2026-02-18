# chunk_004_src_agents_p03 研究笔记

## 1. 覆盖确认
- 清单文件数：67
- 实际可读文件数：67
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：12376

## 2. 模块要点
- 文件类型分布：module=29，test=38，doc=0，config=0。
- 导入语句总数（近似）：296。
- 重点文件（按行数）与导出摘要：
  - `src/agents/openclaw-tools.sessions.e2e.test.ts`: 1014 行，imports=5，exports=无显式导出。
  - `src/agents/pi-embedded-helpers/errors.ts`: 811 行，imports=4，exports=formatBillingErrorMessage, BILLING_ERROR_USER_MESSAGE, isContextOverflowError, isLikelyContextOverflowError, isCompactionFailureError, isCloudflareOrHtmlErrorPage。
  - `src/agents/pi-embedded-runner/compact.ts`: 730 行，imports=54，exports=CompactEmbeddedPiSessionParams, compactEmbeddedPiSessionDirect, compactEmbeddedPiSession。
  - `src/agents/pi-embedded-runner.run-embedded-pi-agent.auth-profile-rotation.e2e.test.ts`: 662 行，imports=7，exports=无显式导出。
  - `src/agents/pi-embedded-runner.e2e.test.ts`: 539 行，imports=7，exports=无显式导出。
  - `src/agents/openclaw-tools.subagents.sessions-spawn.lifecycle.e2e.test.ts`: 523 行，imports=6，exports=无显式导出。
  - `src/agents/pi-embedded-runner/google.ts`: 485 行，imports=13，exports=sanitizeAntigravityThinkingBlocks, sanitizeToolsForGoogle, logToolSchemasForGoogle, CompactionFailureListener, onUnhandledCompactionFailure, applyGoogleTurnOrderingFix。
  - `src/agents/pi-embedded-helpers.sanitizeuserfacingtext.e2e.test.ts`: 399 行，imports=2，exports=无显式导出。
  - `src/agents/openclaw-tools.subagents.sessions-spawn.model.e2e.test.ts`: 361 行，imports=5，exports=无显式导出。
  - `src/agents/pi-embedded-runner.google-sanitize-thinking.e2e.test.ts`: 359 行，imports=4，exports=无显式导出。
  - `src/agents/pi-embedded-helpers.isbillingerrormessage.e2e.test.ts`: 351 行，imports=2，exports=无显式导出。
  - `src/agents/pi-embedded-block-chunker.ts`: 351 行，imports=2，exports=BlockReplyChunking, EmbeddedBlockChunker。
  - `src/agents/pi-embedded-helpers.validate-turns.e2e.test.ts`: 343 行，imports=3，exports=无显式导出。
  - `src/agents/opencode-zen-models.ts`: 317 行，imports=1，exports=OPENCODE_ZEN_API_BASE_URL, OPENCODE_ZEN_DEFAULT_MODEL, OPENCODE_ZEN_DEFAULT_MODEL_REF, OPENCODE_ZEN_MODEL_ALIASES, resolveOpencodeZenAlias, resolveOpencodeZenModelApi。
  - `src/agents/pi-embedded-runner.sanitize-session-history.test.ts`: 313 行，imports=5，exports=无显式导出。
  - `src/agents/pi-embedded-helpers.sanitize-session-messages-images.removes-empty-assistant-text-blocks-but-preserves.e2e.test.ts`: 299 行，imports=3，exports=无显式导出。
  - `src/agents/openclaw-tools.subagents.sessions-spawn-depth-limits.test.ts`: 289 行，imports=6，exports=无显式导出。
  - `src/agents/pi-embedded-helpers/bootstrap.ts`: 267 行，imports=7，exports=stripThoughtSignatures, DEFAULT_BOOTSTRAP_MAX_CHARS, DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS, resolveBootstrapMaxChars, resolveBootstrapTotalMaxChars, ensureSessionHeader。
  - `src/agents/openclaw-tools.subagents.sessions-spawn.allowlist.e2e.test.ts`: 237 行，imports=4，exports=无显式导出。
  - `src/agents/pi-embedded-runner/extra-params.ts`: 217 行，imports=5，exports=resolveExtraParams, applyExtraParamsToAgent。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 18 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 14 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 12 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

