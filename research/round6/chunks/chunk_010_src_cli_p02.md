# chunk_010_src_cli_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：84
- 实际可读文件数：84
- 缺失/不可读文件数：0
- 主目录组：`src/cli`
- 代码总行数（近似）：12078

## 2. 模块要点
- 文件类型分布：module=67，test=17，doc=0，config=0。
- 导入语句总数（近似）：422。
- 重点文件（按行数）与导出摘要：
  - `src/cli/hooks-cli.ts`: 802 行，imports=20，exports=HooksListOptions, HookInfoOptions, HooksCheckOptions, HooksUpdateOptions, formatHooksList, formatHookInfo。
  - `src/cli/plugins-cli.ts`: 750 行，imports=23，exports=PluginsListOptions, PluginInfoOptions, PluginUpdateOptions, PluginUninstallOptions, registerPluginsCli。
  - `src/cli/memory-cli.ts`: 745 行，imports=18，exports=runMemoryStatus, registerMemoryCli。
  - `src/cli/program.nodes-media.e2e.test.ts`: 577 行，imports=4，exports=无显式导出。
  - `src/cli/models-cli.ts`: 444 行，imports=6，exports=registerModelsCli。
  - `src/cli/memory-cli.test.ts`: 435 行，imports=5，exports=无显式导出。
  - `src/cli/nodes-cli/register.status.ts`: 409 行，imports=11，exports=registerNodesStatusCommands。
  - `src/cli/nodes-cli/register.invoke.ts`: 369 行，imports=13，exports=registerNodesInvokeCommands。
  - `src/cli/logs-cli.ts`: 329 行，imports=11，exports=formatLogTimestamp, registerLogsCli。
  - `src/cli/program.nodes-basic.e2e.test.ts`: 316 行，imports=2，exports=无显式导出。
  - `src/cli/node-cli/daemon.ts`: 308 行，imports=14，exports=runNodeDaemonInstall, runNodeDaemonUninstall, runNodeDaemonStart, runNodeDaemonRestart, runNodeDaemonStop, runNodeDaemonStatus。
  - `src/cli/program/register.subclis.ts`: 299 行，imports=5，exports=getSubCliEntries, registerSubCliByName, registerSubCliCommands。
  - `src/cli/program/routes.ts`: 257 行，imports=2，exports=RouteSpec, findRoutedCommand。
  - `src/cli/nodes-cli/register.camera.ts`: 256 行，imports=9，exports=registerNodesCameraCommands。
  - `src/cli/nodes-cli/register.canvas.ts`: 246 行，imports=11，exports=registerNodesCanvasCommands。
  - `src/cli/program.smoke.e2e.test.ts`: 243 行，imports=2，exports=无显式导出。
  - `src/cli/nodes-cli.coverage.test.ts`: 231 行，imports=2，exports=无显式导出。
  - `src/cli/program/command-registry.ts`: 219 行，imports=5，exports=CommandRegistration, getCoreCliCommandNames, registerCoreCliByName, registerCoreCliCommands, registerProgramCommands。
  - `src/cli/program/register.agent.ts`: 214 行，imports=13，exports=registerAgentCommands。
  - `src/cli/program/message/helpers.test.ts`: 208 行，imports=1，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 22 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 16 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 8 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/cli` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

