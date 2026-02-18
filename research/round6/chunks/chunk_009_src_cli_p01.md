# chunk_009_src_cli_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：83
- 实际可读文件数：83
- 缺失/不可读文件数：0
- 主目录组：`src/cli`
- 代码总行数（近似）：12282

## 2. 模块要点
- 文件类型分布：module=67，test=16，doc=0，config=0。
- 导入语句总数（近似）：447。
- 重点文件（按行数）与导出摘要：
  - `src/cli/completion-cli.ts`: 665 行，imports=10，exports=resolveShellFromEnv, resolveCompletionCachePath, completionCacheExists, isCompletionInstalled, usesSlowDynamicCompletion, registerCompletionCli。
  - `src/cli/browser-cli-manage.ts`: 493 行，imports=7，exports=registerBrowserManageCommands。
  - `src/cli/exec-approvals-cli.ts`: 453 行，imports=13，exports=registerExecApprovalsCli。
  - `src/cli/cron-cli.test.ts`: 432 行，imports=2，exports=无显式导出。
  - `src/cli/gateway-cli/run.ts`: 360 行，imports=20，exports=addGatewayRunCommand。
  - `src/cli/gateway-cli.coverage.e2e.test.ts`: 353 行，imports=2，exports=无显式导出。
  - `src/cli/config-cli.ts`: 344 行，imports=10，exports=runConfigGet, runConfigUnset, registerConfigCli。
  - `src/cli/browser-cli-state.ts`: 328 行，imports=8，exports=registerBrowserStateCommands。
  - `src/cli/daemon-cli/status.print.ts`: 318 行，imports=13，exports=printDaemonStatus。
  - `src/cli/daemon-cli/status.gather.ts`: 299 行，imports=14，exports=DaemonStatus, gatherDaemonStatus, renderPortDiagnosticsForCli, resolvePortListeningAddresses。
  - `src/cli/daemon-cli.coverage.e2e.test.ts`: 284 行，imports=2，exports=无显式导出。
  - `src/cli/daemon-cli/lifecycle-core.ts`: 278 行，imports=7，exports=runServiceUninstall, runServiceStart, runServiceStop, runServiceRestart。
  - `src/cli/dns-cli.ts`: 263 行，imports=11，exports=registerDnsCli。
  - `src/cli/gateway-cli/register.ts`: 254 行，imports=19，exports=registerGatewayCli。
  - `src/cli/cron-cli/register.cron-add.ts`: 251 行，imports=9，exports=registerCronStatusCommand, registerCronListCommand, registerCronAddCommand。
  - `src/cli/devices-cli.ts`: 249 行，imports=8，exports=registerDevicesCli。
  - `src/cli/channels-cli.ts`: 248 行，imports=10，exports=registerChannelsCli。
  - `src/cli/directory-cli.ts`: 247 行，imports=10，exports=registerDirectoryCli。
  - `src/cli/browser-cli-actions-input/register.element.ts`: 239 行，imports=5，exports=registerBrowserElementCommands。
  - `src/cli/cron-cli/shared.ts`: 229 行，imports=8，exports=getCronChannelOptions, warnIfCronSchedulerDisabled, parseDurationMs, parseAt, printCronList。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 27 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 17 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 11 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 4 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/cli` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

