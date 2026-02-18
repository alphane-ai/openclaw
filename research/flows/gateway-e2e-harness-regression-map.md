# Gateway E2E Harness 与回归地图（2026-02-17，R2）

## 覆盖范围（34）
- `src/gateway/gateway-cli-backend.live.test.ts`
- `src/gateway/gateway-misc.test.ts`
- `src/gateway/gateway-models.profiles.live.test.ts`
- `src/gateway/gateway.e2e.test.ts`
- `src/gateway/server.agent.gateway-server-agent-a.e2e.test.ts`
- `src/gateway/server.agent.gateway-server-agent-b.e2e.test.ts`
- `src/gateway/server.agent.gateway-server-agent.mocks.ts`
- `src/gateway/server.auth.e2e.test.ts`
- `src/gateway/server.channels.e2e.test.ts`
- `src/gateway/server.chat.gateway-server-chat-b.e2e.test.ts`
- `src/gateway/server.chat.gateway-server-chat.e2e.test.ts`
- `src/gateway/server.config-apply.e2e.test.ts`
- `src/gateway/server.config-patch.e2e.test.ts`
- `src/gateway/server.cron.e2e.test.ts`
- `src/gateway/server.e2e-registry-helpers.ts`
- `src/gateway/server.e2e-ws-harness.ts`
- `src/gateway/server.health.e2e.test.ts`
- `src/gateway/server.impl.ts`
- `src/gateway/server.ios-client-id.e2e.test.ts`
- `src/gateway/server.models-voicewake-misc.e2e.test.ts`
- `src/gateway/server.node-invoke-approval-bypass.e2e.test.ts`
- `src/gateway/server.reload.e2e.test.ts`
- `src/gateway/server.roles-allowlist-update.e2e.test.ts`
- `src/gateway/server.skills-status.e2e.test.ts`
- `src/gateway/server.talk-config.e2e.test.ts`
- `src/gateway/sessions-patch.test.ts`
- `src/gateway/test-helpers.e2e.ts`
- `src/gateway/test-helpers.mocks.ts`
- `src/gateway/test-helpers.openai-mock.ts`
- `src/gateway/test-helpers.server.ts`
- `src/gateway/test-helpers.ts`
- `src/gateway/ws-log.test.ts`
- `src/gateway/ws-log.ts`
- `src/gateway/ws-logging.ts`

## 核心结论
- 这组文件是 gateway 行为验证主战场：`server.impl.ts` 提供真实运行入口，`test-helpers.*` 提供可重复的隔离环境与 WS/RPC harness。
- e2e 套件覆盖 auth、channels、chat、agent、config patch/apply、cron、health、skills、talk、node invoke approvals、reload、sessions patch 等关键路径。
- `test-helpers.mocks.ts` 控制全局测试状态（配置、session、cron、provider/tailscale 模拟），是稳定性关键。
- `test-helpers.openai-mock.ts` 将模型流式交互替换为可控 mock，降低外部依赖抖动。

## 关键链路
1. 建立临时 HOME/config/session store -> 启动 server -> 建立 WS 连接 -> RPC 断言。
2. 通过 mock 注入 provider/tailscale/cron/agent 状态 -> 验证 server method 行为。
3. 通过 e2e harness 测试 connect/subscribe/event 回流 -> 验证运行态一致性。

## 风险点
- 全局状态 mock 与环境变量恢复若不完整，会引发测试间污染。
- 外部 API mock 覆盖不足会导致“测试通过但实网退化”。
- 新增 runtime 功能若未接入现有 harness，会出现回归盲区。
