# chunk_016_src_process_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：23
- 实际可读文件数：23
- 缺失/不可读文件数：0
- 主目录组：`src/process`
- 代码总行数（近似）：2793

## 2. 模块要点
- 文件类型分布：module=14，test=9，doc=0，config=0。
- 导入语句总数（近似）：57。
- 重点文件（按行数）与导出摘要：
  - `src/process/command-queue.ts`: 287 行，imports=2，exports=CommandLaneClearedError, setCommandLaneConcurrency, enqueueCommandInLane, enqueueCommand, getQueueSize, getTotalQueueSize。
  - `src/process/supervisor/supervisor.ts`: 283 行，imports=7，exports=createProcessSupervisor。
  - `src/process/command-queue.test.ts`: 279 行，imports=2，exports=无显式导出。
  - `src/process/exec.ts`: 240 行，imports=6，exports=shouldSpawnWithShell, runExec, SpawnResult, CommandOptions, runCommandWithTimeout。
  - `src/process/supervisor/adapters/pty.ts`: 185 行，imports=3，exports=PtyAdapter, createPtyAdapter。
  - `src/process/supervisor/adapters/pty.test.ts`: 170 行，imports=1，exports=无显式导出。
  - `src/process/supervisor/adapters/child.ts`: 162 行，imports=5，exports=ChildAdapter, createChildAdapter。
  - `src/process/supervisor/registry.ts`: 155 行，imports=1，exports=RunRegistry, createRunRegistry。
  - `src/process/spawn-utils.ts`: 142 行，imports=2，exports=SpawnFallback, SpawnWithFallbackResult, resolveCommandStdio, formatSpawnError, spawnWithFallback。
  - `src/process/supervisor/adapters/child.test.ts`: 117 行，imports=4，exports=无显式导出。
  - `src/process/supervisor/supervisor.test.ts`: 103 行，imports=2，exports=无显式导出。
  - `src/process/child-process-bridge.test.ts`: 100 行，imports=5，exports=无显式导出。
  - `src/process/supervisor/types.ts`: 97 行，imports=0，exports=RunState, TerminationReason, RunRecord, RunExit, ManagedRun, SpawnMode。
  - `src/process/exec.test.ts`: 85 行，imports=3，exports=无显式导出。
  - `src/process/supervisor/registry.test.ts`: 84 行，imports=2，exports=无显式导出。
  - `src/process/spawn-utils.test.ts`: 81 行，imports=6，exports=无显式导出。
  - `src/process/supervisor/supervisor.pty-command.test.ts`: 77 行，imports=1，exports=无显式导出。
  - `src/process/child-process-bridge.ts`: 48 行，imports=2，exports=ChildProcessBridgeOptions, attachChildProcessBridge。
  - `src/process/kill-tree.ts`: 35 行，imports=1，exports=killProcessTree。
  - `src/process/supervisor/index.ts`: 25 行，imports=2，exports=getProcessSupervisor。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- command_exec: 命中 15 文件。涉及命令执行链路，需要关注注入与参数转义。
- state_write: 命中 9 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 4 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/process` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

