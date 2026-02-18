1) 覆盖确认(文件数)
- 完整覆盖 `/tmp/research_round4/chunk_10_auto_reply.txt` 列出的 63 个文件（directive-handling、dispatch、reply、queue、history、memory flush 等），所有核心逻辑和相关测试均已研读。

2) 模块要点
- Directive 解析/应用：`directive-handling.*` 负责从输入剥离 inline 指令、校验排队参数、构建模型 picker、记录模式/level 覆写，并通过 `get-reply-directives-apply.ts` 与 `persistInlineDirectives` 触发会话更新与事件。`directives.ts`、`directive-parsing.ts` 和 `line-directives.ts` 提供细粒度的 token/LINE 指令解析能力。
- 回复流水线：`get-reply.ts` 结合配置、workspace、typing、上下文清理等准备数据；`get-reply-directives.ts` 解析/授权指令；`get-reply-inline-actions.ts` 处理技能、inline 命令与 inline status；`runPreparedReply.ts` 拼装系统提示、排队/queue 设置与 followup 运行；`followup-runner.ts` 通过 `runEmbeddedPiAgent`、`route-reply`、TTY typing 以及 compaction 通知来发出 payload。
- 发送与调度：`dispatch-from-config.ts` 做 dedupe、diagnostics、hooks、跨渠道路由和 TTS 生成；`reply-dispatcher.ts` 提供 human delay、typing/idle 监控与 payload normalize；`reply-delivery.ts` + `reply-payloads.ts` 负责 block streaming、reply threading 与 reply tag 解析；`provider-dispatcher.ts` 与 `dispatcher-registry.ts` 管理广域 dispatcher 状态。
- Queue 路径：`queue/*.ts` 定义 directive/setting/queue/drop 策略，`enqueue.ts` 负责 dedupe/drop，`drain.ts` 触发 collect/summary/steer 流程，`cleanup.ts` 清理 session lane，`state.ts/types.ts` 维护 FollowupQueue 状态。此外 `scheduleFollowupDrain` 与 `createFollowupRunner` 共同控制 followup 任务。
- 辅助组件：`inbound-*` 系列处理上下文正规化、BOT 备注与元数据；`memory-flush.ts` / `history.ts` 管理 compaction 触发条件与历史缓存；`model-selection.*` 保证 stored/parent override 合法；`mentions.ts` 用于 group 强制 mention 的判定；`reply-inline.ts`/`reply-tags.ts`/`response-prefix-template.ts` 为 directives/template 提供细粒度处理；大量测试（dispatch-from-config、model-selection、memory-flush、followup-runner、reply-flow、reply-utils 等）覆盖关键路径。

3) 关键调用链
- 一条代表性链路：`dispatchReplyFromConfig()` → dedupe/diagnostics → `getReplyFromConfig()` → context finalization + `resolveReplyDirectives()` → inline actions → `runPreparedReply()` → queue 设定 → `runReplyAgent()`（包含 typing/compaction）→ `createReplyDispatcher()` → `dispatchReply`/`routeReply()` → `maybeApplyTtsToPayload()` → `ReplyDispatcher`。
- followup queue：`runPreparedReply` 在需要时调用 `enqueueFollowupRun` → `scheduleFollowupDrain` → `createFollowupRunner` → `runEmbeddedPiAgent`（支持 model fallback/compaction）→ `routeReply`/dispatcher → `sendFollowupPayloads`。
- directive persistence：`applyInlineDirectiveOverrides` 调用 `applyInlineDirectivesFastLane` → `persistInlineDirectives` → `sessionStore`/`system events`/`applyModelOverride` → 辅助 `resolveElevatedPermissions`、`resolveMemoryFlush` 等共享状态更新。

4) 风险
- 指令解析复杂，`parseInlineDirectives` + queue/exec/model/elevated 选项的交叉容易遗漏无效参数，尤其 `queue` drop/cap/summarize` 与 group/incoming cross-channel 组合需要谨慎测试。
- followup queue 会丢弃消息（`dropPolicy`、`shouldSkipQueueItem`）或合并为 summary prompt，若 summary 文本无法恢复原始上下文可能让 agent 缺少关键信息；跨渠道 reroute 也依赖 `originatingChannel`/`originatingTo`，需要确保header/metadata 不被 strip。
- Elevated/Auth 限制高度依赖 config  allowlist (`resolveElevatedPermissions` + `resolveAuthLabel`)，config 更新/新 provider 没有同步会导致 `elevated` 指令静默失效；同理 `model-selection` 必须保持 allowlist 与 alias 索引一致，否则 `resolveModelDirectiveSelection` 可能忽略合法模型。
- `memory-flush` 触发依赖 `totalTokens` 与会话 compaction 计数；`resolveMemoryFlushPromptForRun` 使用 timezone/cron 信息，若时间设置不一致会重复/错过 flush，影响 compaction 预测。

5) 与已研究模块关联
- 与先前 `chunk_08_auto_reply.md` 的 auto-reply 入口、命令调度、channel handler 等内容形成扩展：`dispatch-from-config` 与 `reply-dispatcher` 衔接外层 `dispatch.js`，`get-reply` 与 `reply-flow` 配合先前的 session/command 管道，`queue` 与 `inter-thread routing` 保持一致。特别是 directory `src/auto-reply/reply` 内的工具依赖 `src/inbound-*`、`src/agents/*`（see chunk 08）提供的基础设施。
