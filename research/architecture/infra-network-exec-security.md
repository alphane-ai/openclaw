# Infra Network/Exec Security 研究（2026-02-17，R3）

## 覆盖范围（47）
- `src/infra/exec-approval-forwarder.test.ts`
- `src/infra/exec-approval-forwarder.ts`
- `src/infra/exec-approvals-allowlist.ts`
- `src/infra/exec-approvals-analysis.ts`
- `src/infra/exec-approvals.test.ts`
- `src/infra/exec-approvals.ts`
- `src/infra/exec-host.ts`
- `src/infra/exec-safety.ts`
- `src/infra/fetch.test.ts`
- `src/infra/fetch.ts`
- `src/infra/http-body.test.ts`
- `src/infra/http-body.ts`
- `src/infra/install-package-dir.ts`
- `src/infra/install-safe-path.test.ts`
- `src/infra/install-safe-path.ts`
- `src/infra/net/fetch-guard.ssrf.test.ts`
- `src/infra/net/fetch-guard.ts`
- `src/infra/net/hostname.ts`
- `src/infra/net/ssrf.pinning.test.ts`
- `src/infra/net/ssrf.test.ts`
- `src/infra/net/ssrf.ts`
- `src/infra/path-env.test.ts`
- `src/infra/path-env.ts`
- `src/infra/path-prepend.ts`
- `src/infra/path-safety.test.ts`
- `src/infra/path-safety.ts`
- `src/infra/ports-format.ts`
- `src/infra/ports-inspect.ts`
- `src/infra/ports-lsof.ts`
- `src/infra/ports-types.ts`
- `src/infra/ports.test.ts`
- `src/infra/ports.ts`
- `src/infra/retry-policy.ts`
- `src/infra/retry.test.ts`
- `src/infra/retry.ts`
- `src/infra/runtime-guard.test.ts`
- `src/infra/runtime-guard.ts`
- `src/infra/ssh-config.test.ts`
- `src/infra/ssh-config.ts`
- `src/infra/ssh-tunnel.ts`
- `src/infra/system-run-command.test.ts`
- `src/infra/system-run-command.ts`
- `src/infra/tls/fingerprint.ts`
- `src/infra/tls/gateway.ts`
- `src/infra/transport-ready.test.ts`
- `src/infra/transport-ready.ts`
- `src/infra/ws.ts`

## 核心结论
- 该组是网关安全执行底座：exec approvals、SSRF 与 fetch guard、路径/端口/安装安全、SSH/TLS/runtime guard。
- `exec-approvals*` + `exec-approval-forwarder` 将审批策略、决策等待、消息通知连接起来（可经 outbound 通道触达操作者）。
- `net/ssrf*` + `fetch-guard` 提供 host 解析、私网保护、重定向控制与 pinning，降低内网探测风险。
- `path-*`、`install-safe-path`、`ports*`、`runtime-guard`、`ssh-*`、`tls/*` 为部署与远程连接提供系统级护栏。

## 关键调用链
1. exec request -> approval policy -> decision wait/resolve -> forwarder 通知。
2. HTTP fetch -> guard/pinning/SSRF policy -> safe request。
3. gateway listen/tunnel -> port checks + path safety + runtime guard。
4. TLS 证书加载/生成 -> gateway HTTPS/WS 安全连接。

## 风险点
- exec approval 存储/权限异常会直接影响命令执行可用性与安全性。
- SSRF 策略与环境不匹配会导致误阻断或误放行。
- TLS/SSH/端口前置条件不足时故障定位成本较高。
- Node 版本/运行时约束不满足将导致启动失败。
