# Infra Runtime Ops/Heartbeat/Update 研究（2026-02-17，R3）

## 覆盖范围（68）
- `src/infra/bonjour-ciao.ts`
- `src/infra/bonjour-discovery.test.ts`
- `src/infra/bonjour-discovery.ts`
- `src/infra/bonjour-errors.ts`
- `src/infra/control-ui-assets.test.ts`
- `src/infra/control-ui-assets.ts`
- `src/infra/gateway-lock.test.ts`
- `src/infra/gateway-lock.ts`
- `src/infra/heartbeat-active-hours.test.ts`
- `src/infra/heartbeat-active-hours.ts`
- `src/infra/heartbeat-events-filter.ts`
- `src/infra/heartbeat-events.ts`
- `src/infra/heartbeat-runner.ghost-reminder.test.ts`
- `src/infra/heartbeat-runner.model-override.test.ts`
- `src/infra/heartbeat-runner.respects-ackmaxchars-heartbeat-acks.test.ts`
- `src/infra/heartbeat-runner.returns-default-unset.test.ts`
- `src/infra/heartbeat-runner.scheduler.test.ts`
- `src/infra/heartbeat-runner.sender-prefers-delivery-target.test.ts`
- `src/infra/heartbeat-runner.ts`
- `src/infra/heartbeat-visibility.test.ts`
- `src/infra/heartbeat-visibility.ts`
- `src/infra/heartbeat-wake.test.ts`
- `src/infra/heartbeat-wake.ts`
- `src/infra/provider-usage.auth.normalizes-keys.test.ts`
- `src/infra/provider-usage.auth.ts`
- `src/infra/provider-usage.fetch.antigravity.test.ts`
- `src/infra/provider-usage.fetch.antigravity.ts`
- `src/infra/provider-usage.fetch.claude.ts`
- `src/infra/provider-usage.fetch.codex.ts`
- `src/infra/provider-usage.fetch.copilot.ts`
- `src/infra/provider-usage.fetch.gemini.ts`
- `src/infra/provider-usage.fetch.minimax.ts`
- `src/infra/provider-usage.fetch.shared.ts`
- `src/infra/provider-usage.fetch.ts`
- `src/infra/provider-usage.fetch.zai.ts`
- `src/infra/provider-usage.format.ts`
- `src/infra/provider-usage.load.ts`
- `src/infra/provider-usage.shared.ts`
- `src/infra/provider-usage.test.ts`
- `src/infra/provider-usage.ts`
- `src/infra/provider-usage.types.ts`
- `src/infra/restart-sentinel.test.ts`
- `src/infra/restart-sentinel.ts`
- `src/infra/restart.ts`
- `src/infra/session-cost-usage.test.ts`
- `src/infra/session-cost-usage.ts`
- `src/infra/session-cost-usage.types.ts`
- `src/infra/session-maintenance-warning.ts`
- `src/infra/skills-remote.test.ts`
- `src/infra/skills-remote.ts`
- `src/infra/system-events.test.ts`
- `src/infra/system-events.ts`
- `src/infra/system-presence.test.ts`
- `src/infra/system-presence.ts`
- `src/infra/tailnet.ts`
- `src/infra/tailscale.test.ts`
- `src/infra/tailscale.ts`
- `src/infra/update-channels.ts`
- `src/infra/update-check.test.ts`
- `src/infra/update-check.ts`
- `src/infra/update-global.ts`
- `src/infra/update-runner.test.ts`
- `src/infra/update-runner.ts`
- `src/infra/update-startup.test.ts`
- `src/infra/update-startup.ts`
- `src/infra/voicewake.ts`
- `src/infra/widearea-dns.test.ts`
- `src/infra/widearea-dns.ts`

## 核心结论
- 该组负责网关运行稳定性与运维闭环：gateway lock、restart/restart-sentinel、heartbeat 调度、provider/session usage、discovery/tailscale、update runner。
- heartbeat runner 是核心协调器：活跃时段、事件过滤、可见性决策、目标解析后通过 outbound 发送到具体通道（可含 Telegram）。
- usage 体系（provider/session cost）为 dashboard/status 提供成本与用量数据。
- discovery + tailscale + widearea DNS 维持节点发现能力；update 系列维持升级检查与执行。

## 关键调用链
1. heartbeat scheduler -> delivery target resolve -> outbound adapter -> channel send。
2. restart request -> defer/idle check -> restart signal + sentinel notification。
3. provider/session usage loaders -> 汇总 -> gateway status/usage 输出。
4. discovery probes -> beacons/tailnet hints -> 远程节点可发现。
5. update check -> runner -> global/local install path 更新。

## 风险点
- heartbeat 去重与可见性逻辑复杂，可能出现应发未发或过发。
- restart defer 若 pending 统计不准会延迟或提前重启。
- discovery 强依赖外部命令和网络环境，实际可达性不稳定。
- usage 汇总依赖凭据与外部 API，缺失时会低估真实消耗。
- update runner 在脏工作树/权限不足时易失败并中断自动流程。
