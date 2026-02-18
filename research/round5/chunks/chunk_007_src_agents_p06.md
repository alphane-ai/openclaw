# chunk_007_src_agents_p06 研究笔记

## 1. 覆盖确认
- 清单文件数：67
- 实际可读文件数：67
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：12668

## 2. 模块要点
- 文件类型分布：module=33，test=34，doc=0，config=0。
- 导入语句总数（近似）：309。
- 重点文件（按行数）与导出摘要：
  - `src/agents/subagent-announce.format.e2e.test.ts`: 826 行，imports=1，exports=无显式导出。
  - `src/agents/subagent-registry.ts`: 744 行，imports=8，exports=SubagentRunRecord, markSubagentRunForSteerRestart, clearSubagentRunSteerRestart, replaceSubagentRunAfterSteer, registerSubagentRun, resetSubagentRegistryForTests。
  - `src/agents/system-prompt.ts`: 678 行，imports=7，exports=PromptMode, buildAgentSystemPrompt, buildRuntimeLine。
  - `src/agents/subagent-announce.ts`: 642 行，imports=12，exports=buildSubagentSystemPrompt, SubagentRunOutcome, SubagentAnnounceType, runSubagentAnnounceFlow。
  - `src/agents/system-prompt.e2e.test.ts`: 560 行，imports=3，exports=无显式导出。
  - `src/agents/skills/workspace.ts`: 523 行，imports=15，exports=buildWorkspaceSkillSnapshot, buildWorkspaceSkillsPrompt, resolveSkillsPromptForRun, loadWorkspaceSkillEntries, syncSkillsToWorkspace, filterWorkspaceSkillEntries。
  - `src/agents/skills-install.ts`: 509 行，imports=9，exports=SkillInstallRequest, SkillInstallResult, installSkill。
  - `src/agents/skills-install-download.ts`: 377 行，imports=14，exports=installDownloadSpec。
  - `src/agents/skills-install.download.e2e.test.ts`: 336 行，imports=7，exports=(anonymous-or-reexport)。
  - `src/agents/skills-install.download-tarbz2.e2e.test.ts`: 318 行，imports=5，exports=(anonymous-or-reexport)。
  - `src/agents/session-transcript-repair.ts`: 310 行，imports=2，exports=ToolCallInputRepairReport, stripToolResultDetails, repairToolCallInputs, sanitizeToolCallInputs, sanitizeToolUseResultPairing, ToolUseRepairReport。
  - `src/agents/session-tool-result-guard.e2e.test.ts`: 303 行，imports=4，exports=无显式导出。
  - `src/agents/skills.e2e.test.ts`: 300 行，imports=5，exports=无显式导出。
  - `src/agents/subagent-registry.persistence.e2e.test.ts`: 283 行，imports=7，exports=无显式导出。
  - `src/agents/session-transcript-repair.e2e.test.ts`: 272 行，imports=3，exports=无显式导出。
  - `src/agents/skills-status.ts`: 254 行，imports=7，exports=SkillStatusConfigCheck, SkillInstallOption, SkillStatusEntry, SkillStatusReport, buildWorkspaceSkillStatus。
  - `src/agents/skills-install-fallback.e2e.test.ts`: 241 行，imports=6，exports=(anonymous-or-reexport)。
  - `src/agents/subagent-announce-queue.ts`: 234 行，imports=4，exports=AnnounceQueueItem, AnnounceQueueSettings, resetAnnounceQueuesForTests, enqueueAnnounce。
  - `src/agents/session-write-lock.ts`: 219 行，imports=4，exports=acquireSessionWriteLock, __testing。
  - `src/agents/subagent-registry.steer-restart.test.ts`: 212 行，imports=1，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 39 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 22 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 11 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 9 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 9 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

