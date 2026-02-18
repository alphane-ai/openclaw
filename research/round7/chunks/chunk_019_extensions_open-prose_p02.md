# chunk_019_extensions_open-prose_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：28
- 实际可读文件数：28
- 缺失/不可读文件数：0
- 主目录组：`extensions/open-prose`
- 代码总行数（近似）：9647

## 2. 模块要点
- 文件类型分布：module=15，test=0，doc=13，config=0。
- 导入语句总数（近似）：4。
- 重点文件（按行数）与导出摘要：
  - `extensions/open-prose/skills/prose/prose.md`: 1238 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/guidance/antipatterns.md`: 952 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/state/postgres.md`: 881 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/guidance/patterns.md`: 701 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/primitives/session.md`: 594 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/state/sqlite.md`: 575 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/state/filesystem.md`: 499 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/profiler.prose`: 461 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/examples/48-habit-miner.prose`: 446 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/examples/README.md`: 392 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/state/in-context.md`: 385 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/program-improver.prose`: 276 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/error-forensics.prose`: 251 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/vm-improver.prose`: 244 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/examples/roadmap/syntax/open-prose-syntax.prose`: 224 行，imports=3，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/calibrator.prose`: 216 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/examples/49-prose-run-retrospective.prose`: 211 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/inspector.prose`: 197 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/guidance/system-prompt.md`: 181 行，imports=0，exports=无显式导出。
  - `extensions/open-prose/skills/prose/lib/cost-analyzer.prose`: 175 行，imports=0，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 12 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 7 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 6 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/open-prose` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

