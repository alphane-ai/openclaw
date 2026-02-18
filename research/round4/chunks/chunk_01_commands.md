1. 覆盖确认（写明文件数）
- 全部 73 个路径（列表来源 `/tmp/research_round4/chunk_01_commands.txt`）已按顺序读取并分析，内容涉及 `src/commands` 目录下的 CLI 入口、辅助模块以及对应的测试文件；生成的 `/tmp/research_round4/chunk_01_commands-summary.json` 记录了每个文件的导入/导出结构，证明已逐一覆盖。

2. 模块要点
- Agent 运行命令（`src/commands/agent.ts` 及其子模块 `agent/delivery.ts`、`agent/run-context.ts`、`agent/session-store.ts`、`agent/session.ts`、`agent/types.ts`）负责读取配置、解析会话、构建技能快照，并调用 `runCliAgent`/`runEmbeddedPiAgent`；`agent-via-gateway.ts` 追加了 gateway 方式的入口并复用 `gateway/call.js`；相关集成验证见 `agent*.e2e.test.ts`、`agent.delivery.e2e.test.ts`、`agent.session.test.ts`。
- 代理管理（`agents.commands.add/delete/identity/list.ts`、`agents.config.ts`、`agents.bindings.ts`、`agents.providers.ts`、`agents.command-shared.ts`、`agents.ts`）提供 CRUD/绑定/配置摘要、输出格式、输入校验等。`agents.commands.add.ts` 通过互动式 `wizard/prompts.ts`、`auth-choice`、`onboard-channels.ts` 与 `setupChannels` 结合来更新配置和绑定；`agents.identity.e2e.test.ts`、`agents.add.e2e.test.ts`、`agents.e2e.test.ts` 负责端到端和身份逻辑。
- 授权选择（`auth-choice.*`）包括 `auth-choice.ts` 的总入口、`auth-choice-options.ts`/`auth-choice-prompt.ts` 提供 CLI 选项、`auth-choice.default-model.ts` 与 `auth-choice.model-check.ts` 校验，最大规模的 `auth-choice.apply.ts` 按顺序调度包含 `anthropic`、`vllm`、`openai`、`oauth`、`api-providers`、`MiniMax`、`GitHub Copilot`、`Google Antigravity/Gemini`、`Copilot Proxy`、`Qwen Portal`、`XAI` 的专用适配器，以及 `auth-choice.apply.huggingface.ts`、`.test.ts`、`.minimax.ts` 等子模块。相关测试有 `auth-choice.e2e.test.ts`、`auth-choice-options.e2e.test.ts`、`auth-choice.moonshot.e2e.test.ts` 和 `auth-choice.apply.huggingface.test.ts`。
- 通道命令（`channels.ts`、`channels/add.ts`、`channels/add-mutators.ts`、`channels/capabilities.ts`、`channels/list.ts`、`channels/logs.ts`、`channels/remove.ts`、`channels/resolve.ts`、`channels/shared.ts`、`channels/status.ts`、`channels/capabilities.e2e.test.ts` 以及 `channels.*` 关联测试）依赖 `channels/plugins` 插件体系，涵盖添加/移除通道、能力检查、状态输出（包括 `formatGatewayChannelsStatusLines`、`collectChannelStatusIssues`、`callGateway`、`formatDocsLink`）、日志追踪与查找、与 `infra/provider-usage` 报告共享跳线。补充验证通过 `channels.adds-non-default-telegram-account.e2e.test.ts`、`channels.surfaces-signal-runtime-errors-channels-status-output.e2e.test.ts`。
- 其他命令：`chutes-oauth.ts`/`.e2e.test.ts` 处理 PI 登录（依赖 `@mariozechner/pi-ai`、`agents/chutes-oauth.js`、`gateway/net.js`），`cleanup-plan.ts`、`cleanup-utils.ts`（及其测试）负责工作区目录扫描、意向清理与 `removePath` 操作，`configure.commands.ts` 与 `configure.channels.ts` 配合 `configure.shared.ts` 提供通用配置/通道向导。

3. 关键调用链
- Agent CLI 流程：`agentCommand` → `resolveSession`/`resolveAgentIdFromSessionKey` → `registerAgentRunContext`/`buildWorkspaceSkillSnapshot` → `runAgentAttempt`（根据 `isCliProvider` 选择 `runCliAgent` 或 `runEmbeddedPiAgent`）→ `deliverAgentCommandResult` → `infra/outbound/`（`deliver.js`/`envelope.js`）→ `utils/message-channel`。会话更新通过 `persistSessionEntry` 与 `agent/session-store.ts` 写入配置存储。
- 代理添加链：`agentsAddCommand` → `promptAuthChoiceGrouped` → `applyAuthChoice`（调度 `auth-choice.apply.*` 各种提供商）→ `applyAgentConfig`/`applyAgentBindings` → `setupChannels`（channel selection + `buildChannelBindings`）→ `writeConfigFile`/`ensureWorkspaceAndSessions`。阻塞逻辑由 `agents.command-shared.ts` 的 `requireValidConfig`/`createQuietRuntime` 保障。
- 通道状态链：`channelsStatusCommand`（`channels/status.ts`）→ `requireValidConfig` → `callGateway` + `buildChannelAccountSnapshot` → `formatGatewayChannelsStatusLines` → `collectChannelStatusIssues` → `terminal/theme` 输出 → `formatDocsLink`（推荐 `docs.openclaw.ai/cli#status`）。探针模式通过 `--probe` 触发 `gateway/call` 深度探测。

4. 风险
- `agentCommand` 在 `sessionStore` 写入前后没有锁定，上游多台 CLI 并发写相同 `sessionKey` 值会覆盖 `skillsSnapshot`/`thinkingLevel`（即 `persistSessionEntry`、`updateSessionStore` 仅以 `sessionKey` 作为唯一键）。
- `auth-choice.apply.api-providers.ts` 与 `auth-choice.apply.plugin-provider.ts` 直接处理 OAuth 授权码和 API keys（`oauth-env.js`、`oauth-flow.js`、`onboard-auth.js`），但配置更新和 `auth-choice.apply-helpers.ts` 仅靠 CLI 提示，不会强制进行额外校验或过期检测，容易留下过期 token 或误导 `applyAgentConfig`。
- 通道绑定通过 `agents.bindings.ts` 的 `bindingMatchKey` 儆示阻止错位，但 `channels/add.ts` 在 `setupChannels` 选择时仍允许多通道/帐号同时选择，若用户未主动分配 `accountId`（尤其 `meta.forceAccountBinding` 的平台）会产生默认 `accountId` 并在 `applyAgentBindings` 中静默覆盖，可能导致与其它 agent 的冲突或死绑定。
- `cleanup-utils.ts` 中的 `removePath` 直接调用 `fs.rm`，运行 `cleanup-plan` 时若 `workspace` 路径解析或 `listAgentSessionDirs` 产生的路径不在授权范围，会误删非 OpenClaw 目录；缺乏更进一步的路径归属验证。

5. 与已研究模块关联
- Agent 命令层直接复用此前研究过的 `src/agents/*`（如 `agent-scope.js`、`workspace.js`、`skills.js`、`model-selection.js`、`timeout.js`）以及 `src/sessions/*` 的会话逻辑，延伸了上次对 `agents` 模块的理解。
- 代理管理与绑定使用的 `channels/plugins` 类型/帮助函数、`routing/session-key`、`config/config`、`wizard/prompts` 等均在前期研究其他 `src/cli` 或 `channels` 模块时出现，保持一致性的同时增加了对 `bindings` 冲突判定的依赖面。
- 授权选择、`auth-choice.apply.*` 中调用的 `infra`/`plugin`（`plugins/providers`、`infra/skills-remote`、`onboard-auth`）补充了之前对基础设施助手的调研，在调用链上承接 `agents` 与 `config` 的配置验证。
- 通道状态/列表/能力统计命令直接对齐 `channels/plugins` 再加 `infra/provider-usage`、`gateway/call`，与此前对 `src/channels` 与 `infra` 的研究形成闭环。
