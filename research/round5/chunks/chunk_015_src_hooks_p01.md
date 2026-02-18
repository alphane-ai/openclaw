# chunk_015_src_hooks_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：36
- 实际可读文件数：36
- 缺失/不可读文件数：0
- 主目录组：`src/hooks`
- 代码总行数（近似）：5961

## 2. 模块要点
- 文件类型分布：module=21，test=10，doc=5，config=0。
- 导入语句总数（近似）：166。
- 重点文件（按行数）与导出摘要：
  - `src/hooks/install.ts`: 467 行，imports=11，exports=HookInstallLogger, InstallHooksResult, resolveHookInstallDir, installHooksFromArchive, installHooksFromNpmSpec, installHooksFromPath。
  - `src/hooks/gmail-setup-utils.ts`: 388 行，imports=6，exports=resetGmailSetupUtilsCachesForTest, resolvePythonExecutablePath, ensureDependency, ensureGcloudAuth, runGcloud, ensureTopic。
  - `src/hooks/gmail-ops.ts`: 374 行，imports=8，exports=GmailSetupOptions, GmailRunOptions, runGmailSetup, runGmailService。
  - `src/hooks/workspace.ts`: 312 行，imports=9，exports=loadHookEntriesFromDir, buildWorkspaceHookSnapshot, loadWorkspaceHookEntries。
  - `src/hooks/install.test.ts`: 310 行，imports=6，exports=无显式导出。
  - `src/hooks/frontmatter.test.ts`: 291 行，imports=2，exports=无显式导出。
  - `src/hooks/bundled/session-memory/handler.test.ts`: 277 行，imports=7，exports=无显式导出。
  - `src/hooks/gmail.ts`: 272 行，imports=2，exports=DEFAULT_GMAIL_LABEL, DEFAULT_GMAIL_TOPIC, DEFAULT_GMAIL_SUBSCRIPTION, DEFAULT_GMAIL_SERVE_BIND, DEFAULT_GMAIL_SERVE_PORT, DEFAULT_GMAIL_SERVE_PATH。
  - `src/hooks/loader.test.ts`: 271 行，imports=7，exports=handlerPath, myHandler, handlerPath, getCallCount。
  - `src/hooks/gmail-watcher.ts`: 247 行，imports=7，exports=isAddressInUseError, GmailWatcherStartResult, startGmailWatcher, stopGmailWatcher, isGmailWatcherRunning。
  - `src/hooks/bundled/README.md`: 224 行，imports=1，exports=无显式导出。
  - `src/hooks/internal-hooks.test.ts`: 214 行，imports=2，exports=无显式导出。
  - `src/hooks/bundled/session-memory/handler.ts`: 205 行，imports=12，exports=无显式导出。
  - `src/hooks/internal-hooks.ts`: 182 行，imports=2，exports=InternalHookEventType, AgentBootstrapHookContext, AgentBootstrapHookEvent, InternalHookEvent, InternalHookHandler, registerInternalHook。
  - `src/hooks/loader.ts`: 167 行，imports=9，exports=loadInternalHooks。
  - `src/hooks/gmail.test.ts`: 159 行，imports=3，exports=无显式导出。
  - `src/hooks/hooks-status.ts`: 146 行，imports=8，exports=HookStatusConfigCheck, HookInstallOption, HookStatusEntry, HookStatusReport, buildWorkspaceHookStatus。
  - `src/hooks/gmail-setup-utils.test.ts`: 125 行，imports=5，exports=无显式导出。
  - `src/hooks/bundled/command-logger/HOOK.md`: 123 行，imports=0，exports=无显式导出。
  - `src/hooks/config.ts`: 120 行，imports=4，exports=isConfigPathTruthy, resolveHookConfig, shouldIncludeHook。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 14 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 11 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 6 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 5 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 1 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/hooks` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

