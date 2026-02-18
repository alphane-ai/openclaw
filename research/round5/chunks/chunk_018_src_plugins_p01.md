# chunk_018_src_plugins_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：49
- 实际可读文件数：49
- 缺失/不可读文件数：0
- 主目录组：`src/plugins`
- 代码总行数（近似）：9421

## 2. 模块要点
- 文件类型分布：module=32，test=17，doc=0，config=0。
- 导入语句总数（近似）：292。
- 重点文件（按行数）与导出摘要：
  - `src/plugins/types.ts`: 599 行，imports=17，exports=PluginLogger, PluginConfigUiHint, PluginKind, PluginConfigValidation, OpenClawPluginConfigSchema, OpenClawPluginToolContext。
  - `src/plugins/install.e2e.test.ts`: 563 行，imports=8，exports=(anonymous-or-reexport)。
  - `src/plugins/uninstall.test.ts`: 539 行，imports=7，exports=无显式导出。
  - `src/plugins/registry.ts`: 520 行，imports=12，exports=PluginToolRegistration, PluginCliRegistration, PluginHttpRegistration, PluginHttpRouteRegistration, PluginChannelRegistration, PluginProviderRegistration。
  - `src/plugins/hooks.ts`: 510 行，imports=2，exports=HookRunnerLogger, HookRunnerOptions, createHookRunner, HookRunner。
  - `src/plugins/install.ts`: 508 行，imports=12，exports=InstallPluginResult, resolvePluginInstallDir, installPluginFromArchive, installPluginFromDir, installPluginFromFile, installPluginFromNpmSpec。
  - `src/plugins/loader.test.ts`: 485 行，imports=6，exports=无显式导出。
  - `src/plugins/loader.ts`: 481 行，imports=18，exports=PluginLoadResult, PluginLoadOptions, loadOpenClawPlugins。
  - `src/plugins/runtime/index.ts`: 436 行，imports=78，exports=createPluginRuntime。
  - `src/plugins/update.ts`: 433 行，imports=8，exports=PluginUpdateLogger, PluginUpdateStatus, PluginUpdateOutcome, PluginUpdateSummary, PluginChannelSyncSummary, PluginChannelSyncResult。
  - `src/plugins/runtime/types.ts`: 365 行，imports=1，exports=RuntimeLogger, PluginRuntime。
  - `src/plugins/discovery.ts`: 365 行，imports=6，exports=PluginCandidate, PluginDiscoveryResult, discoverOpenClawPlugins。
  - `src/plugins/commands.ts`: 318 行，imports=3，exports=validateCommandName, CommandRegistrationResult, registerPluginCommand, clearPluginCommands, clearPluginCommandsForPlugin, matchPluginCommand。
  - `src/plugins/manifest-registry.ts`: 262 行，imports=7，exports=PluginManifestRecord, PluginManifestRegistry, clearPluginManifestRegistryCache, loadPluginManifestRegistry。
  - `src/plugins/uninstall.ts`: 238 行，imports=6，exports=UninstallActions, UninstallPluginResult, resolveUninstallDirectoryTarget, removePluginFromConfig, UninstallPluginParams, uninstallPlugin。
  - `src/plugins/config-state.ts`: 226 行，imports=3，exports=NormalizedPluginsConfig, BUNDLED_ENABLED_BY_DEFAULT, normalizePluginsConfig, applyTestPluginDefaults, isTestDefaultMemorySlotDisabled, resolveEnableState。
  - `src/plugins/manifest-registry.test.ts`: 180 行，imports=7，exports=无显式导出。
  - `src/plugins/voice-call.plugin.test.ts`: 175 行，imports=3，exports=无显式导出。
  - `src/plugins/wired-hooks-after-tool-call.e2e.test.ts`: 170 行，imports=1，exports=无显式导出。
  - `src/plugins/tools.optional.test.ts`: 158 行，imports=2，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 20 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 10 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 6 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 3 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 2 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/plugins` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

