# chunk_003_apps_macos_p03 研究笔记

## 1. 覆盖确认
- 清单文件数：50
- 实际可读文件数：50
- 缺失/不可读文件数：0
- 主目录组：`apps/macos`
- 代码总行数（近似）：10771

## 2. 模块要点
- 文件类型分布：module=47，test=0，doc=1，config=2。
- 导入语句总数（近似）：137。
- 重点文件（按行数）与导出摘要：
  - `apps/macos/Sources/OpenClaw/MenuSessionsInjector.swift`: 1234 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/NodeMode/MacNodeRuntime.swift`: 970 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/OnboardingView+Pages.swift`: 846 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/NodePairingApprovalPrompter.swift`: 682 行，imports=9，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/MenuContentView.swift`: 597 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/PermissionManager.swift`: 507 行，imports=10，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/PortGuardian.swift`: 423 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/OnboardingWizard.swift`: 420 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/OpenClawConfigFile.swift`: 361 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/NodesMenu.swift`: 334 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/RemotePortTunnel.swift`: 318 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/OnboardingView+Layout.swift`: 235 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/PermissionsSettings.swift`: 230 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/MenuContextCardInjector.swift`: 229 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/Resources/DeviceModels/mac-device-identifiers.json`: 215 行，imports=0，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/Onboarding.swift`: 197 行，imports=7，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/NotifyOverlay.swift`: 193 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/OnboardingView+Monitoring.swift`: 179 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/Resources/DeviceModels/ios-device-identifiers.json`: 177 行，imports=0，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/NodeMode/MacNodeModeCoordinator.swift`: 172 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 22 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 10 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 8 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 1 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/macos` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

