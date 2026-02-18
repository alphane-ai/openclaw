# Telegram Core Bot Pipeline 研究（2026-02-17，R2）

## 覆盖范围（34）
- `src/telegram/allowed-updates.ts`
- `src/telegram/api-logging.ts`
- `src/telegram/audit.test.ts`
- `src/telegram/audit.ts`
- `src/telegram/bot-access.ts`
- `src/telegram/bot-handlers.ts`
- `src/telegram/bot-message-context.audio-transcript.test.ts`
- `src/telegram/bot-message-context.dm-threads.test.ts`
- `src/telegram/bot-message-context.dm-topic-threadid.test.ts`
- `src/telegram/bot-message-context.sender-prefix.test.ts`
- `src/telegram/bot-message-context.ts`
- `src/telegram/bot-message-dispatch.test.ts`
- `src/telegram/bot-message-dispatch.ts`
- `src/telegram/bot-message.test.ts`
- `src/telegram/bot-message.ts`
- `src/telegram/bot-native-command-menu.test.ts`
- `src/telegram/bot-native-command-menu.ts`
- `src/telegram/bot-native-commands.plugin-auth.test.ts`
- `src/telegram/bot-native-commands.test.ts`
- `src/telegram/bot-native-commands.ts`
- `src/telegram/bot-updates.ts`
- `src/telegram/bot.create-telegram-bot.test-harness.ts`
- `src/telegram/bot.create-telegram-bot.test.ts`
- `src/telegram/bot.media.downloads-media-file-path-no-file-download.e2e.test.ts`
- `src/telegram/bot.media.e2e-harness.ts`
- `src/telegram/bot.media.includes-location-text-ctx-fields-pins.e2e.test.ts`
- `src/telegram/bot.test.ts`
- `src/telegram/bot.ts`
- `src/telegram/bot/delivery.resolve-media-retry.test.ts`
- `src/telegram/bot/delivery.test.ts`
- `src/telegram/bot/delivery.ts`
- `src/telegram/bot/helpers.test.ts`
- `src/telegram/bot/helpers.ts`
- `src/telegram/bot/types.ts`

## 核心结论
- 该组是 Telegram 主运行链路：update 接收 -> context 构建 -> message dispatch -> native commands -> delivery。
- `bot.ts` 是入口编排，注册 handlers/native commands、update offset、webhook、error logging。
- `bot-message-context.ts` 将 routing/session/channels 策略整合成单一消息上下文；`bot-message-dispatch.ts` 负责 draft/stream/reply 分发。
- `bot-native-commands.ts` 与 menu 逻辑共享 auth/route/session 语义，避免“命令路径”和“普通消息路径”分叉。
- `bot/delivery.ts` 管理文本/媒体/按钮/poll 等实际发送细节，并与 media/typing/ack-reactions 协同。

## 关键链路
1. update -> handlers -> message context -> dispatch -> deliverReplies -> Telegram API。
2. native command -> auth/group policy 检查 -> route/session -> 回复发送。
3. media/reaction/system event -> 统一回写 session 与系统事件流。

## 风险点
- groupPolicy/allowlist/mention 多重规则叠加，配置复杂时易出现“静默丢消息”。
- draft/stream 防抖与清理若异常会导致后续回复态错乱。
- reaction 与系统事件映射覆盖面有限，可能丢失部分遥测语义。
