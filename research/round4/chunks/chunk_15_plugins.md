**覆盖确认**
- 已完整研读 chunk_15_plugins.txt 中定义的全部 49 个文件（核心 loader/registry/runtime、配置解析、发现/manifest、生命周期命令/安装/更新/卸载、hooks/tools/http/slots/status、相关测试等）。

**模块要点**
- `loadOpenClawPlugins` 是插件体系的入口：它应用测试默认、归一化配置、调用 `discoverOpenClawPlugins` 和 `loadPluginManifestRegistry`、创建 `PluginRuntime`/`PluginRegistry`，再通过 `createJiti` 加载插件模块、验证 manifest/schema、执行注册函数，最终缓存、设置全局 registry 并启动全局 hook runner。
- `config-state.ts` + `slots.ts` 统一处理插件的开关、allow/deny、load 路径、memory slot 默认（`memory-core`）、以及测试环境的默认禁用；`manifest.ts`/`manifest-registry.ts` 抽取 `openclaw.plugin.json`、校验字段、按 config/workspace/global/bundled 优先级去重并缓存 schema；`discovery.ts` 扫描 workspace/.openclaw/extensions、全局扩展、bundled 目录和显式 load 路径，保证 `idHint` 与 package.json metadata 一致。
- `registry.ts` 为每个插件创建 `PluginRecord` 并暴露 `createApi`，负责注册工具、hooks（还可直接桥接到内部 hook 系统）、HTTP handlers/routes、channels、providers、CLI 命令、服务、代理命令以及 Gateway 方法；`schema-validator.ts` 用 AJV 缓存编译器防止重复验证，保证 manifest configSchema 与用户配置匹配。
- `hooks.ts` 与 `hook-runner-global.ts` 提供基于 `typedHooks` 的 sequenced/parallel runner（agent/message/tool/session/gateway 事件），`globalHookRunner` 由 loader 初始化并供其他模块调用（例如 `runGlobalGatewayStopSafely`）；`runtime/types.ts` + `runtime/index.ts` 列出插件可访问的运行时能力（配置读写、系统事件、媒体、tts、tools、渠道操作、命令/路由/配对/活动/会话/反应/防抖等），并用 lazy loaders 处理 WhatsApp 相关模块。
- `commands.ts` 管理插件命令（保留命令集、验证格式、注册/执行/锁定、参数清理、执行授权检查），`tools.ts` 则在构建 agent 工具时重新加载插件 registry，避免名称冲突并通过 optional allowlist 控制可选工具；`registry` 中的 `registerTool` 为每个工具记录来源和可选性，`matches` 由 `pluginToolMeta` 追踪。相关测试：`cli.test.ts`、`config-state.test.ts`、`discovery.test.ts`、`loader.test.ts`、`manifest-registry.test.ts`、`slots.test.ts`、`tools.optional.test.ts`、`wired-hooks-*.test.ts`、`voice-call.plugin.test.ts`、`install.e2e.test.ts` 等。
- 安装/更新/卸载：`install.ts` 支持从文件、目录、压缩包、npm spec 安装，强制扫描 `openclaw.extensions` 条目并用 `skill-scanner` 进行 warn-only 安全检查；`installs.ts` 记录 install metadata；`update.ts` 使用 `npm pack` 拉取更新、可做 dry run、自动切换 dev/stable 渠道并同步 load.paths；`uninstall.ts` 从 config 里移除 entries/installs/allowlist/load.paths/memory slot，并在 `deleteFiles` 请求下删掉目标目录。
- 运营/展示套件：`services.ts` 按注册顺序启动插件服务并提供 stop handle；`status.ts` 通过 loader 为 CLI 构建 `PluginStatusReport`；`http-registry.ts`/`http-path.ts` 保障插件 webhook 路径唯一；`source-display.ts` 为 CLI 表格贴源根；`providers.ts` 直接拿 registry.providers 给上层模块；`runtime/native-deps.ts` 生成 native dependency 重建提示；`voice-call.plugin.test.ts` 验证 voice-call 插件通过 `registerGatewayMethod`、工具、CLI 延伸 gateway 命令。

**关键调用链**
1. 插件加载链：`loadOpenClawPlugins` → `applyTestPluginDefaults` + `normalizePluginsConfig` → `discoverOpenClawPlugins` → `loadPluginManifestRegistry` → `createPluginRuntime` → `createPluginRegistry` → `createJiti` → 逐个 candidate（启用/schema/slot/配置验证）→ `register(api)` 调用 → `createPluginRecord`/diagnostics 填充 → `initializeGlobalHookRunner` & `setActivePluginRegistry` + 缓存。
2. 插件贡献注入：`createPluginRegistry.createApi` 给插件暴露 `registerTool`/`registerHook`/`registerCommand`/`registerCli`/`registerService`/`registerProvider`/`registerGatewayMethod`/`registerChannel`，同时 `registerPluginCommand` 与 `clearPluginCommands` 保护命令、`registerInternalHook` 将 hook 注册到 engine，`resolvePluginTools` 或 `registerPluginCliCommands` 重新调用 `loadOpenClawPlugins` 以获取 contributions，再由 `executePluginCommand`、`registry.typedHooks`、global hook runner、gateway stop 等消费。
3. 生命周期维护：`installPluginFrom*` → 安全路径/manifest/schema/scan → `installPackageDir` → `recordPluginInstall`；`updateNpmInstalledPlugins` 通过 `installPluginFromNpmSpec`（或 dry run）检查或下载更新；`syncPluginsForUpdateChannel` 自动切换 dev/stable 插件来源；`uninstallPlugin` 调用 `removePluginFromConfig` 清理 config、可选删除目录、更新 memory slot 和 load.paths；`startPluginServices`/`stop` 管理后台服务。

**风险**
- 插件代码运行在主进程：`install.ts` 仅在安装时做 warn-only 安全扫描、runtime 直接加载任意 `jiti` 输出（并固定全局 registry），无法完全隔离，恶意插件仍可访问 `runtime` 所暴露的渠道/媒体/配置接口。
- 插件配置或 manifest 无法通过 AJV 校验会使插件进入 `error` 状态；`validatePluginConfig` 依赖 schema cacheKey，manifest 修改后若未更新 cacheKey 可能导致旧 schema，需确保 `manifest-registry` cache TTL 低（默认 200ms）以便发现变更。
- 可选工具/commands 仍需 allowlist：`tools.ts` 只在 optional tool hit 时检查 allowlist，否则插件命令或工具在未受限的 channel 上暴露；命令注册只能在 `/foo` 格式下检测但不会重写 core logic，需开发者/审核层面控制。
- `uninstallPlugin` 删除目录只针对非 linked 插件且使用安全路径判断；`resolveUninstallDirectoryTarget` 仍侧重默认目录以避免误删用户自定义路径，但配置错误可能让某些插件残留文件或反复 reinstall。

**与已研究模块关联**
- CLI 相关：`registerPluginCliCommands` 与 `src/cli`/`commands-registry` 共享命令表，`commands.ts` 输出的 `/help`/`/commands` 会直接走之前研究过的内置命令处理链。
- Gateway/Channels：注册的 `GatewayRequestHandler`、hooks（agent/message/tool/session/gateway）、`runtime.channel.*` 能直接调用 `src/gateway/server-methods`、`src/channels/*`、`src/auto-reply/*` 等已调研模块的工具和监控面板。
- Configuration：`loadConfig`/`normalizePluginsConfig`/`applyTestPluginDefaults` 依赖 `src/config/config.ts` 与 `src/config/types.plugins.ts`，与之前调查的 config 聚合逻辑保持一致；`recordPluginInstall`、`uninstallPlugin` 会修改 config JSON 并被 `src/config/config.ts` 读写。
- Agents/Tools：`tools.ts` 对 `AnyAgentTool` 与 `tool-policy`、`agents/tools/memory-tool.ts` 的依赖正好与之前研究的 agent tooling 和 memory 插件路径交叉，强调插件扩展是通过与现有工具集合共享 namespace 完成的。
- Providers/Pairing：`runtime.channel.pairing`/`provider` 类接口直接复用 `src/pairing`、`src/infra`、`src/agents` 等已有模块的配对、频道鉴权、系统事件与活动记录。
