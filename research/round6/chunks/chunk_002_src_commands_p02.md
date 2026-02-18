# chunk_002_src_commands_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：73
- 实际可读文件数：73
- 缺失/不可读文件数：0
- 主目录组：`src/commands`
- 代码总行数（近似）：12674

## 2. 模块要点
- 文件类型分布：module=46，test=27，doc=0，config=0。
- 导入语句总数（近似）：395。
- 重点文件（按行数）与导出摘要：
  - `src/commands/configure.wizard.ts`: 560 行，imports=23，exports=runConfigureWizard。
  - `src/commands/model-picker.ts`: 551 行，imports=10，exports=promptDefaultModel, promptModelAllowlist, applyPrimaryModel, applyModelAllowlist, applyModelFallbacksFromSelection。
  - `src/commands/doctor-state-migrations.e2e.test.ts`: 545 行，imports=6，exports=无显式导出。
  - `src/commands/models.list.test.ts`: 538 行，imports=1，exports=无显式导出。
  - `src/commands/models/list.probe.ts`: 497 行，imports=15，exports=AuthProbeStatus, AuthProbeResult, AuthProbeSummary, AuthProbeOptions, runAuthProbes, formatProbeLatency。
  - `src/commands/message-format.ts`: 423 行，imports=8，exports=MessageCliJsonEnvelope, buildMessageCliJson, formatMessageCliText。
  - `src/commands/doctor.e2e-harness.ts`: 420 行，imports=5，exports=readConfigFileSnapshot, confirm, select, note, writeConfigFile, resolveOpenClawPackageRoot。
  - `src/commands/gateway-status.ts`: 409 行，imports=10，exports=gatewayStatusCommand。
  - `src/commands/doctor-state-integrity.ts`: 397 行，imports=10，exports=noteStateIntegrity, noteWorkspaceBackupTip。
  - `src/commands/models/auth.ts`: 397 行，imports=22，exports=modelsAuthSetupTokenCommand, modelsAuthPasteTokenCommand, modelsAuthAddCommand, resolveRequestedLoginProviderOrThrow, modelsAuthLoginCommand。
  - `src/commands/gateway-status.e2e.test.ts`: 352 行，imports=1，exports=无显式导出。
  - `src/commands/configure.gateway.ts`: 292 行，imports=10，exports=promptGatewayConfig。
  - `src/commands/doctor-sandbox.ts`: 289 行，imports=8，exports=maybeRepairSandboxImages, noteSandboxScopeWarnings。
  - `src/commands/gateway-status/helpers.ts`: 287 行，imports=6，exports=GatewayStatusTarget, GatewayConfigSummary, parseTimeoutMs, resolveTargets, resolveProbeBudgetMs, sanitizeSshTarget。
  - `src/commands/message.e2e.test.ts`: 284 行，imports=5，exports=无显式导出。
  - `src/commands/model-picker.e2e.test.ts`: 266 行，imports=4，exports=无显式导出。
  - `src/commands/health.snapshot.e2e.test.ts`: 242 行，imports=9，exports=无显式导出。
  - `src/commands/daemon-install-helpers.e2e.test.ts`: 242 行，imports=2，exports=无显式导出。
  - `src/commands/models/list.registry.ts`: 238 行，imports=13，exports=loadModelRegistry, toModelRow。
  - `src/commands/health.e2e.test.ts`: 209 行，imports=5，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 41 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 31 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 7 文件。涉及命令执行链路，需要关注注入与参数转义。
- network: 命中 5 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/commands` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

