# chunk_001_apps_macos_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：60
- 实际可读文件数：60
- 缺失/不可读文件数：0
- 主目录组：`apps/macos`
- 代码总行数（近似）：11156

## 2. 模块要点
- 文件类型分布：module=58，test=0，doc=1，config=1。
- 导入语句总数（近似）：122。
- 重点文件（按行数）与导出摘要：
  - `apps/macos/Sources/OpenClaw/AppState.swift`: 722 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CommandResolver.swift`: 575 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ChannelsSettings+ChannelState.swift`: 509 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ControlChannel.swift`: 429 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CameraCaptureService.swift`: 428 行，imports=6，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ConfigSettings.swift`: 396 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CritterIconRenderer.swift`: 388 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/AnthropicOAuth.swift`: 384 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CanvasWindowController.swift`: 374 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ChannelConfigForm.swift`: 364 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CronJobEditor.swift`: 363 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CanvasManager.swift`: 343 行，imports=5，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/AgentWorkspace.swift`: 341 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CritterStatusLabel+Behavior.swift`: 306 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/ChannelsStore.swift`: 297 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CronJobEditor+Helpers.swift`: 272 行，imports=3，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CronModels.swift`: 272 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CanvasSchemeHandler.swift`: 260 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/CanvasChromeContainerView.swift`: 236 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClaw/AnthropicAuthControls.swift`: 235 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 16 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 11 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/macos` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

