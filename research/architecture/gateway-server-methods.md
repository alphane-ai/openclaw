# Gateway Server Methods 深度研究（2026-02-17）

## 覆盖范围
本轮聚焦 `src/gateway/server-methods/*` 的未研究文件（40 个）：

- `src/gateway/server-methods/AGENTS.md`
- `src/gateway/server-methods/agent-job.ts`
- `src/gateway/server-methods/agent-timestamp.ts`
- `src/gateway/server-methods/agent.test.ts`
- `src/gateway/server-methods/agent.ts`
- `src/gateway/server-methods/agents-mutate.test.ts`
- `src/gateway/server-methods/agents.ts`
- `src/gateway/server-methods/attachment-normalize.ts`
- `src/gateway/server-methods/base-hash.ts`
- `src/gateway/server-methods/chat.abort-persistence.test.ts`
- `src/gateway/server-methods/chat.inject.parentid.e2e.test.ts`
- `src/gateway/server-methods/chat.ts`
- `src/gateway/server-methods/send.test.ts`
- `src/gateway/server-methods/send.ts`
- `src/gateway/server-methods/talk.ts`
- `src/gateway/server-methods/tts.ts`
- `src/gateway/server-methods/types.ts`
- `src/gateway/server-methods/validation.ts`
- `src/gateway/server-methods/voicewake.ts`
- `src/gateway/server-methods/browser.ts`
- `src/gateway/server-methods/channels.ts`
- `src/gateway/server-methods/config.ts`
- `src/gateway/server-methods/connect.ts`
- `src/gateway/server-methods/cron.ts`
- `src/gateway/server-methods/devices.ts`
- `src/gateway/server-methods/exec-approval.ts`
- `src/gateway/server-methods/health.ts`
- `src/gateway/server-methods/logs.ts`
- `src/gateway/server-methods/models.ts`
- `src/gateway/server-methods/restart-request.ts`
- `src/gateway/server-methods/server-methods.test.ts`
- `src/gateway/server-methods/skills.ts`
- `src/gateway/server-methods/skills.update.normalizes-api-key.test.ts`
- `src/gateway/server-methods/system.ts`
- `src/gateway/server-methods/update.ts`
- `src/gateway/server-methods/usage.sessions-usage.test.ts`
- `src/gateway/server-methods/usage.test.ts`
- `src/gateway/server-methods/usage.ts`
- `src/gateway/server-methods/web.ts`
- `src/gateway/server-methods/wizard.ts`

## 关键结论
- `server-methods` 是 gateway RPC 的“业务编排层”，把 transport 侧已通过鉴权/协议校验的请求转成具体能力调用。
- `agent.ts`、`chat.ts`、`send.ts` 共同形成消息闭环：`session key` 归一化 -> 发送策略校验 -> 执行/中断 -> transcript 持久化 -> 事件广播。
- `chat.inject` / `chat.send` 的 transcript 追加遵循 `SessionManager.appendMessage`，与 `AGENTS.md` 中 parentId DAG 约束一致，避免破坏压缩链路。
- `config.ts` + `restart-request.ts` + `update.ts` 组成“配置变更/升级触发重启”链路：解析 restart 参数 -> 写 restart sentinel -> 调度 SIGUSR1。
- `exec-approval.ts` 与 `exec-approvals.ts` 分层明确：前者是一次审批会话（request/wait/resolve），后者是审批策略（allowlist/node policy）管理。
- `devices.ts` 与已研究 pairing/routing 直接关联：device/node 配对审批、token 旋转和拒绝都走统一 pairing store 与广播事件。
- `usage.ts` 将 session 统计、成本、timeseries/logs 汇聚成 dashboard 读模型，是 gateway 可观测入口之一。
- `web.ts` 的 `web.login.start/wait` 将 plugin channel 的二维码登录能力暴露为统一 RPC。
- `wizard.ts` 把 onboarding wizard 运行态保持在内存 session map，支持 start/next/cancel/status。

## 关键调用链
1. `agent` / `chat.send` -> session key 解析与路由归一化 -> 会话写入 -> agent runtime 调用 -> transcript append -> WS 事件回推。
2. `send` / `poll` -> outbound 目标解析（含 pairing/routing 语义）-> channel adapter 发送 -> 结果镜像回会话 transcript。
3. `config.patch|apply` -> base-hash 并发保护 -> 持久化配置 -> restart sentinel -> `scheduleGatewaySigusr1Restart`。
4. `exec.approval.request|waitDecision|resolve` -> `ExecApprovalManager` -> 广播审批状态 -> 客户端/UI 响应。
5. `sessions.usage*` -> session store + usage 聚合器 -> 网关返回摘要/时序/日志。

## 风险与关注点
- `usage` 在大规模会话场景下存在同步扫描与聚合压力，易放大主线程延迟。
- `send/chat` 的幂等缓存依赖调用方稳定 idempotency key，异常 key 管理会导致重复投递或“已响应但未执行”错觉。
- `browser.request` 在多 candidate 节点场景存在歧义失败路径，运维上需要更明确的 node 选择策略。
- `web.login` 当前以插件能力探测为主，多个候选插件并存时需要更清晰的选择/冲突处理。

## 与已研究模块关系
- 与 `src/routing/*`：复用会话键规范化与路由决策。
- 与 `src/pairing/*`：device/node 配对审批事件与 token 生命周期共享同一治理面。
- 与已研究 `gateway` 核心文件：本目录承担“方法实现层”，由 server runtime 统一注册并分发。
