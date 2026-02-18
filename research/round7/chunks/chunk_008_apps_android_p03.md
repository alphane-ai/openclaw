# chunk_008_apps_android_p03 研究笔记

## 1. 覆盖确认
- 清单文件数：26
- 实际可读文件数：26
- 缺失/不可读文件数：0
- 主目录组：`apps/android`
- 代码总行数（近似）：3720

## 2. 模块要点
- 文件类型分布：module=26，test=0，doc=0，config=0。
- 导入语句总数（近似）：52。
- 重点文件（按行数）与导出摘要：
  - `apps/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png`: 2213 行，imports=0，exports=无显式导出。
  - `apps/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`: 476 行，imports=0，exports=无显式导出。
  - `apps/android/gradle/wrapper/gradle-wrapper.jar`: 315 行，imports=0，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/node/SmsManagerTest.kt`: 92 行，imports=6，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/node/ConnectionManagerTest.kt`: 77 行，imports=4，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/node/AppUpdateHandlerTest.kt`: 66 行，imports=4，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/voice/TalkDirectiveParserTest.kt`: 56 行，imports=4，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/WakeWordsTest.kt`: 51 行，imports=3，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/protocol/OpenClawCanvasA2UIActionTest.kt`: 50 行，imports=4，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/node/JpegSizeLimiterTest.kt`: 48 行，imports=4，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/NodeForegroundServiceTest.kt`: 44 行，imports=10，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/node/CanvasControllerSnapshotParamsTest.kt`: 44 行，imports=3，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/protocol/OpenClawProtocolConstantsTest.kt`: 36 行，imports=2，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/ui/chat/SessionFiltersTest.kt`: 36 行，imports=3，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/voice/VoiceWakeCommandExtractorTest.kt`: 26 行，imports=3，exports=无显式导出。
  - `apps/android/app/src/test/java/ai/openclaw/android/gateway/BonjourEscapesTest.kt`: 20 行，imports=2，exports=无显式导出。
  - `apps/android/app/src/main/res/xml/network_security_config.xml`: 13 行，imports=0，exports=无显式导出。
  - `apps/android/app/src/main/res/xml/data_extraction_rules.xml`: 10 行，imports=0，exports=无显式导出。
  - `apps/android/app/src/main/res/values/themes.xml`: 8 行，imports=0，exports=无显式导出。
  - `apps/android/gradle/wrapper/gradle-wrapper.properties`: 8 行，imports=0，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 4 文件。涉及状态写入，需关注并发覆盖与回滚策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/android` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

