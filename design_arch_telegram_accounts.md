# design_arch_telegram_accounts

研究日期：2026-02-16  
研究范围：

- `src/telegram/accounts.ts`
- `src/telegram/accounts.test.ts`

本批状态：已完成（2/2）

## 1. 模块职责定位

`src/telegram/accounts` 是 Telegram 多账号解析层，负责：

- 账号 ID 枚举（配置账号 + routing 绑定账号）
- 默认账号决策
- 单账号配置合并与 token 解析
- 可用账号列表过滤（enabled）

## 2. 文件级研究结论

## 2.1 `src/telegram/accounts.ts`

核心行为：

- `listTelegramAccountIds()`：合并配置账号与 routing 绑定账号，空集合回退 `default`，见 `src/telegram/accounts.ts:38`。
- `resolveDefaultTelegramAccountId()`：
  - 先看 `resolveDefaultAgentBoundAccountId(cfg, "telegram")`
  - 再看是否包含 `default`
  - 否则取排序后首个
  - 见 `src/telegram/accounts.ts:49`
- `resolveAccountConfig()`：支持“原键命中 + normalize 后匹配”来兼容非规范 key，见 `src/telegram/accounts.ts:61`。
- `mergeTelegramAccountConfig()`：把 channel 级配置与 account 级配置叠加，account 覆盖 base，见 `src/telegram/accounts.ts:78`。
- `resolveTelegramAccount()`：
  - 显式传 `accountId`：严格解析该账号，不做 fallback。
  - 未传 `accountId`：先尝试 `default`（或 normalize 后值）；若 tokenSource=`none`，再 fallback 到默认账号（通常是已绑定或首个配置账号）。
  - 见 `src/telegram/accounts.ts:85`。
- `listEnabledTelegramAccounts()`：仅返回 `enabled` 账号，见 `src/telegram/accounts.ts:135`。

关键依赖：

- routing 绑定：`listBoundAccountIds` / `resolveDefaultAgentBoundAccountId`
- token 解析：`resolveTelegramToken`（支持 config/tokenFile/env 优先级）

调用面（证据）：

- Telegram bot 启动：`src/telegram/bot.ts:120`
- Telegram 发送：`src/telegram/send.ts:289`
- onboarding：`src/channels/plugins/onboarding/telegram.ts:226`
- directory config：`src/channels/plugins/directory-config.ts:169`
- allowlist 命令：`src/auto-reply/reply/commands-allowlist.ts:369`

风险评估：`medium`

- 风险点 1：默认账号决策受 routing bindings 影响，配置变更可能改变默认 bot token 来源。
- 风险点 2：当未显式传 accountId 时的 fallback 逻辑较复杂，调用方若预期“只用 default”可能产生认知偏差。

## 2.2 `src/telegram/accounts.test.ts`

覆盖结论：

- 覆盖未传 accountId 的 fallback 行为。
- 覆盖 env token 与 config token 的优先关系。
- 覆盖显式 accountId 禁止 fallback 的行为。

定向执行结果：4/4 通过。

## 3. 行为摘要（高频决策）

- 场景 A：未传 accountId，`default` 无 token，但配置了 `work` 账号 token  
  结果：返回 `work`。
- 场景 B：未传 accountId，`TELEGRAM_BOT_TOKEN` 存在  
  结果：返回 `default` + `env`。
- 场景 C：未传 accountId，`channels.telegram.botToken` 存在  
  结果：返回 `default` + `config`（优先于 env）。
- 场景 D：显式 `accountId=default`，但 default 无 token  
  结果：不 fallback，`tokenSource=none`。

## 4. 本批完成文件

- `src/telegram/accounts.ts`
- `src/telegram/accounts.test.ts`

## 5. 验证

命令：`pnpm test:fast src/telegram/accounts.test.ts`  
结果：4/4 通过
