# chunk_020_src_daemon_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：32
- 实际可读文件数：32
- 缺失/不可读文件数：0
- 主目录组：`src/daemon`
- 代码总行数（近似）：4809

## 2. 模块要点
- 文件类型分布：module=24，test=8，doc=0，config=0。
- 导入语句总数（近似）：93。
- 重点文件（按行数）与导出摘要：
  - `src/daemon/launchd.ts`: 437 行，imports=9，exports=resolveLaunchAgentPlistPath, resolveGatewayLogPaths, readLaunchAgentProgramArguments, buildLaunchAgentPlist, LaunchctlPrintInfo, parseLaunchctlPrint。
  - `src/daemon/inspect.ts`: 415 行，imports=4，exports=ExtraGatewayService, FindExtraGatewayServicesOptions, renderGatewayServiceCleanupHints, findExtraGatewayServices。
  - `src/daemon/systemd.ts`: 414 行，imports=10，exports=resolveSystemdUserUnitPath, readSystemdServiceExecStart, SystemdServiceInfo, parseSystemdShow, isSystemdUserServiceAvailable, installSystemdService。
  - `src/daemon/service-audit.ts`: 360 行，imports=6，exports=GatewayServiceCommand, ServiceConfigIssue, ServiceConfigAudit, SERVICE_AUDIT_CODES, needsNodeRuntimeMigration, auditGatewayServiceConfig。
  - `src/daemon/schtasks.ts`: 338 行，imports=9，exports=resolveTaskScriptPath, readScheduledTaskCommand, ScheduledTaskInfo, parseSchtasksQuery, installScheduledTask, uninstallScheduledTask。
  - `src/daemon/service-env.test.ts`: 290 行，imports=4，exports=无显式导出。
  - `src/daemon/program-args.ts`: 288 行，imports=2，exports=resolveGatewayProgramArguments, resolveNodeProgramArguments。
  - `src/daemon/schtasks.test.ts`: 212 行，imports=5，exports=无显式导出。
  - `src/daemon/launchd.test.ts`: 203 行，imports=3，exports=无显式导出。
  - `src/daemon/service-env.ts`: 195 行，imports=3，exports=MinimalServicePathOptions, resolveLinuxUserBinDirs, getMinimalServicePathParts, getMinimalServicePathPartsFromEnv, buildMinimalServicePath, buildServiceEnvironment。
  - `src/daemon/runtime-paths.ts`: 165 行，imports=5，exports=SystemNodeInfo, isVersionManagedNodePath, isSystemNodePath, resolveSystemNodePath, resolveSystemNodeInfo, renderSystemNodeWarning。
  - `src/daemon/service.ts`: 156 行，imports=4，exports=GatewayServiceInstallArgs, GatewayService, resolveGatewayService。
  - `src/daemon/systemd.test.ts`: 154 行，imports=4，exports=无显式导出。
  - `src/daemon/constants.test.ts`: 131 行，imports=2，exports=无显式导出。
  - `src/daemon/runtime-paths.test.ts`: 127 行，imports=2，exports=无显式导出。
  - `src/daemon/launchd-plist.ts`: 111 行，imports=1，exports=readLaunchAgentProgramArgumentsFromFile, buildLaunchAgentPlist。
  - `src/daemon/constants.ts`: 111 行，imports=0，exports=GATEWAY_LAUNCH_AGENT_LABEL, GATEWAY_SYSTEMD_SERVICE_NAME, GATEWAY_WINDOWS_TASK_NAME, GATEWAY_SERVICE_MARKER, GATEWAY_SERVICE_KIND, NODE_LAUNCH_AGENT_LABEL。
  - `src/daemon/systemd-unit.ts`: 109 行，imports=1，exports=buildSystemdUnit, parseSystemdExecStart, parseSystemdEnvAssignment。
  - `src/daemon/program-args.test.ts`: 91 行，imports=3，exports=无显式导出。
  - `src/daemon/systemd-linger.ts`: 74 行，imports=2，exports=SystemdUserLingerStatus, readSystemdUserLingerStatus, enableSystemdUserLinger。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- command_exec: 命中 12 文件。涉及命令执行链路，需要关注注入与参数转义。
- secrets: 命中 7 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 7 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/daemon` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

