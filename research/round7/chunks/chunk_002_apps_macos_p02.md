# chunk_002_apps_macos_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：41
- 实际可读文件数：41
- 缺失/不可读文件数：0
- 主目录组：`apps/macos`
- 代码总行数（近似）：10802

## 2. 模块要点
- 文件类型分布：module=41，test=0，doc=0，config=0。
- 导入语句总数（近似）：112。
- 重点文件（按行数）与导出摘要：
  - `apps/macos/Sources/OpenClaw/DebugSettings.swift`: 1027 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ExecApprovalsSocket.swift`: 839 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ExecApprovals.swift`: 797 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/GeneralSettings.swift`: 749 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/GatewayConnection.swift`: 743 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/GatewayEndpointStore.swift`: 729 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/InstancesSettings.swift`: 480 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/MenuBar.swift`: 475 行，imports=9，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/GatewayProcessManager.swift`: 433 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/InstancesStore.swift`: 350 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/GatewayEnvironment.swift`: 345 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/HoverHUD.swift`: 312 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/DevicePairingApprovalPrompter.swift`: 308 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/HealthStore.swift`: 302 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/DebugActions.swift`: 266 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CronSettings+Rows.swift`: 247 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/Logging/OpenClawLogging.swift`: 233 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/GatewayLaunchAgentManager.swift`: 205 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/DeepLinks.swift`: 198 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/DeviceModelCatalog.swift`: 189 行，imports=1，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 20 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 8 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 5 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/macos` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

