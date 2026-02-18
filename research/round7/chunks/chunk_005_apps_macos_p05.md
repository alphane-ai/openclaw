# chunk_005_apps_macos_p05 研究笔记

## 1. 覆盖确认
- 清单文件数：102
- 实际可读文件数：102
- 缺失/不可读文件数：0
- 主目录组：`apps/macos`
- 代码总行数（近似）：11339

## 2. 模块要点
- 文件类型分布：module=102，test=0，doc=0，config=0。
- 导入语句总数（近似）：227。
- 重点文件（按行数）与导出摘要：
  - `apps/macos/Sources/OpenClawProtocol/GatewayModels.swift`: 2854 行，imports=1，exports=无显式导出。
  - `apps/macos/Sources/OpenClawMacCLI/WizardCommand.swift`: 549 行，imports=4，exports=无显式导出。
  - `apps/macos/Sources/OpenClawIPC/IPC.swift`: 417 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClawDiscovery/WideAreaGatewayDiscovery.swift`: 376 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClawMacCLI/ConnectCommand.swift`: 310 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayChannelConfigureTests.swift`: 287 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayEndpointStoreTests.swift`: 227 行，imports=2，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/LowCoverageHelperTests.swift`: 216 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/CommandResolverTests.swift`: 172 行，imports=3，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/SettingsViewSmokeTests.swift`: 166 行，imports=2，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/ChannelsSettingsSmokeTests.swift`: 165 行，imports=3，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayChannelConnectTests.swift`: 161 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/FileHandleLegacyAPIGuardTests.swift`: 156 行，imports=2，exports=无显式导出。
  - `apps/macos/Sources/OpenClawMacCLI/DiscoverCommand.swift`: 150 行，imports=2，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayProcessManagerTests.swift`: 148 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/CronModelsTests.swift`: 142 行，imports=2，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayChannelRequestTests.swift`: 135 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayChannelShutdownTests.swift`: 130 行，imports=4，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/GatewayDiscoveryModelTests.swift`: 125 行，imports=2，exports=无显式导出。
  - `apps/macos/Tests/OpenClawIPCTests/AgentWorkspaceTests.swift`: 124 行，imports=2，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 28 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 22 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 8 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `apps/macos` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

