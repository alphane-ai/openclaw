# Infra Outbound/Pairing Delivery 研究（2026-02-17，R3）

## 覆盖范围（45）
- `src/infra/channel-activity.ts`
- `src/infra/channel-summary.ts`
- `src/infra/channels-status-issues.ts`
- `src/infra/device-auth-store.ts`
- `src/infra/device-identity.state-dir.test.ts`
- `src/infra/device-identity.ts`
- `src/infra/device-pairing.test.ts`
- `src/infra/device-pairing.ts`
- `src/infra/node-pairing.test.ts`
- `src/infra/node-pairing.ts`
- `src/infra/outbound/abort.ts`
- `src/infra/outbound/agent-delivery.test.ts`
- `src/infra/outbound/agent-delivery.ts`
- `src/infra/outbound/channel-adapters.ts`
- `src/infra/outbound/channel-selection.ts`
- `src/infra/outbound/channel-target.ts`
- `src/infra/outbound/deliver.test.ts`
- `src/infra/outbound/deliver.ts`
- `src/infra/outbound/delivery-queue.ts`
- `src/infra/outbound/directory-cache.ts`
- `src/infra/outbound/envelope.ts`
- `src/infra/outbound/format.ts`
- `src/infra/outbound/identity.ts`
- `src/infra/outbound/message-action-params.ts`
- `src/infra/outbound/message-action-runner.test.ts`
- `src/infra/outbound/message-action-runner.threading.test.ts`
- `src/infra/outbound/message-action-runner.ts`
- `src/infra/outbound/message-action-spec.ts`
- `src/infra/outbound/message.e2e.test.ts`
- `src/infra/outbound/message.test.ts`
- `src/infra/outbound/message.ts`
- `src/infra/outbound/outbound-policy.ts`
- `src/infra/outbound/outbound-send-service.test.ts`
- `src/infra/outbound/outbound-send-service.ts`
- `src/infra/outbound/outbound-session.ts`
- `src/infra/outbound/outbound.test.ts`
- `src/infra/outbound/payloads.ts`
- `src/infra/outbound/target-errors.ts`
- `src/infra/outbound/target-normalization.ts`
- `src/infra/outbound/target-resolver.test.ts`
- `src/infra/outbound/target-resolver.ts`
- `src/infra/outbound/targets.ts`
- `src/infra/outbound/tool-payload.ts`
- `src/infra/pairing-files.ts`
- `src/infra/pairing-token.ts`

## 核心结论
- 该组是消息“最终送达”与设备配对信任层：outbound target 解析、payload 标准化、queue/recovery、session mirror、device/node pairing 与 token 生命周期。
- `infra/outbound/*` 把上层 send/action/heartbeat 的抽象请求路由到具体 channel adapter（含 Telegram/Slack/Discord/Signal/WhatsApp）。
- `device-*`、`node-pairing*`、`pairing-*` 提供身份与令牌基础设施，为 gateway 的跨端调用与审批提供可信前提。
- `channel-summary/activity/issues` 提供状态可见性，为 CLI/doctor/status 输出提供统一数据面。

## 关键调用链
1. 上层 send/action -> target resolver -> `deliverOutboundPayloads` -> channel outbound adapter。
2. delivery queue -> ack/fail -> `recoverPendingDeliveries`，保证崩溃恢复。
3. session route -> auto thread（telegram）-> outbound send -> transcript mirror。
4. device/node pairing request -> approve/reject -> token issue/verify/revoke。

## 风险点
- 目录缓存/目标归一化滞后会造成发错目标。
- queue 持久化异常会导致重复发送或积压。
- cross-context policy 配置不当可能扩大跨 provider 转发面。
- pairing token 轮转与吊销策略不到位时，泄漏影响面大。
