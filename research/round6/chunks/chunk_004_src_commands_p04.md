# chunk_004_src_commands_p04 研究笔记

## 1. 覆盖确认
- 清单文件数：31
- 实际可读文件数：31
- 缺失/不可读文件数：0
- 主目录组：`src/commands`
- 代码总行数（近似）：5513

## 2. 模块要点
- 文件类型分布：module=25，test=6，doc=0，config=0。
- 导入语句总数（近似）：203。
- 重点文件（按行数）与导出摘要：
  - `src/commands/status.command.ts`: 635 行，imports=24，exports=statusCommand。
  - `src/commands/status.e2e.test.ts`: 538 行，imports=3，exports=无显式导出。
  - `src/commands/status-all/channels.ts`: 469 行，imports=8，exports=ChannelRow, buildChannelsTable。
  - `src/commands/status-all.ts`: 416 行，imports=30，exports=statusAllCommand。
  - `src/commands/signal-install.ts`: 303 行，imports=11，exports=ReleaseAsset, NamedAsset, SignalInstallResult, extractSignalCliArchive, looksLikeArchive, pickAsset。
  - `src/commands/sessions.ts`: 267 行，imports=10，exports=sessionsCommand。
  - `src/commands/status-all/diagnosis.ts`: 248 行，imports=6，exports=appendStatusAllDiagnosis。
  - `src/commands/status.summary.ts`: 233 行，imports=12，exports=redactSensitiveStatusSummary, getStatusSummary。
  - `src/commands/status.scan.ts`: 204 行，imports=17，exports=StatusScanResult, scanStatus。
  - `src/commands/status-all/report-lines.ts`: 197 行，imports=5，exports=buildStatusAllReportLines。
  - `src/commands/uninstall.ts`: 195 行，imports=9，exports=UninstallOptions, uninstallCommand。
  - `src/commands/status-all/gateway.ts`: 184 行，imports=1，exports=readFileTailLines, summarizeLogTail。
  - `src/commands/signal-install.test.ts`: 175 行，imports=8，exports=无显式导出。
  - `src/commands/zai-endpoint-detect.ts`: 149 行，imports=2，exports=ZaiEndpointId, ZaiDetectedEndpoint, detectZaiEndpoint。
  - `src/commands/sessions.e2e.test.ts`: 149 行，imports=5，exports=无显式导出。
  - `src/commands/status.update.test.ts`: 148 行，imports=4，exports=无显式导出。
  - `src/commands/status.update.ts`: 134 行，imports=4，exports=getUpdateCheckResult, UpdateAvailability, resolveUpdateAvailability, formatUpdateAvailableHint, formatUpdateOneLiner。
  - `src/commands/systemd-linger.ts`: 122 行，imports=3，exports=LingerPrompter, ensureSystemdUserLingerInteractive, ensureSystemdUserLingerNonInteractive。
  - `src/commands/status.agent-local.ts`: 89 行，imports=6，exports=AgentLocalStatus, getAgentLocalStatuses。
  - `src/commands/vllm-setup.ts`: 79 行，imports=3，exports=VLLM_DEFAULT_BASE_URL, VLLM_DEFAULT_CONTEXT_WINDOW, VLLM_DEFAULT_MAX_TOKENS, VLLM_DEFAULT_COST, promptAndConfigureVllm。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 21 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 19 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 8 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 1 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/commands` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

