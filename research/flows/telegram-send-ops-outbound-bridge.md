# Telegram Send/Ops 与 Outbound Bridge 研究（2026-02-17，R2）

## 覆盖范围（20）
- `src/telegram/group-access.ts`
- `src/telegram/group-migration.test.ts`
- `src/telegram/group-migration.ts`
- `src/telegram/network-config.test.ts`
- `src/telegram/network-config.ts`
- `src/telegram/network-errors.test.ts`
- `src/telegram/network-errors.ts`
- `src/telegram/outbound-params.ts`
- `src/telegram/probe.test.ts`
- `src/telegram/probe.ts`
- `src/telegram/send.proxy.test.ts`
- `src/telegram/send.test-harness.ts`
- `src/telegram/send.test.ts`
- `src/telegram/send.ts`
- `src/telegram/targets.test.ts`
- `src/telegram/targets.ts`
- `src/telegram/token.test.ts`
- `src/telegram/token.ts`
- `src/telegram/webhook.test.ts`
- `src/telegram/webhook.ts`

## 核心结论
- `send.ts` 是 Telegram 发送总线：target/thread/reply 参数解析、markdown->HTML、媒体与按钮/poll、重试与错误分类、发送活动记录。
- `targets.ts` + `outbound-params.ts` 是 channels/plugins/outbound/telegram 的基础参数规范层。
- `network-config.ts` + `network-errors.ts` 定义网络层容错与 autoSelectFamily 策略；`probe.ts` 提供健康探活。
- `token.ts` + `webhook.ts` + `group-access.ts/group-migration.ts` 分别处理认证、入站入口和群配置演进。

## 关键链路
1. outbound adapter -> parse target/reply/thread -> `send.ts` -> API 发送 -> 记录 sent/activity。
2. network error 分类 -> recoverable 判断 -> retry runner 决策。
3. probe/webhook/token 配置共同决定“可发送”与“可接收”双向健康。

## 风险点
- thread/reply 参数解析若与上游格式偏移，会造成发送成功但落错线程。
- 网络错误分类规则覆盖不足会导致不该重试/该重试却不重试。
- token 来源优先级与账号配置复杂，运维误配时定位成本高。
