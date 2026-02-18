# chunk_002_src_agents_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：74
- 实际可读文件数：74
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：13068

## 2. 模块要点
- 文件类型分布：module=37，test=37，doc=0，config=0。
- 导入语句总数（近似）：351。
- 重点文件（按行数）与导出摘要：
  - `src/agents/bash-tools.exec.ts`: 1004 行，imports=13，exports=ExecToolDefaults, ExecElevatedDefaults, ExecToolDetails, createExecTool, execTool。
  - `src/agents/bash-tools.process.ts`: 647 行，imports=8，exports=ProcessToolDefaults, createProcessTool, processTool。
  - `src/agents/bash-tools.exec-runtime.ts`: 574 行，imports=17，exports=validateHostEnv, DEFAULT_MAX_OUTPUT, DEFAULT_PENDING_MAX_OUTPUT, DEFAULT_PATH, DEFAULT_NOTIFY_TAIL_CHARS, DEFAULT_APPROVAL_TIMEOUT_MS。
  - `src/agents/cli-credentials.ts`: 573 行，imports=8，exports=resetCliCredentialCachesForTest, ClaudeCliCredential, CodexCliCredential, QwenCliCredential, MiniMaxCliCredential, readClaudeCliCredentials。
  - `src/agents/apply-patch.ts`: 555 行，imports=8，exports=ApplyPatchSummary, ApplyPatchResult, ApplyPatchToolDetails, createApplyPatchTool, applyPatch。
  - `src/agents/bash-tools.e2e.test.ts`: 515 行，imports=9，exports=无显式导出。
  - `src/agents/auth-profiles/store.ts`: 347 行，imports=9，exports=updateAuthProfileStoreWithLock, loadAuthProfileStore, ensureAuthProfileStore, saveAuthProfileStore。
  - `src/agents/cli-credentials.test.ts`: 333 行，imports=4，exports=无显式导出。
  - `src/agents/auth-profiles/usage.ts`: 323 行，imports=4，exports=isProfileInCooldown, markAuthProfileUsed, calculateAuthProfileCooldownMs, resolveProfileUnusableUntilForDisplay, markAuthProfileFailure, markAuthProfileCooldown。
  - `src/agents/bash-process-registry.ts`: 310 行，imports=2，exports=ProcessStatus, SessionStdin, ProcessSession, FinishedSession, createSessionSlug, addSession。
  - `src/agents/agent-scope.e2e.test.ts`: 284 行，imports=4，exports=无显式导出。
  - `src/agents/cache-trace.ts`: 274 行，imports=9，exports=CacheTraceStage, CacheTraceEvent, CacheTrace, createCacheTrace。
  - `src/agents/auth-profiles/oauth.ts`: 273 行，imports=11，exports=resolveApiKeyForProfile。
  - `src/agents/auth-health.ts`: 253 行，imports=2，exports=AuthProfileSource, AuthProfileHealthStatus, AuthProfileHealth, AuthProviderHealthStatus, AuthProviderHealth, AuthHealthSummary。
  - `src/agents/bash-tools.shared.ts`: 247 行，imports=6，exports=BashSandboxConfig, buildSandboxEnv, coerceEnv, buildDockerExecArgs, resolveSandboxWorkdir, resolveWorkdir。
  - `src/agents/apply-patch.e2e.test.ts`: 245 行，imports=5，exports=无显式导出。
  - `src/agents/anthropic.setup-token.live.test.ts`: 227 行，imports=15，exports=无显式导出。
  - `src/agents/chutes-oauth.ts`: 226 行，imports=2，exports=CHUTES_OAUTH_ISSUER, CHUTES_AUTHORIZE_ENDPOINT, CHUTES_TOKEN_ENDPOINT, CHUTES_USERINFO_ENDPOINT, ChutesPkce, ChutesUserInfo。
  - `src/agents/bedrock-discovery.ts`: 224 行，imports=2，exports=resetBedrockDiscoveryCacheForTest, discoverBedrockModels。
  - `src/agents/cli-runner.e2e.test.ts`: 222 行，imports=7，exports=无显式导出。

## 3. 关键调用链
- chunk 内本地依赖边（Top 20）：
  - `src/agents/bash-tools.exec.background-abort.e2e.test.ts` -> `src/agents/bash-process-registry.ts`
  - `src/agents/bash-tools.exec.background-abort.e2e.test.ts` -> `src/agents/bash-tools.exec.ts`
  - `src/agents/bash-tools.exec.pty-cleanup.test.ts` -> `src/agents/bash-process-registry.ts`
  - `src/agents/bash-tools.exec.pty-cleanup.test.ts` -> `src/agents/bash-tools.exec.ts`
  - `src/agents/bash-tools.exec.pty-fallback-failure.test.ts` -> `src/agents/bash-process-registry.ts`
  - `src/agents/bash-tools.exec.pty-fallback-failure.test.ts` -> `src/agents/bash-tools.exec.ts`
  - `src/agents/bash-tools.exec.pty-fallback.e2e.test.ts` -> `src/agents/bash-process-registry.ts`
  - `src/agents/bash-tools.exec.pty-fallback.e2e.test.ts` -> `src/agents/bash-tools.exec.ts`
  - `src/agents/bash-tools.exec.pty.e2e.test.ts` -> `src/agents/bash-process-registry.ts`
  - `src/agents/bash-tools.exec.pty.e2e.test.ts` -> `src/agents/bash-tools.exec.ts`
  - `src/agents/bash-tools.process.send-keys.e2e.test.ts` -> `src/agents/bash-process-registry.ts`
  - `src/agents/bash-tools.process.send-keys.e2e.test.ts` -> `src/agents/bash-tools.exec.ts`
  - `src/agents/bash-tools.process.send-keys.e2e.test.ts` -> `src/agents/bash-tools.process.ts`

## 4. 风险
- secrets: 命中 40 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 29 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 22 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 8 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

