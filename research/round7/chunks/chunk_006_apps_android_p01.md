# chunk_006_apps_android_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：70
- 实际可读文件数：70
- 缺失/不可读文件数：0
- 主目录组：`apps/android`
- 代码总行数（近似）：11897

## 2. 模块要点
- 文件类型分布：module=69，test=0，doc=1，config=0。
- 导入语句总数（近似）：902。
- 重点文件（按行数）与导出摘要：
  - `apps/android/app/src/main/java/ai/openclaw/android/voice/TalkModeManager.kt`: 1258 行，imports=42，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/NodeRuntime.kt`: 754 行，imports=37，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/ui/SettingsSheet.kt`: 724 行，imports=66，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/gateway/GatewaySession.kt`: 705 行，imports=30，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/chat/ChatController.kt`: 525 行，imports=17，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/gateway/GatewayDiscovery.kt`: 522 行，imports=42，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/ui/RootScreen.kt`: 430 行，imports=67，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/node/CameraCaptureManager.kt`: 365 行，imports=36，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/node/AppUpdateHandler.kt`: 296 行，imports=19，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/ui/chat/ChatComposer.kt`: 286 行，imports=40，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/SecurePrefs.kt`: 286 行，imports=12，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/node/CanvasController.kt`: 265 行，imports=19，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/ui/chat/ChatMessageViews.kt`: 264 行，imports=38，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/node/SmsManager.kt`: 231 行，imports=12，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/tools/ToolDisplay.kt`: 223 行，imports=8，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/ui/chat/ChatMarkdown.kt`: 216 行，imports=30，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/node/ScreenRecordManager.kt`: 200 行，imports=12，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/voice/TalkDirectiveParser.kt`: 192 行，imports=4，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/node/ConnectionManager.kt`: 189 行，imports=16，exports=无显式导出。
  - `apps/android/app/src/main/java/ai/openclaw/android/MainViewModel.kt`: 189 行，imports=9，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 16 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 12 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/android` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

