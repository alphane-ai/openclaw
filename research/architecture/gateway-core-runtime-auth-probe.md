# Gateway Core Runtime/Auth/Probe 研究（2026-02-17，R2）

## 覆盖范围（36）
- `src/gateway/assistant-identity.test.ts`
- `src/gateway/assistant-identity.ts`
- `src/gateway/auth-rate-limit.test.ts`
- `src/gateway/auth-rate-limit.ts`
- `src/gateway/auth.test.ts`
- `src/gateway/boot.test.ts`
- `src/gateway/boot.ts`
- `src/gateway/call.test.ts`
- `src/gateway/call.ts`
- `src/gateway/chat-abort.test.ts`
- `src/gateway/chat-abort.ts`
- `src/gateway/chat-attachments.test.ts`
- `src/gateway/chat-attachments.ts`
- `src/gateway/chat-sanitize.test.ts`
- `src/gateway/chat-sanitize.ts`
- `src/gateway/client.e2e.test.ts`
- `src/gateway/client.ts`
- `src/gateway/config-reload.test.ts`
- `src/gateway/config-reload.ts`
- `src/gateway/control-ui-csp.test.ts`
- `src/gateway/control-ui-csp.ts`
- `src/gateway/control-ui-shared.ts`
- `src/gateway/control-ui.http.test.ts`
- `src/gateway/control-ui.ts`
- `src/gateway/device-auth.ts`
- `src/gateway/exec-approval-manager.ts`
- `src/gateway/gateway-config-prompts.shared.ts`
- `src/gateway/live-image-probe.ts`
- `src/gateway/net.test.ts`
- `src/gateway/node-command-policy.ts`
- `src/gateway/node-invoke-sanitize.ts`
- `src/gateway/node-invoke-system-run-approval.ts`
- `src/gateway/origin-check.test.ts`
- `src/gateway/origin-check.ts`
- `src/gateway/probe-auth.ts`
- `src/gateway/probe.ts`

## 核心结论
- 该组文件构成 gateway 的“连接与运行保护层”：认证鉴权、速率限制、网络边界、client 调用、配置热重载、control-ui 安全、node invoke 审批、probe 探活。
- `auth.ts` + `auth-rate-limit.ts` + `net.ts` 共同决定连接是否允许（token/password/tailscale/trusted-proxy/loopback），并输出统一授权结果给上层 method 处理。
- `client.ts` 与 `call.ts` 负责从 CLI/内部调用网关时的协议连接、TLS 处理、心跳/重连、请求超时。
- `config-reload.ts` 负责文件变化到热更新/重启决策；`control-ui.ts` + CSP 模块保证控制面板静态资源与 bootstrap 数据的安全注入。
- `node-invoke-system-run-approval.ts` + `node-command-policy.ts` + sanitize 组成高风险命令执行的防护链。
- `probe.ts`/`probe-auth.ts` 统一健康探测入口，聚合 health/status/system-presence/config 快照。

## 关键链路
1. connect/auth: 请求来源解析 (`net.ts`) -> 认证策略 (`auth.ts`) -> 限流锁定 (`auth-rate-limit.ts`) -> 允许/拒绝。
2. gateway client call: `call.ts` 构建 `GatewayClient` -> 握手/请求 -> 超时与 TLS 策略 -> 返回标准响应。
3. config reload: 文件变更监听 -> diff 路径分类 -> hot reload / restart 判定与执行。
4. node invoke 审批: invoke 请求 -> policy/sanitize -> approval snapshot 校验 -> 节点转发。
5. control UI: basePath/avatar/bootstrap 组装 -> CSP/安全头 -> SPA 资源与 fallback。

## 风险点
- trusted-proxy 与 rate-limit 配置错配会导致误封或放大来源伪造风险。
- reload 规则需随配置演进同步，否则可能过度重启或漏热更新。
- system.run 审批 ID 与连接绑定关系复杂，跨连接复用时易触发拒绝。
- 控制台 bootstrap 依赖多处路径配置，错误时容易出现 UI 可达但不可用。
