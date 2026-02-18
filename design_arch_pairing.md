# design_arch_pairing

研究日期：2026-02-16  
研究范围：`src/pairing/*`  
本批状态：已完成（5/5）

## 1. 模块职责定位

`src/pairing` 负责 DM 安全接入中的“待授权请求 + allowFrom 持久化 + 用户提示文案”。

核心职责：

- 生成并维护待审批 pairing 请求（code、TTL、上限、并发安全）。
- 审批 code 后把 sender 写入 allowFrom 存储（支持账号作用域）。
- 生成统一 pairing 提示文案，指导 owner 用 CLI 审批。
- 提供 channel 专属 id 标签（通过 channel pairing adapter）。

## 2. 文件级研究结论

## 2.1 `src/pairing/pairing-store.ts`

职责：pairing/allowFrom 文件存储与并发更新核心。

核心实现点：

- 文件位置：基于 `resolveStateDir` + `resolveOAuthDir` 解析凭据目录，见 `src/pairing/pairing-store.ts:47`。
- 安全键名：channel/account 都会做文件名净化（防路径穿越），见 `src/pairing/pairing-store.ts:52`、`src/pairing/pairing-store.ts:69`。
- 锁机制：每次读改写走 `withFileLock`（10 次重试 + stale 30s），见 `src/pairing/pairing-store.ts:16`、`src/pairing/pairing-store.ts:136`。
- pairing code：8 位人类可读字符集（去掉易混淆字符），并做冲突重试，见 `src/pairing/pairing-store.ts:12`、`src/pairing/pairing-store.ts:191`、`src/pairing/pairing-store.ts:201`。
- 生命周期控制：
  - TTL 1 小时，过期即清理，见 `src/pairing/pairing-store.ts:14`、`src/pairing/pairing-store.ts:158`。
  - 最大 pending 3 条，超限拒绝新建（返回 `created:false`），见 `src/pairing/pairing-store.ts:15`、`src/pairing/pairing-store.ts:502`。
- 账号作用域：`allowFrom` 支持 channel 级与 account 级文件；读取 account 级时会兼容合并 legacy channel 级文件，见 `src/pairing/pairing-store.ts:314`。
- 审批流：`approveChannelPairingCode` 命中 code 后移除 pending，并把 id 加入 allowFrom，见 `src/pairing/pairing-store.ts:528`。

对外 API：

- `readChannelAllowFromStore`、`addChannelAllowFromStoreEntry`、`removeChannelAllowFromStoreEntry`
- `listChannelPairingRequests`、`upsertChannelPairingRequest`、`approveChannelPairingCode`

主要调用方（证据）：

- Telegram：`src/telegram/bot-message-context.ts:291`
- Slack：`src/slack/monitor/message-handler/prepare.ts:150`
- Signal：`src/signal/monitor/event-handler.ts:453`
- iMessage：`src/imessage/monitor/monitor-provider.ts:252`
- Discord：`src/discord/monitor/agent-components.ts:443`
- Web inbound：`src/web/inbound/access-control.ts:152`
- CLI pairing：`src/cli/pairing-cli.ts:80`

风险评估：`medium`

- 风险点 1：pending 上限固定 3，极端高并发未知联系人场景会出现“拒绝新建 code”。
- 风险点 2：通过 JSON 文件 + 文件锁实现，跨进程一致性依赖锁正确工作；异常恢复主要靠兜底解析与原子 rename。

## 2.2 `src/pairing/pairing-messages.ts`

职责：生成统一 pairing 回复文案。

关键行为：

- 输出固定模板，包含：未配置提示、id 行、pairing code、审批 CLI 命令，见 `src/pairing/pairing-messages.ts:4`。
- 审批命令由 `formatCliCommand` 生成，自动继承 profile 等 CLI 上下文。

调用方覆盖：Discord/Slack/Signal/Telegram/iMessage/Line/Web 都复用该消息模板。

风险评估：`low`

- 文案模板集中，统一性好；主要风险是 future CLI 命令参数变化导致文案过期。

## 2.3 `src/pairing/pairing-labels.ts`

职责：解析通道对应的 id 标签（默认 `userId`）。

关键行为：

- 从 channel pairing adapter 读取 `idLabel`，没有则 fallback 到 `userId`，见 `src/pairing/pairing-labels.ts:4`。

调用方：

- CLI：`src/cli/pairing-cli.ts:90`
- Line：`src/line/bot-handlers.ts:74`

风险评估：`low`

- 风险主要来自 adapter 未配置或标签不准确，功能降级可接受（仍有默认值）。

## 2.4 测试文件结论

- `src/pairing/pairing-store.test.ts`
  - 覆盖：重复 upsert 复用 code、TTL 过期、code 冲突重试、pending 上限、account 作用域、legacy 兼容读取。
- `src/pairing/pairing-messages.test.ts`
  - 覆盖：多 channel 文案格式与 CLI 命令包含 profile。

本次定向测试：13/13 通过。  
命令：`pnpm test:fast src/pairing/pairing-store.test.ts src/pairing/pairing-messages.test.ts`

## 3. 边界与依赖

上游依赖：

- `channels/plugins/pairing`：adapter 获取、能力声明
- `config/paths`：state/oauth 目录
- `infra/file-lock`：文件锁

下游影响：

- DM 入站安全策略（pairing/allowlist）
- CLI pairing 审批流程
- 安全审计与修复命令（读取 store）

## 4. 本批完成文件

- `src/pairing/pairing-labels.ts`
- `src/pairing/pairing-messages.ts`
- `src/pairing/pairing-store.ts`
- `src/pairing/pairing-messages.test.ts`
- `src/pairing/pairing-store.test.ts`

## 5. 下一批建议

建议继续研究 `src/channels/plugins/pairing.ts` + `src/cli/pairing-cli.ts`，这样可以把“存储层 -> CLI 操作层 -> 通道 adapter 层”闭环补齐。
