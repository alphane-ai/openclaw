# chunk_020_Swabble_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：32
- 实际可读文件数：32
- 缺失/不可读文件数：0
- 主目录组：`Swabble/Sources, Swabble/Tests, Swabble/scripts, Swabble/CHANGELOG.md`
- 代码总行数（近似）：1839

## 2. 模块要点
- 文件类型分布：module=29，test=0，doc=3，config=0。
- 导入语句总数（近似）：60。
- 重点文件（按行数）与导出摘要：
  - `Swabble/Sources/SwabbleKit/WakeWordGate.swift`: 198 行，imports=2，exports=无显式导出。
  - `Swabble/Sources/swabble/main.swift`: 152 行，imports=2，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Speech/SpeechPipeline.swift`: 115 行，imports=3，exports=无显式导出。
  - `Swabble/README.md`: 112 行，imports=0，exports=无显式导出。
  - `Swabble/Sources/swabble/Commands/ServeCommand.swift`: 82 行，imports=4，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Config/Config.swift`: 78 行，imports=1，exports=无显式导出。
  - `Swabble/Sources/swabble/Commands/ServiceCommands.swift`: 78 行，imports=2，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Hooks/HookExecutor.swift`: 76 行，imports=1，exports=无显式导出。
  - `Swabble/Sources/swabble/CLI/CLIRegistry.swift`: 72 行，imports=2，exports=无显式导出。
  - `Swabble/Package.resolved`: 70 行，imports=0，exports=无显式导出。
  - `Swabble/Tests/SwabbleKitTests/WakeWordGateTests.swift`: 64 行，imports=3，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Support/AttributedString+Sentences.swift`: 63 行，imports=3，exports=无显式导出。
  - `Swabble/Sources/swabble/Commands/MicCommands.swift`: 63 行，imports=4，exports=无显式导出。
  - `Swabble/Sources/swabble/Commands/TranscribeCommand.swift`: 62 行，imports=5，exports=无显式导出。
  - `Swabble/Package.swift`: 56 行，imports=1，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Speech/BufferConverter.swift`: 51 行，imports=1，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Support/OutputFormat.swift`: 46 行，imports=2，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Support/TranscriptsStore.swift`: 46 行，imports=1，exports=无显式导出。
  - `Swabble/Sources/SwabbleCore/Support/Logging.swift`: 42 行，imports=1，exports=无显式导出。
  - `Swabble/Sources/swabble/Commands/DoctorCommand.swift`: 38 行，imports=4，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 4 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `Swabble/Sources, Swabble/Tests, Swabble/scripts, Swabble/CHANGELOG.md, Swabble/LICENSE, Swabble/Package.resolved` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

