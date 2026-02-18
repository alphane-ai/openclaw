# chunk_001_src_cron_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：58
- 实际可读文件数：58
- 缺失/不可读文件数：0
- 主目录组：`src/cron`
- 代码总行数（近似）：10638

## 2. 模块要点
- 文件类型分布：module=30，test=28，doc=0，config=0。
- 导入语句总数（近似）：286。
- 重点文件（按行数）与导出摘要：
  - `src/cron/service.runs-one-shot-main-job-disables-it.test.ts`: 841 行，imports=6，exports=无显式导出。
  - `src/cron/isolated-agent/run.ts`: 704 行，imports=35，exports=RunCronAgentTurnResult, runCronIsolatedAgentTurn。
  - `src/cron/isolated-agent.uses-last-non-empty-agent-text-as.e2e.test.ts`: 694 行，imports=10，exports=无显式导出。
  - `src/cron/service/timer.ts`: 619 行，imports=9，exports=armTimer, onTimer, runMissedJobs, runDueJobs, executeJob, wake。
  - `src/cron/service.issue-regressions.test.ts`: 562 行，imports=8，exports=无显式导出。
  - `src/cron/service/jobs.ts`: 507 行，imports=7，exports=assertSupportedJobSpec, findJobOrThrow, computeJobNextRunAtMs, recomputeNextRuns, recomputeNextRunsForMaintenance, nextWakeAtMs。
  - `src/cron/service/store.ts`: 467 行，imports=9，exports=ensureLoaded, warnIfDisabled, persist。
  - `src/cron/normalize.ts`: 448 行，imports=7，exports=normalizeCronJobInput, normalizeCronJobCreate, normalizeCronJobPatch。
  - `src/cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.e2e.test.ts`: 353 行，imports=12，exports=无显式导出。
  - `src/cron/isolated-agent/run.skill-filter.test.ts`: 346 行，imports=1，exports=无显式导出。
  - `src/cron/normalize.test.ts`: 343 行，imports=2，exports=无显式导出。
  - `src/cron/service.issue-16156-list-skips-cron.test.ts`: 239 行，imports=6，exports=无显式导出。
  - `src/cron/service.every-jobs-fire.test.ts`: 224 行，imports=6，exports=无显式导出。
  - `src/cron/service/ops.ts`: 223 行，imports=6，exports=start, stop, status, list, add, update。
  - `src/cron/session-reaper.test.ts`: 204 行，imports=7，exports=无显式导出。
  - `src/cron/service/jobs.schedule-error-isolation.test.ts`: 190 行，imports=4，exports=无显式导出。
  - `src/cron/service.jobs.test.ts`: 182 行，imports=3，exports=无显式导出。
  - `src/cron/service.restart-catchup.test.ts`: 170 行，imports=5，exports=无显式导出。
  - `src/cron/service.skips-main-jobs-empty-systemevent-text.test.ts`: 168 行，imports=6，exports=无显式导出。
  - `src/cron/isolated-agent/subagent-followup.ts`: 153 行，imports=3，exports=isLikelyInterimCronMessage, expectsSubagentFollowup, readDescendantSubagentFallbackReply, waitForDescendantSubagentSummary。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 35 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- fs_delete: 命中 13 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- secrets: 命中 6 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/cron` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

