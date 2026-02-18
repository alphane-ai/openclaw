# chunk_016_src_infra_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：61
- 实际可读文件数：61
- 缺失/不可读文件数：0
- 主目录组：`src/infra`
- 代码总行数（近似）：6286

## 2. 模块要点
- 文件类型分布：module=40，test=21，doc=0，config=0。
- 导入语句总数（近似）：162。
- 重点文件（按行数）与导出摘要：
  - `src/infra/archive.ts`: 438 行，imports=8，exports=ArchiveKind, ArchiveLogger, ArchiveExtractLimits, DEFAULT_MAX_ARCHIVE_BYTES_ZIP, DEFAULT_MAX_ENTRIES, DEFAULT_MAX_EXTRACTED_BYTES。
  - `src/infra/bonjour.test.ts`: 381 行，imports=3，exports=无显式导出。
  - `src/infra/infra-runtime.test.ts`: 294 行，imports=9，exports=无显式导出。
  - `src/infra/bonjour.ts`: 282 行，imports=6，exports=GatewayBonjourAdvertiser, GatewayBonjourAdvertiseOpts, startGatewayBonjourAdvertiser。
  - `src/infra/format-time/format-time.test.ts`: 222 行，imports=4，exports=无显式导出。
  - `src/infra/tmp-openclaw-dir.test.ts`: 193 行，imports=3，exports=无显式导出。
  - `src/infra/diagnostic-events.ts`: 187 行，imports=1，exports=DiagnosticSessionState, DiagnosticUsageEvent, DiagnosticWebhookReceivedEvent, DiagnosticWebhookProcessedEvent, DiagnosticWebhookErrorEvent, DiagnosticMessageQueuedEvent。
  - `src/infra/infra-store.test.ts`: 185 行，imports=9，exports=无显式导出。
  - `src/infra/archive.test.ts`: 182 行，imports=7，exports=无显式导出。
  - `src/infra/unhandled-rejections.ts`: 180 行，imports=2，exports=isAbortError, isTransientNetworkError, registerUnhandledRejectionHandler, isUnhandledRejectionHandled, installUnhandledRejectionHandler。
  - `src/infra/shell-env.ts`: 176 行，imports=2，exports=ShellEnvFallbackResult, ShellEnvFallbackOptions, loadShellEnvFallback, shouldEnableShellEnvFallback, shouldDeferShellEnvFallback, resolveShellEnvFallbackTimeoutMs。
  - `src/infra/unhandled-rejections.fatal-detection.test.ts`: 162 行，imports=3，exports=无显式导出。
  - `src/infra/openclaw-root.test.ts`: 151 行，imports=3，exports=无显式导出。
  - `src/infra/infra-parsing.test.ts`: 132 行，imports=6，exports=无显式导出。
  - `src/infra/openclaw-root.ts`: 130 行，imports=4，exports=resolveOpenClawPackageRoot, resolveOpenClawPackageRootSync。
  - `src/infra/unhandled-rejections.test.ts`: 129 行，imports=2，exports=无显式导出。
  - `src/infra/git-commit.ts`: 129 行，imports=3，exports=resolveCommitHash。
  - `src/infra/format-time/format-relative.ts`: 113 行，imports=0，exports=FormatTimeAgoOptions, formatTimeAgo, FormatRelativeTimestampOptions, formatRelativeTimestamp。
  - `src/infra/fs-safe.ts`: 106 行，imports=5，exports=SafeOpenErrorCode, SafeOpenError, SafeOpenResult, openFileWithinRoot。
  - `src/infra/tmp-openclaw-dir.ts`: 105 行，imports=3，exports=POSIX_OPENCLAW_TMP_DIR, resolvePreferredOpenClawTmpDir。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 22 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 22 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 10 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 6 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/infra` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

