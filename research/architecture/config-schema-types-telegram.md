# Config Schema/Types 与 Telegram 约束研究（2026-02-17，R3）

## 覆盖范围（70）
- `src/config/channel-capabilities.test.ts`
- `src/config/channel-capabilities.ts`
- `src/config/config.agent-concurrency-defaults.test.ts`
- `src/config/config.backup-rotation.test.ts`
- `src/config/config.compaction-settings.test.ts`
- `src/config/config.discord-presence.test.ts`
- `src/config/config.discord.test.ts`
- `src/config/config.dm-policy-alias.test.ts`
- `src/config/config.env-vars.test.ts`
- `src/config/config.hooks-module-paths.test.ts`
- `src/config/config.identity-avatar.test.ts`
- `src/config/config.identity-defaults.test.ts`
- `src/config/config.irc.test.ts`
- `src/config/config.legacy-config-detection.accepts-imessage-dmpolicy.e2e.test.ts`
- `src/config/config.legacy-config-detection.rejects-routing-allowfrom.e2e.test.ts`
- `src/config/config.msteams.test.ts`
- `src/config/config.schema-regressions.test.ts`
- `src/config/schema.help.ts`
- `src/config/schema.hints.test.ts`
- `src/config/schema.hints.ts`
- `src/config/schema.irc.ts`
- `src/config/schema.labels.ts`
- `src/config/schema.test.ts`
- `src/config/schema.ts`
- `src/config/types.agent-defaults.ts`
- `src/config/types.agents.ts`
- `src/config/types.approvals.ts`
- `src/config/types.auth.ts`
- `src/config/types.base.ts`
- `src/config/types.browser.ts`
- `src/config/types.channels.ts`
- `src/config/types.cron.ts`
- `src/config/types.discord.ts`
- `src/config/types.gateway.ts`
- `src/config/types.googlechat.ts`
- `src/config/types.hooks.ts`
- `src/config/types.imessage.ts`
- `src/config/types.irc.ts`
- `src/config/types.memory.ts`
- `src/config/types.messages.ts`
- `src/config/types.models.ts`
- `src/config/types.msteams.ts`
- `src/config/types.node-host.ts`
- `src/config/types.openclaw.ts`
- `src/config/types.plugins.ts`
- `src/config/types.queue.ts`
- `src/config/types.sandbox.ts`
- `src/config/types.signal.ts`
- `src/config/types.skills.ts`
- `src/config/types.slack.ts`
- `src/config/types.telegram.ts`
- `src/config/types.tools.ts`
- `src/config/types.ts`
- `src/config/types.tts.ts`
- `src/config/types.whatsapp.ts`
- `src/config/zod-schema.agent-defaults.ts`
- `src/config/zod-schema.agent-model.ts`
- `src/config/zod-schema.agent-runtime.ts`
- `src/config/zod-schema.agents.ts`
- `src/config/zod-schema.allowdeny.ts`
- `src/config/zod-schema.approvals.ts`
- `src/config/zod-schema.channels.ts`
- `src/config/zod-schema.core.ts`
- `src/config/zod-schema.hooks.ts`
- `src/config/zod-schema.providers-core.ts`
- `src/config/zod-schema.providers-whatsapp.ts`
- `src/config/zod-schema.providers.ts`
- `src/config/zod-schema.sensitive.ts`
- `src/config/zod-schema.session.ts`
- `src/config/zod-schema.ts`

## 核心结论
- 该组文件定义配置类型系统与验证骨架：`types.*`、`zod-schema.*`、`schema.ts`、`validation.ts` 构成统一契约层。
- `OpenClawSchema` 聚合 gateway/channels/agents/plugins；`schema.ts` 再将其转为 UI schema/hints，并注入 channel/plugin 元数据。
- Telegram 相关约束由 providers-core/schema 与 `types.telegram.ts` 共同定义：account/token/webhook/dmPolicy/groupPolicy/customCommands 等。
- runtime 侧 `telegram/accounts.ts`、`telegram/token.ts`、`telegram/monitor.ts` 与 config schema 强耦合，保证“配置可验证”与“运行可启动”一致。

## 关键调用链
1. `validation.ts` -> `OpenClawSchema.safeParse` -> 输出标准错误/告警。
2. `schema.ts` -> `toJSONSchema` + plugin/channel schema 合并 -> 控制面渲染 hints 与敏感字段处理。
3. `monitorTelegramProvider` -> `loadConfig` -> `resolveTelegramAccount/token` -> `createTelegramBot` -> webhook 或 polling。
4. `plugins/runtime/index.ts` -> 注册 channel/provider runtime -> gateway 层统一调度。

## 风险点
- telegram `dmPolicy/open` 与 allowFrom、webhookSecret 等组合约束复杂，配置易错导致启动失败。
- schema 与 runtime 解析逻辑若不同步，会出现“通过校验但运行异常”或反向问题。
- UI schema 对 channels 内部字段呈现有限，运维可能误判可配置范围。
- token 来源优先级（tokenFile/config/env）复杂，环境切换时易引入隐蔽故障。
