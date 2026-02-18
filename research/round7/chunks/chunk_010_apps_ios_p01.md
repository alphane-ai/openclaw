# chunk_010_apps_ios_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：41
- 实际可读文件数：41
- 缺失/不可读文件数：0
- 主目录组：`apps/ios`
- 代码总行数（近似）：5623

## 2. 模块要点
- 文件类型分布：module=38，test=0，doc=1，config=2。
- 导入语句总数（近似）：73。
- 重点文件（按行数）与导出摘要：
  - `apps/ios/Sources/Gateway/GatewayConnectionController.swift`: 855 行，imports=16，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-60@3x.png`: 431 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Camera/CameraController.swift`: 403 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Gateway/GatewaySettingsStore.swift`: 397 行，imports=2，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-83.5@2x.png`: 372 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-76@2x.png`: 295 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Contacts/ContactsService.swift`: 213 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Gateway/GatewayDiscoveryModel.swift`: 191 行，imports=4，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-40@3x.png`: 187 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-60@2x.png`: 187 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Media/PhotoLibraryService.swift`: 165 行，imports=4，exports=无显式导出。
  - `apps/ios/Sources/Location/LocationService.swift`: 139 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Calendar/CalendarService.swift`: 136 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-29@3x.png`: 131 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-40@2x.png`: 130 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Chat/IOSGatewayChatTransport.swift`: 130 行，imports=4，exports=无显式导出。
  - `apps/ios/Sources/Device/DeviceStatusService.swift`: 88 行，imports=3，exports=无显式导出。
  - `apps/ios/Sources/Gateway/GatewayHealthMonitor.swift`: 86 行，imports=2，exports=无显式导出。
  - `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/icon-20@3x.png`: 78 行，imports=0，exports=无显式导出。
  - `apps/ios/Sources/Info.plist`: 73 行，imports=0，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 7 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 6 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 5 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/ios` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

