**覆盖确认**
- 覆盖文件数：74（根据 `/tmp/research_round4/chunk_02_commands.txt` 列出的所有命令相关文件，含命令实现、辅助模块、测试/集成用例）
- 涵盖范围：`configure.*` 系列配置助手、守护进程安装/运行工具、仪表盘/文档/健康/消息/模型命令及相关测试、`doctor.*` 多项检查和迁移逻辑、`gateway-status` 监控模块、`message-format` 输出润色、`models/*` 权限/允许/默认模型操作等

**模块要点**
- `configure.*`：向导以 `runConfigureWizard` 为中心，通过 `CONFIGURE_WIZARD_SECTIONS` 提供可选步骤（workspace、model、gateway、web、channels、skills、daemon、health）；`promptConfigureSection`、`promptGatewayConfig`、`promptAuthConfig` 等将用户交互封装，`maybeInstallDaemon`/`daemon-install-helpers` 负责服务安装/重启、计划构造与环境注入；共享提示风格保存在 `configure.shared.ts`、e2e 覆盖 token/password/trusted-proxy 路径。 Wizard 支持指定子集（`sections`）及默认流程，并在完成后写入配置、提示 Control UI 地址。
- `doctor.*`：Doctor CLI 组合多项子检查（完成、安装、配置流、state integrity/migrations、安全/平台笔记、UI/地图、内存搜索、工作区状态等），其中 `doctor.e2e-harness.ts` 提供大量 mock 依赖；各模块分别负责不同角度：`doctor-config-flow` 维护配置修复并判断同步迁移/allowFrom 转换，`doctor-state-*` 负责状态目录/遗留文件/迁移，`doctor-security` 检测网关绑定与频道安全策略，`doctor-sandbox` 验证 sandbox 镜像与覆盖警告，`doctor-update` 在 git 环境下可提供更新提示。
- `gateway-status`：将本地、远程、SSH 隧道目标纳入统一探测，支持 JSON/Rich 输出，集成 SSH 配置解析、Bonjour 发现、Wide-Area DNS、Tailnet/IP，以 `resolveTargets`、`probeGateway`、`renderTargetHeader` 等构建状态表并对多网关/隧道失败提供告警。
- `health`/`health-format`：`healthCommand` 通过 `callGateway` 获取通道状态，支持 JSON 和富文本格式，包含 channel 列表、session 汇总、代理心跳；失败时输出可选 rich 细节。另有 `health.snapshot` 测试覆盖 Telegram/Discord/WhatsApp 针对 Probe 逻辑。
- `message*`：`messageCommand` 根据 `CHANNEL_MESSAGE_ACTION_NAMES` 派发 `runMessageAction`，`message-format` 提供针对发送、广播、反应、读/搜索等情景的格式化输出；`message.e2e.test.ts` 通过自定义插件集测试 channel 选择、错误路径与 gateway/agent action 的集成。
- `models/*`：提供多面向模型控制：`model-picker` 负责默认模型选择与多选 allowlist（支持 vLLM、手动输入）、`model-allowlist`/`model-default`/`google-gemini-model-default` 处理配置更新，`models/auth*` 完成 auth profile 管理、login 接入统一 provider 插件；相关测试说明避免 router 模型、确保 allowlist/ fallback 转换正确。

**关键调用链**
1. 配置向导链路：`configureCommand` → `runConfigureWizard` → `promptGatewayConfig`/`promptAuthConfig`/`promptWebToolsConfig`/`setupChannels`/`setupSkills` → `writeConfigFile` → `ensureControlUiAssetsBuilt` + `note` 输出 Control UI & Health。若选择 daemon 与 health 节点，会调用 `maybeInstallDaemon`、`runGatewayHealthCheck` 与 `healthCommand`。
2. Doctor 综合巡检：`doctorCommand`（从测试可见）会读取配置快照（`readConfigFileSnapshot`），自动迁移旧配置/状态（`runLegacyStateMigrations`、`autoMigrateLegacyState`）、弹出 `doctor-prompter`，再分别执行每个 `note*` 模块（state integrity、platform notes、sandbox、security、workspace status、memory search、UI 检查等），必要时调用 `runGatewayUpdate`。（`doctor.e2e` 系列展示 yes/non-interactive/repair 逻辑）
3. 模型/认证：`modelsAuthLoginCommand` 先通过插件注册列表挑选 provider/method，调用 `ProviderAuthResult` 返回配置补丁后写入 `auth-profiles.json`、`openclaw.json`；`promptDefaultModel` 依赖 `loadModelCatalog`、`buildModelAliasIndex`、`buildAllowedModelSet`，结果流向 `applyPrimaryModel`/`applyModelAllowlist`，辅助测试保证 router 模型屏蔽与 vLLM 交互。
4. 网关状态与消息执行：`gatewayStatusCommand` 用 `resolveTargets` + `probeGateway` 决定可达目标，结合 SSH、discovery、JSON 输出；`messageCommand` 构建 `OutboundSendDeps` 调用 `runMessageAction`，结果由 `formatMessageCliText`/`buildMessageCliJson` 输出到 CLI，`message.e2e` 通过模拟 callGateway 和 plugin 实现覆盖。

**风险**
- 配置向导链路对用户取消/输入逻辑高度敏感（大量 `guardCancel` pts），需谨慎测试多场景；`promptGatewayConfig` 在 trusted-proxy/tailscale 组合中会自动调整 bind/auth 模式，可能在非交互上下游渠道造成意外配置。 
- Doctor 各模块在非交互/yes 模式下跳过确认但仍会改写配置（state 状态修复、auth profile 重命名），需确认 bak+undo 动作，以及多个 Doctor e2e 中对文件操作的 mock（⚠ 真实环境 path/权限命令未模拟）。
- Sandbox 与 daemon 安装依赖外部环境（Docker、systemd、launchctl），error paths 仅笔记提示，理想状态下需回退提示或文档链接以免用户误操作。

**与已研究模块关联**
- 与之前研究的 `src/onboard` 系统共享控制逻辑：`onboard-helpers`/`onboard-skills` 被 `configure.*` 重用，`noteChannelStatus`/`setupChannels` 与 earlier onboarding guide 保持一致。  
- Doctor/health 命令依赖 `gateway` 状态与 `channels/plugins`，保持与 `src/gateway`、`src/channels` 模块的一致性，在先前阅读的 channel plugins 命令中也体现类似的 `resolveAccount/isConfigured` 呼叫。  
- `models/auth`/`model-picker` 与 `agents/model-auth`/`plugins/providers` 共享 auth profile 机制，与前期探索的 agent workspace defaults、skills statuses 等仍然使用同一 config 写入/变更链路。
