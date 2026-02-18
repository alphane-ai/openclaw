# chunk_001_AGENTS.md 研究笔记

## 1. 覆盖确认
- 清单文件数：10
- 实际可读文件数：10
- 缺失/不可读文件数：0
- 主目录组：`AGENTS.md, CHANGELOG.md, CONTRIBUTING.md, Dockerfile`
- 代码总行数（近似）：3312

## 2. 模块要点
- 文件类型分布：module=5，test=0，doc=5，config=0。
- 导入语句总数（近似）：0。
- 重点文件（按行数）与导出摘要：
  - `CHANGELOG.md`: 2119 行，imports=0，exports=无显式导出。
  - `README.md`: 550 行，imports=0，exports=无显式导出。
  - `AGENTS.md`: 234 行，imports=0，exports=无显式导出。
  - `CONTRIBUTING.md`: 121 行，imports=0，exports=无显式导出。
  - `SECURITY.md`: 117 行，imports=0，exports=无显式导出。
  - `Dockerfile`: 49 行，imports=0，exports=无显式导出。
  - `Dockerfile.sandbox-common`: 46 行，imports=0，exports=无显式导出。
  - `Dockerfile.sandbox-browser`: 33 行，imports=0，exports=无显式导出。
  - `LICENSE`: 22 行，imports=0，exports=无显式导出。
  - `Dockerfile.sandbox`: 21 行，imports=0，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 7 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 6 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 4 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `AGENTS.md, CHANGELOG.md, CONTRIBUTING.md, Dockerfile, Dockerfile.sandbox, Dockerfile.sandbox-browser` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

