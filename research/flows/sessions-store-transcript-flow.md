# Sessions Store 与 Transcript 闭环研究（2026-02-17）

## 覆盖范围
本轮覆盖 sessions 相关未研究文件（24 个）：

- `src/config/sessions/delivery-info.ts`
- `src/config/sessions/metadata.ts`
- `src/config/sessions/paths.ts`
- `src/config/sessions/reset.ts`
- `src/config/sessions/sessions.test.ts`
- `src/config/sessions/store.pruning.e2e.test.ts`
- `src/config/sessions/store.pruning.test.ts`
- `src/config/sessions/store.ts`
- `src/config/sessions/transcript.ts`
- `src/config/sessions/types.ts`
- `src/gateway/server-wizard-sessions.ts`
- `src/gateway/server.sessions-send.e2e.test.ts`
- `src/gateway/server.sessions.gateway-server-sessions-a.e2e.test.ts`
- `src/gateway/session-utils.fs.test.ts`
- `src/gateway/session-utils.fs.ts`
- `src/gateway/session-utils.types.ts`
- `src/sessions/input-provenance.ts`
- `src/sessions/level-overrides.ts`
- `src/sessions/model-overrides.ts`
- `src/sessions/send-policy.test.ts`
- `src/sessions/send-policy.ts`
- `src/sessions/session-key-utils.ts`
- `src/sessions/session-label.ts`
- `src/sessions/transcript-events.ts`

## 关键结论
- `src/config/sessions/store.ts` 是会话状态源：负责读取/归一化/写回 `sessions.json`，并带维护策略（prune/cap/rotate）与写锁。
- `paths.ts` 做 session 路径安全与跨 agent 解析，防止非法 ID/路径穿越。
- `metadata.ts` / `delivery-info.ts` 把消息来源、投递上下文、群组信息折叠进 SessionEntry，保证 UI 与路由回看一致。
- `reset.ts` 定义 thread/group/direct 的日切与 idle reset 策略，兼容 legacy 行为。
- `transcript.ts` 保证 transcript 头与 assistant 消息追加一致性，并在必要时回写 sessionFile。
- `src/sessions/*` 承担策略层：sendPolicy、model/level overrides、session key 语义、transcript 事件广播。
- `src/gateway/session-utils.fs.ts` 提供 transcript 读取面向网关能力：首条用户消息、尾部预览、完整消息列表、归档/安全读取。
- `server.sessions-send.e2e.test.ts` 与 `server.sessions.gateway-server-sessions-a.e2e.test.ts` 验证 gateway `sessions.*` RPC 行为：list/resolve/patch/reset/delete/compact/preview，含 active run abort、队列清理、legacy main alias 清理、标签唯一性等关键边界。

## 关键调用链
1. inbound/update -> `recordSessionMetaFromInbound` -> session store 合并 metadata/delivery -> 持久化。
2. assistant 输出 -> `appendAssistantMessageToSessionTranscript` -> `.jsonl` 更新 -> `emitSessionTranscriptUpdate`。
3. gateway 预览 -> `resolveSessionTranscriptCandidates` -> 读取 transcript preview/first message -> 返回 `sessions.preview`。
4. session 维护 -> `resolveMaintenanceConfig` -> warn/enforce -> prune/cap/rotate。
5. `sessions.reset/delete` -> active run abort + queue cleanup + 子代理中止 -> store/transcript 变更落盘。

## 风险与关注点
- 维护策略在 `warn` 模式仅告警不清理，长期可能导致 store 与 transcript 膨胀。
- 对 legacy/损坏 transcript 的容错虽有覆盖，但大规模异常行仍会影响 preview 准确性与性能。
- 跨 agent transcript 候选路径解析依赖配置一致性，配置漂移时可能出现“会话存在但预览读取不到”。

## 与已研究模块关系
- 与已研究 `gateway sessions-resolve/sessions-patch` 紧密耦合：本轮覆盖了其底层 store/transcript 读写细节。
- 与已研究 `routing/pairing`：session key 与 delivery context 的归一化结果直接影响路由与回包目标。
