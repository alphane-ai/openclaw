# Chunk 08 Auto Reply Research

## 1) 覆盖确认 (文件数)
- 已完整阅读 `/tmp/research_round4/chunk_08_auto_reply.txt` 中列出的 66 个文件（自动回复核心行为、chunk/command/heartbeat/inbound/media/model/dispatch/envelope 代码及其对应的单元/集成测试、触发/指令行为 E2E 套件）。

## 2) 模块要点
- `src/auto-reply/chunk.ts` + `src/auto-reply/chunk.test.ts`：提供 length/newline 模式、账户/渠道配置覆盖、markdown 代码块感知的文本分块；测试验证 fence 安全、chunk 限制、provider 覆盖。
- `command-auth.ts` + `command-detection.ts` + `command-control.test.ts`：从 `MsgContext`resolve provider、allowFrom、owner 列表与命令授权状态；`command-detection` 判断控制词/inline token；测试确保授权回退、owner 识别、激活/允许列表典型场景。
- `commands-args.ts/test.ts` + `commands-registry*.{ts,types,data}.ts` + `commands-registry.test.ts`：定义 CLI 命令元数据、参数格式化、匹配规则、技能命令扩展、检测正则；测试覆盖 args 解析/序列化、原生/文本命令曝光、bot mention 规范化、命令筛选。
- `dispatch.ts/test.ts`：封装回复调度器生命周期、派生带 typing 的调度器，以及最终调用 `getReplyFromConfig` 的桥接。
- `envelope.ts/test.ts`：格式化 agent/envelope 头部（channel、sender、host、IP、时间戳/时区/elapsed）并对入站消息、线程起始消息统一输出。
- `group-activation.ts`：解析 `/activation` 指令以控制群组需要 mention 还是始终激活。
- `heartbeat.ts` + `heartbeat-reply-payload.ts` + `heartbeat.test.ts`：默认 HEARTBEAT prompt、HEARTBEAT.md 空内容判定、HEARTBEAT_TOKEN 清理与 ACK 长度/模式、最后有效 payload 采样；测试覆盖空感知、token stripping、markup 兼容。
- `inbound-debounce.ts` + `inbound.test.ts`：计算 channel 级抖动窗口、基于 key 的缓冲/flush 机制；入站测试覆盖模板渲染、换行/mention 规范化、上下文 finalization、去重辅助。
- `media-note.ts/test.ts`：生成媒体附加注释，去除已转录音频并处理多文件计数/链接；测试核查音频过滤与格式。
- `model.ts/test.ts`：从 body 中清洗 `/model` 指令（含别名/alias），返回 cleaned 文本和可选 model/profile 提示；测试验证 alias、冒号、空白处理。
- `reply.ts` + `reply/abort.ts` + `reply/abort.test.ts` 与其他 `reply` 档案：统一导出 directive/exec/queue helper，`abort` 检测 stop 词、命令归一、abort 记忆和嵌入会话/子 agent 停止；测试覆盖记忆容量、fast abort、followup 清理、子 agent 级联。
- `reply.block-streaming.test.ts`：验证 block streaming 机制在回复中终止流的行为。
- `reply.directive.*` 系列（包括 `.accepts-thinking-xhigh...` ~ `.updates-tool-verbose...`、`e2e-harness`、`e2e-mocks`、`parse.test.ts`）：一整套 E2E 运行 directive 行为（思考级别/推理、inline 指令/模型/verbose/elevated 选项、别名模糊、allowlist 影响）；Harness/Mocks 提供共享状态/插件替身。
- `reply.heartbeat-typing.test.ts`、`reply.media-note.test.ts`、`reply.raw-body.test.ts`、`reply.test-harness.ts`：分别确认 heartbeat typing 标记、媒体注释插入、命令 raw body 保护以及 E2E 触发/指令测试底层工具。
- `reply.triggers.*` 系列（包括 `group-intro-prompts.e2e.test.ts`、`trigger-handling.*.e2e.test.ts`、`trigger-handling.stages-inbound-media-into-sandbox-workspace.{security, test}.ts`、`trigger-handling.targets-active-session-native-stop.e2e.test.ts`、`trigger-handling.test-harness.ts`）：触发处理 E2E 套件覆盖 allowFrom 激活、批准 sender 切换 elevated、inline commands 剥离、错误/状态回报、compact/greeting/模型/端点状态、沙箱媒体分阶段、native `/stop` 目标选择；Harness 管理 temp home、配置、mocked dispatcher 和 normalize 工具。

## 3) 关键调用链
- 入站消息经过 `reply/inbound-context.ts` 标准化（换行、command/body）后由 `command-detection` 识别 control/inline tokens，再交 `command-auth` 和 `commands-registry` 翻译 alias 与授权，最终送到 `dispatch.ts` 所建调度器（type/typing buffer 作为`reply-dispatcher`）并由 `getReplyFromConfig` 触发 replies（包含 chunk、envelope、model directive 解析）。
- Directive/trigger 处理依赖 `reply.directive.*` module/Harness，链路覆盖 `/think`,`/verbose`,`/model` 指令识别、reasoning/elevated/verbose 状态同步、allowlist/alias fuzzy 指令、inline 模型/命令 strip；触发测试调用 `reply.triggers.trigger-handling.test-harness.ts` 来设置 temp home、会话存储与 sandbox 媒体 staging (stageSandboxMedia) 以避免主机路径注入。
- Abort flow 从 `reply/abort.ts` 调用 `resolveCommandAuthorization`、`sessions` 存储、`agents/pi-embedded`、`subagent-registry`，并借助 `routes/session-key.ts` normalized 会话、`queue.ts` 清理 followups，配合 `reply/abort.test.ts` 验证 fast abort 与记忆。
- Heartbeat path 读取 `HEARTBEAT.md`（`heartbeat.ts`），strips token，利用 `heartbeat-reply-payload.ts` 选取实际 ACK；每条 reply 走 `chunk.ts` + `envelope.ts` 组合，确保 4000 char 分块与时间戳/总体 metadata 统一。

## 4) 风险
- `commands.allowFrom`/`ownerAllowFrom` 逻辑复杂，若配置 wildcard 且未补 owner 列表，inline commands 仍可能越权，需要在 production config review 中确认 explicit owner overrides。
- chunking/markdown 分块依赖 fence span 解析，若 markdown parser 变化或 chunk limit 载入不一致，仍可能在回复中打断代码块；注意与 provider specific limits 保持同步。
- Heartbeat token stripping在高级 markup (HTML/Markdown) 中 queue ack 限制（`maxAckChars`）容易遗漏指令；未 strip 仍会让 agent 认为 heartbeat request 继续执行。
- 沙箱媒体分阶段由 `stageSandboxMedia` 控制（测试确保 host path 拒绝），但部署需严格保证 `ensureSandboxWorkspaceForSession` 返回值不可被外部污染，否则内置媒体路径注入风险。
- Abort 记忆全局 Map 缓存 2000 条；在高并发下需要同步 `setAbortMemory` 使用者始终传入 normalized keys，否则无法撤销，并且 queued followup 清理依赖 `queue.ts` 还能跨 session 正确工作。

## 5) 与已研究模块关联
- `command-auth.ts`/`abort.ts` 依赖 `routing/session-key.ts`、`channels/dock.ts` 和 `agents/tools/sessions-helpers.ts` 的 normalization/alias 逻辑，与先前研究的 session/route 路径一致。
- `heartbeat.ts` 和 `envelope.ts` 复用 `agents/date-time.ts`、`infra/format-time` 的 timezone/elapsed 输出，这与之前的时间/agent metadata 处理保持一致。
- `dispatch.ts` 及 E2E harness 与 `reply/reply-dispatcher.ts`、`reply/provider-dispatcher.ts`、`reply/queue.ts` 的调度/跟踪机制对接，延续此前对 reply flow 的了解。
- Trigger/Directive 套件依赖 `plugins/runtime.ts`、`channels` 注册机制，并通过 `test/test-utils/channel-plugins.ts` 控制模拟通道，呼应早前对 channel/plugin 注册的分析。
