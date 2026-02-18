# Gateway Server Runtime Lifecycle 研究（2026-02-17，R2）

## 覆盖范围（33）
- `src/gateway/server-broadcast.ts`
- `src/gateway/server-browser.ts`
- `src/gateway/server-channels.ts`
- `src/gateway/server-close.ts`
- `src/gateway/server-cron.ts`
- `src/gateway/server-discovery-runtime.ts`
- `src/gateway/server-discovery.test.ts`
- `src/gateway/server-discovery.ts`
- `src/gateway/server-lanes.ts`
- `src/gateway/server-maintenance.ts`
- `src/gateway/server-mobile-nodes.ts`
- `src/gateway/server-model-catalog.ts`
- `src/gateway/server-node-events.test.ts`
- `src/gateway/server-node-subscriptions.ts`
- `src/gateway/server-plugins.test.ts`
- `src/gateway/server-plugins.ts`
- `src/gateway/server-reload-handlers.ts`
- `src/gateway/server-restart-deferral.test.ts`
- `src/gateway/server-restart-sentinel.ts`
- `src/gateway/server-runtime-config.test.ts`
- `src/gateway/server-startup-log.ts`
- `src/gateway/server-startup-memory.test.ts`
- `src/gateway/server-startup-memory.ts`
- `src/gateway/server-startup.ts`
- `src/gateway/server-tailscale.ts`
- `src/gateway/server-utils.ts`
- `src/gateway/server.ts`
- `src/gateway/server/__tests__/test-utils.ts`
- `src/gateway/server/close-reason.ts`
- `src/gateway/server/health-state.ts`
- `src/gateway/server/http-listen.ts`
- `src/gateway/server/tls.ts`
- `src/gateway/server/ws-types.ts`

## 核心结论
- 该组文件是 `server.impl.ts` 之外的“运行时骨架”：广播、启动、关闭、维护定时器、发现、cron、channel/plugin 生命周期、restart 延迟与 tailscale 暴露。
- `server-broadcast.ts` 负责事件广播及慢消费者保护；`server-maintenance.ts` 执行 tick/health 刷新与 dedupe/chat run 清理。
- `server-startup.ts` 串联 sidecars（browser/gmail/hooks/channels/plugins/memory/restart-sentinel）；`server-close.ts` 做逆向有序回收。
- `server-reload-handlers.ts` 决定热重载还是重启；`server-restart-deferral*` 保证存在待发送回复时延迟重启。
- `server-discovery*` + `server-tailscale.ts` 负责局域网/尾网可发现性与外暴露策略。

## 关键链路
1. 启动链路：runtime ready -> startup sidecars -> channel/plugin 启动 -> 发现与广播就绪。
2. 维护链路：定时 tick/health -> 版本更新 -> 客户端广播。
3. 重载链路：配置变化 -> reload handlers -> 局部热更新或 defer restart。
4. 关闭链路：通知客户端 -> 停止 sidecars/channels/plugins -> 关闭 WS/HTTP。
5. 发现链路：bonjour/widearea/tailscale hint -> 宣告服务端点。

## 风险点
- 慢客户端被丢包或断连时，状态一致性依赖上层重连与快照重放。
- defer restart 强依赖 pending-reply 计数准确性，计数漂移会导致重启时机异常。
- discovery 与 tailscale 受外部环境影响大，配置“启用”不代表实际可达。
- channel/plugin 生命周期错误若持续发生，会形成周期性抖动。
