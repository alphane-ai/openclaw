# chunk_004_apps_macos_p04 研究笔记

## 1. 覆盖确认
- 清单文件数：57
- 实际可读文件数：57
- 缺失/不可读文件数：0
- 主目录组：`apps/macos`
- 代码总行数（近似）：11263

## 2. 模块要点
- 文件类型分布：module=57，test=0，doc=0，config=0。
- 导入语句总数（近似）：146。
- 重点文件（按行数）与导出摘要：
  - `apps/macos/Sources/OpenClaw/TalkModeRuntime.swift`: 954 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoiceWakeRuntime.swift`: 806 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClawDiscovery/GatewayDiscoveryModel.swift`: 683 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoiceWakeSettings.swift`: 676 行，imports=7，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/SkillsSettings.swift`: 622 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/SessionMenuPreviewView.swift`: 496 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoiceWakeTester.swift`: 474 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoicePushToTalk.swift`: 422 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/SystemRunSettingsView.swift`: 415 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/TailscaleIntegrationSection.swift`: 402 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/WebChatSwiftUI.swift`: 375 行，imports=8，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/SessionData.swift`: 347 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoiceWakeOverlayController+Session.swift`: 282 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ScreenRecordService.swift`: 267 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/WorkActivityStore.swift`: 263 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/SettingsRootView.swift`: 244 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/TalkOverlayView.swift`: 226 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/SessionsSettings.swift`: 213 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoiceWakeOverlayTextViews.swift`: 203 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/VoiceWakeOverlayView.swift`: 189 行，imports=1，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 23 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 19 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/macos` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

