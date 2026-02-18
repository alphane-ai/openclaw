# chunk_016_scripts_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：104
- 实际可读文件数：104
- 缺失/不可读文件数：0
- 主目录组：`scripts/docs-i18n, scripts/docker, scripts/e2e, scripts/dev`
- 代码总行数（近似）：13856

## 2. 模块要点
- 文件类型分布：module=102，test=0，doc=1，config=1。
- 导入语句总数（近似）：117。
- 重点文件（按行数）与导出摘要：
  - `scripts/pr`: 1121 行，imports=0，exports=无显式导出。
  - `scripts/label-open-issues.ts`: 913 行，imports=4，exports=无显式导出。
  - `scripts/e2e/onboard-docker.sh`: 565 行，imports=12，exports=无显式导出。
  - `scripts/docker/install-sh-e2e/run.sh`: 536 行，imports=0，exports=无显式导出。
  - `scripts/shell-helpers/clawdock-helpers.sh`: 414 行，imports=0，exports=无显式导出。
  - `scripts/test-parallel.mjs`: 393 行，imports=4，exports=无显式导出。
  - `scripts/debug-claude-usage.ts`: 392 行，imports=5，exports=无显式导出。
  - `scripts/clawlog.sh`: 310 行，imports=0，exports=无显式导出。
  - `scripts/codesign-mac-app.sh`: 290 行，imports=0，exports=无显式导出。
  - `scripts/dev/ios-node-e2e.ts`: 284 行，imports=1，exports=无显式导出。
  - `scripts/claude-auth-status.sh`: 281 行，imports=0，exports=无显式导出。
  - `scripts/docs-i18n/main.go`: 274 行，imports=1，exports=无显式导出。
  - `scripts/docs-i18n/doc_mode.go`: 273 行，imports=1，exports=无显式导出。
  - `scripts/restart-mac.sh`: 270 行，imports=0，exports=无显式导出。
  - `scripts/run-node.mjs`: 264 行，imports=5，exports=runNodeMain。
  - `scripts/package-mac-app.sh`: 262 行，imports=0，exports=无显式导出。
  - `scripts/docs-i18n/translator.go`: 248 行，imports=1，exports=无显式导出。
  - `scripts/protocol-gen-swift.ts`: 245 行，imports=4，exports=无显式导出。
  - `scripts/docs-link-audit.mjs`: 234 行，imports=2，exports=无显式导出。
  - `scripts/shell-helpers/README.md`: 227 行，imports=0，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 40 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 31 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 25 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 15 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 9 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `scripts/docs-i18n, scripts/docker, scripts/e2e, scripts/dev, scripts/pre-commit, scripts/shell-helpers` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

