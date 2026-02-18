# Channels Core Gating/Registry 研究（2026-02-17，R2）

## 覆盖范围（29）
- `src/channels/account-summary.ts`
- `src/channels/ack-reactions.test.ts`
- `src/channels/ack-reactions.ts`
- `src/channels/allowlist-match.ts`
- `src/channels/allowlists/resolve-utils.test.ts`
- `src/channels/allowlists/resolve-utils.ts`
- `src/channels/channel-config.test.ts`
- `src/channels/channel-config.ts`
- `src/channels/channel-helpers.test.ts`
- `src/channels/channels-misc.test.ts`
- `src/channels/chat-type.ts`
- `src/channels/command-gating.test.ts`
- `src/channels/command-gating.ts`
- `src/channels/conversation-label.ts`
- `src/channels/dock.ts`
- `src/channels/location.test.ts`
- `src/channels/location.ts`
- `src/channels/logging.ts`
- `src/channels/mention-gating.test.ts`
- `src/channels/mention-gating.ts`
- `src/channels/registry.ts`
- `src/channels/reply-prefix.ts`
- `src/channels/sender-identity.ts`
- `src/channels/sender-label.ts`
- `src/channels/session.ts`
- `src/channels/targets.ts`
- `src/channels/telegram/allow-from.ts`
- `src/channels/typing.ts`
- `src/channels/web/index.ts`

## 核心结论
- `src/channels/*` 是 plugins 之前的共用治理层：allowlist 解析、命令/mention gating、channel config 匹配、session 元信息落库、目标与展示格式化。
- `channel-config.ts` + `allowlist*` 负责层级匹配与 ID 规范化，给各通道插件提供一致输入。
- `command-gating.ts` 与 `mention-gating.ts` 把访问策略前置，确保无论插件实现如何，核心命令准入逻辑一致。
- `registry.ts` 通过 active plugin registry 做能力枚举，让 core 与插件系统解耦。

## 关键链路
1. inbound 元信息 -> session/channel helper -> 形成标准上下文。
2. allowlist 与 config 匹配 -> 命令/mention gating -> 允许才交给插件执行。
3. registry 枚举 plugin channel -> 上层 status/onboarding/outbound 使用。

## 风险点
- gating 规则与配置默认值耦合高，偏差会导致误拦截或误放行。
- ID 归一化规则需要与 provider parser 同步演进，否则会出现“配置存在但匹配不到”。
- core 与 plugins 若版本错位，可能出现 capability 列表与实际行为不一致。
