1) 覆盖确认（写明文件数）
- 全部覆盖：共 73 个文件，涵盖模型命令、节点守护进程、OAuth、onboarding/配置/插件/技能、sandbox 相关命令等。

2) 模块要点
- `src/commands/models/*`: 模型列表(`list.registry`, `list.status-command`, `list.table`)负责加载 model registry、availability、auth 概览和丰富输出；`list.types` 定义视图结构；`scan/set` 命令通过 OpenRouter 探测、选择、写入 `agents.defaults` 来更新回退/图像模型；`shared` 提供配置更新、别名/allowlist、默认/回退模型处理逻辑。
- 节点守护(`node-daemon-*`)仅封装守护运行时/安装计划与 runtime 抽象，供 `daemon-install-helpers` 调用以准备服务参数、环境与 warning。
- OAuth/OOB(`oauth-env`, `oauth-flow`)判断远程环境并提供 VPS 友好提示（复制 URL、提示手动输入），`openai-codex-oauth` 利用 pi-ai 登录并处理错误展示。
- Onboarding auth helpers (`onboard-auth.*`)：凭证写入（`onboard-auth.credentials`）、模型/provider 注册与默认模型设置（`config-core/minimax/opencode/litellm/etc.`）、共享 helper（`config-shared`）连接 config updates。此外 `onboard-auth.e2e.test`覆盖关键路径。
- Onboarding commands/tests：`onboard-channels` 处理 channel 状态、prompt、插件安装；`onboard-config` 保证 workspace/local gateway；`onboard-custom` 和 tests 管理自定义 provider 的探测、重试、唯一 ID、alias；`onboard-helpers` 提供启动 metadata、浏览器/控制 UI 支持、网关探测、工作区/会话保障；`onboard-hooks` 与 tests 处理内置 hook 选择；`onboard-interactive` 运行 wizard 并恢复终端；`onboard-non-interactive` 走 local/remote 分支并通过 helper 子模块处理 workspace、auth choices（大批 authChoice 逻辑：Anthropic/OpenAI/Minimax/Zai/Xai/etc.）、gateway、daemon install、技能、输出；`onboard-provider-auth-flags` 提供 CLI flag 列表；`onboard-remote` 通过 Bonjour/手动 URL 探测远程网关；`onboard-skills`/tests 负责技能依赖展示、Homebrew 提示、install 及 API key entry；`onboarding/plugin-install`/`registry` 管理插件安装与适配器。
- `openai-model-default`, `openai-codex-model-default`, `opencode-zen-model-default` 和相关 tests 控制默认模型选择逻辑。

3) 关键调用链
- `modelsStatusCommand` → config/auth/load → `list.auth-overview` → `runAuthProbes`（可选）→ 渲染 JSON/plain/rich。 `modelsScanCommand`→`scanOpenRouterModels`→多阶段排序、用户 multiselect、`updateConfig` 写 fallbacks+image defaults。 `modelsSet{Image}` → `applyDefaultModelPrimaryUpdate`。
- Onboarding：`runInteractiveOnboarding` → `runOnboardingWizard`→多个模块（channel setup、hooks、skills、custom auth 等）依赖 `onboard-helpers`、`onboarding/plugin-install`、`onboard-auth` 共享 helper。 `runNonInteractiveOnboardingLocal`→ workspace + auth + gateway/success + daemon install + health check。 `applyNonInteractiveAuthChoice` 包含多个 authChoice 分支（Anthropic token、MiniMax、OpenAI/OpenRouter/custom 等）→写入 `auth` profiles + provider+model defaults →返回 config。

4) 风险
- 模型列表依赖 pi-ai registry 的可用性信息；若 discovery `getAvailable` 抛出错误，会 fallback 到 heuristics。需关注 `MODEL_AVAILABILITY_UNAVAILABLE_CODE` 传播到 CLI 输出。
- 非交互式 auth 逻辑庞大、多个 provider/风控分支（env/profile/flags、custom compatibility），变更任一处需同步 tests（`onboard-non-interactive.provider-auth.e2e.test.ts` 覆盖各分支）。
- 自定义 API 维护唯一 `providerId`、alias 防碰撞，需确保 `resolveUniqueEndpointId` 和 `applyCustomApiConfig` 一致；非交互式 retry/error 消息需保持友好且不漏 `runtime.exit`。
- Onboarding 插件/技能/daemon 安装涉及外部命令（npm、brew、systemd），失败需降级提示且不破坏 config（`plugin-install` 与 `setupSkills` 都有备选逻辑）。

5) 与已研究模块关联
- 模型/Onboarding 共享 config 辅助（`config/*`、`agents/*`）与 previously reviewed agent/auth infrastructure（如 `agents/auth-profiles.js`、`agents/model-selection.js`）。
- `onboard-helpers` 的 gateway 探测与 `gateway/**` 模块联动（`callGateway`、control UI 链接，之前章节已关注）。
- 几个命令引用 `wizard`、`cli/command-format`、`terminal` 组件，保持一致的用户提示风格也与其他 CLI 逻辑一致。
