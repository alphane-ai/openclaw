# Channels Plugins Core/Flow 研究（2026-02-17）

## 覆盖范围
本轮覆盖 `src/channels/plugins` 未研究文件（60 个）：

- `src/channels/plugins/actions/actions.test.ts`
- `src/channels/plugins/actions/discord.ts`
- `src/channels/plugins/actions/discord/handle-action.guild-admin.ts`
- `src/channels/plugins/actions/discord/handle-action.ts`
- `src/channels/plugins/actions/signal.ts`
- `src/channels/plugins/actions/telegram.ts`
- `src/channels/plugins/allowlist-match.ts`
- `src/channels/plugins/catalog.ts`
- `src/channels/plugins/channel-config.ts`
- `src/channels/plugins/config-helpers.ts`
- `src/channels/plugins/config-schema.ts`
- `src/channels/plugins/config-writes.ts`
- `src/channels/plugins/directory-config.ts`
- `src/channels/plugins/group-mentions.ts`
- `src/channels/plugins/helpers.ts`
- `src/channels/plugins/index.ts`
- `src/channels/plugins/load.ts`
- `src/channels/plugins/media-limits.ts`
- `src/channels/plugins/message-action-names.ts`
- `src/channels/plugins/message-actions.ts`
- `src/channels/plugins/normalize/discord.ts`
- `src/channels/plugins/normalize/imessage.ts`
- `src/channels/plugins/normalize/signal.ts`
- `src/channels/plugins/normalize/slack.ts`
- `src/channels/plugins/normalize/telegram.ts`
- `src/channels/plugins/normalize/whatsapp.ts`
- `src/channels/plugins/setup-helpers.ts`
- `src/channels/plugins/slack.actions.ts`
- `src/channels/plugins/types.adapters.ts`
- `src/channels/plugins/types.core.ts`
- `src/channels/plugins/types.plugin.ts`
- `src/channels/plugins/types.ts`
- `src/channels/plugins/agent-tools/whatsapp-login.ts`
- `src/channels/plugins/bluebubbles-actions.ts`
- `src/channels/plugins/onboarding-types.ts`
- `src/channels/plugins/onboarding/channel-access.ts`
- `src/channels/plugins/onboarding/discord.ts`
- `src/channels/plugins/onboarding/helpers.ts`
- `src/channels/plugins/onboarding/imessage.ts`
- `src/channels/plugins/onboarding/signal.ts`
- `src/channels/plugins/onboarding/slack.ts`
- `src/channels/plugins/onboarding/telegram.ts`
- `src/channels/plugins/onboarding/whatsapp.ts`
- `src/channels/plugins/outbound/discord.ts`
- `src/channels/plugins/outbound/imessage.ts`
- `src/channels/plugins/outbound/load.ts`
- `src/channels/plugins/outbound/signal.ts`
- `src/channels/plugins/outbound/slack.test.ts`
- `src/channels/plugins/outbound/slack.ts`
- `src/channels/plugins/outbound/telegram.ts`
- `src/channels/plugins/outbound/whatsapp.ts`
- `src/channels/plugins/plugins-channel.test.ts`
- `src/channels/plugins/plugins-core.test.ts`
- `src/channels/plugins/status-issues/bluebubbles.ts`
- `src/channels/plugins/status-issues/discord.ts`
- `src/channels/plugins/status-issues/shared.ts`
- `src/channels/plugins/status-issues/telegram.ts`
- `src/channels/plugins/status-issues/whatsapp.ts`
- `src/channels/plugins/status.ts`
- `src/channels/plugins/whatsapp-heartbeat.ts`

## 关键结论
- plugins 层分为四块：`actions`（消息动作）、`onboarding`（接入引导）、`outbound`（发送适配）、`status`（状态诊断）。
- `types.*` / `index.ts` / `load.ts` / `catalog.ts` 构成插件抽象与发现装配层：定义能力接口、加载策略、目录展示与元信息排序。
- `normalize/*`、`directory-config.ts`、`group-mentions.ts` 是跨通道输入归一化与策略治理层，统一处理目标格式、mention 规则、allowlist 解析。
- `message-actions.ts` + 各 provider action adapter（Discord/Telegram/Signal/Slack）形成动作分发总线，配合 gating 控制可执行动作。
- `onboarding/*` 将每个通道接入流程标准化为 `getStatus/configure`，并覆盖 token/env/allowlist/dm-policy/账户级配置。
- `outbound/*` 统一对外发送接口并保留 provider 特性（例如 Slack hook、Telegram payload、WhatsApp target 解析）。
- `status.ts` 与 `status-issues/*` 将探活/审计快照转成可诊断问题列表（权限、账号、连通性、隐私模式等）。

## 关键调用链
1. plugin 注册/发现 -> `catalog` + `load` + `index` -> 暴露 channel 能力。
2. onboarding 启动 -> `getStatus/configure` -> 持久化 channel 账户配置 -> status 快照验证。
3. inbound/outbound 目标处理 -> `normalize/*` + `directory-config` + `allowlist` -> adapter send。
4. message action 请求 -> `message-actions` -> provider `handleAction` -> agent tools/provider API。
5. status 汇总 -> `buildChannelAccountSnapshot` -> `status-issues/*` -> CLI/UI 告警呈现。

## 风险与关注点
- 动作 gating 与通道配置耦合高，配置默认值偏差会导致动作被意外开放或意外阻断。
- 多通道目标归一化规则演进成本高，需要与各 provider parser 同步维护，防止解析漂移。
- onboarding 成功不等于 runtime 可用，若 status/probe 元数据不足会出现“已配置但不可用”盲区。
- WhatsApp/Signal 等登录与依赖安装流程存在外部环境不确定性，需要更强失败可观测与回滚提示。

## 与已研究模块关系
- 与已研究 `routing`：allowlist、session key、target 归一化共同决定消息分流与发送目标。
- 与已研究 `gateway hooks/http/plugins`：本层产出的 plugin methods/status 会被 gateway RPC 与 CLI status 直接消费。
