# Chunk 11 Auto Reply Research

## 1) 覆盖确认 (文件数)
- 本轮已完整研究 `/tmp/research_round4/chunk_11_auto_reply.txt` 中列出的 29 个文件，29 个文件已覆盖。
- 主目录组: `src/auto-reply/reply`, `src/auto-reply`。

## 2) 关键模块拆解
- `route-reply.ts` / `route-reply.test.ts`：封装 provider-agnostic 的 reply routing，确保按原始 channel/对话路由、应用响应前缀、处理 thread/reply-to 并依赖 outbound deliver。测试覆盖 abort、media 以及 mirror 行为。
- `session-*.ts`：包括 `session.ts`、`session-updates.ts`、`session-usage.ts`、`session-run-accounting.ts`、`session-reset-model.ts`、`session-reset-prompt.ts`，负责会话生命周期（初始化、重置、metadata、技能快照）、tokens/usage 持久化、model override 解析与 session reset prompt 定义。
- `typing.ts` / `typing-mode.ts`：控制 agent typing 模式/级别（包括 tests），帮助 reply 流程注入用户可见的 typing indicators。
- `thinking.ts` / `thinking.test.ts`：管理长思考/指令触发的 thinking state，决定 `thinkingLevel` 何时递增并确保指令覆盖。
- `templating.ts`：提供回复文本模板和变量注入，供 auto-reply、skill commands 及 testing harness 复用。
- `tool-meta.ts` / `tool-meta.test.ts`：维护 auto-reply 可调用工具的元数据，助力指令解析与测试验证。
- `tokens.ts`：处理 token 统计与 SILENT_REPLY_TOKEN，确保路由层能过滤静默回复。
- `types.ts`：声明 auto-reply/skill command 的关键类型（例如 ReplyPayload、SkillCommandMetadata）.
- `status.ts` / `status.test.ts`：给 `/status` 命令提供上下文（当前 session/usage/limits），测试验证输出与角落场景。
- `skill-commands.ts` / `skill-commands.test.ts`：注册技能命令、解析 args、授权判断，并触发对应 handler。
- `send-policy.ts`：定义 send policy 规则（例如 queue、debounce、drop）供回复调度使用。
- `templating.ts`：统一字段（如 `OriginatingChannel`、`Body`）和 HTML/Markdown 清理逻辑，后续模块共享。
- `session.*` 相关测试 `session.test.ts` 等：确保 session store、reset、mirror、sessionKey 计算符合预期。
- `stage-sandbox-media.ts` / `streaming-directives.ts` / `subagents-utils.ts` / `untrusted-context.ts`：涵盖 media 沙箱 staging、指令流控制、子 agent 协调与不可信 context 处理的辅助逻辑，测试验证多线程/媒体边界。
- `test-ctx.ts` / `test-helpers.ts`：提供测试中可复用的 context builder/harness，让上述模块在 unit/e2e 中复用 shared fixtures。

## 3) 逻辑链路要点
- auto-reply 初始化依靠 `session.ts` 构建 normalized `TemplateContext`，并通过 `session-*` 系列模块维护 tokens/usage、skill snapshot、model override 与 persistence；`route-reply` 继续将 normalized payload 发送到 provider，配合 `send-policy`、`status` 等命令输出。
- `skill-commands` + `templating` + `tool-meta` 形成指令解析/授权/执行三部曲，`tokens` 提供静默过滤，`typing` / `thinking` 控制流量指示，`streaming-directives` 则管理高阶 inline 指令与 streaming 状态。
- `stage-sandbox-media` / `subagents-utils` / `untrusted-context` 保持媒体上传、subagent 交互及不可信输入的安全边界，这些模块在高阶测试中被 `test-ctx` / `test-helpers` 复用确保 sandbox workspace 与 reply flow 的一致性。

## 4) 需注意的风险点
- 会话存储/重置 (`session.ts` + `session-updates.ts`) 在高并发下需确保 `sessionStore` 写入与 `archiveSessionTranscripts` 不冲突。
- `session-reset-model.ts` 构建的 model override 需要和 config 中的允许模型集同步，防止 alias 解析绕过 allow list。
- `thinking` 与 `typing` 指令状态可能在 `streaming-directives.ts` 中被 inline 叠加，需要确保 `SILENT_REPLY_TOKEN` 等标记不会误触发静默策略。

## 5) 测试/验证覆盖
- 多数模块（route handling、session persistence、skill commands、status、thinking/typing）均有对应的 `.test.ts`，确保关键路径（abort、queue、payload normalization、thread handling、media staging）在单元/集成层验证。
- `test-ctx`/`test-helpers` 赋予多模块一致环境，使 `typing-mode`、`streaming-directives`、`subagents` 等模块在不同情境下重复复用 fixtures。
