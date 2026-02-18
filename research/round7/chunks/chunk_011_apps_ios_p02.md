# chunk_011_apps_ios_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：51
- 实际可读文件数：51
- 缺失/不可读文件数：0
- 主目录组：`apps/ios`
- 代码总行数（近似）：9268

## 2. 模块要点
- 文件类型分布：module=49，test=0，doc=1，config=1。
- 导入语句总数（近似）：113。
- 重点文件（按行数）与导出摘要：
  - `apps/ios/Sources/Voice/TalkModeManager.swift`: 1843 行，imports=8，exports=无显式导出。
  - `apps/ios/Sources/Model/NodeAppModel.swift`: 1813 行，imports=7，exports=无显式导出。
  - `apps/ios/Sources/Settings/SettingsTab.swift`: 872 行，imports=6，exports=无显式导出。
  - `apps/ios/Sources/Voice/VoiceWakeManager.swift`: 496 行，imports=6，exports=无显式导出。
  - `apps/ios/Sources/Screen/ScreenController.swift`: 438 行，imports=4，exports=无显式导出。
  - `apps/ios/Sources/Screen/ScreenRecordService.swift`: 361 行，imports=2，exports=无显式导出。
  - `apps/ios/Sources/Onboarding/GatewayOnboardingView.swift`: 355 行，imports=2，exports=无显式导出。
  - `apps/ios/Sources/RootCanvas.swift`: 349 行，imports=2，exports=无显式导出。
  - `apps/ios/Tests/GatewaySettingsStoreTests.swift`: 200 行，imports=2，exports=无显式导出。
  - `apps/ios/Tests/NodeAppModelInvokeTests.swift`: 196 行，imports=4，exports=无显式导出。
  - `apps/ios/project.yml`: 135 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Reminders/RemindersService.swift`: 134 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Status/StatusPill.swift`: 128 行，imports=1，exports=无显式导出。
  - `apps/ios/Sources/RootTabs.swift`: 114 行，imports=1，exports=无显式导出。
  - `apps/ios/Tests/GatewayConnectionSecurityTests.swift`: 106 行，imports=3，exports=无显式导出。
  - `apps/ios/fastlane/Fastfile`: 104 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Motion/MotionService.swift`: 101 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Settings/VoiceWakeWordsSettingsView.swift`: 99 行，imports=2，exports=无显式导出。
  - `apps/ios/Tests/VoiceWakeManagerExtractCommandTests.swift`: 91 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Voice/TalkOrbOverlay.swift`: 88 行，imports=1，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 15 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 8 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/ios` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

