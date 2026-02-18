# chunk_018_src_signal_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：30
- 实际可读文件数：30
- 缺失/不可读文件数：0
- 主目录组：`src/signal`
- 代码总行数（近似）：4844

## 2. 模块要点
- 文件类型分布：module=17，test=13，doc=0，config=0。
- 导入语句总数（近似）：124。
- 重点文件（按行数）与导出摘要：
  - `src/signal/monitor/event-handler.ts`: 675 行，imports=28，exports=createSignalEventHandler。
  - `src/signal/monitor.tool-result.sends-tool-summaries-responseprefix.test.ts`: 444 行，imports=6，exports=无显式导出。
  - `src/signal/format.ts`: 398 行，imports=2，exports=SignalTextStyleRange, SignalFormattedText, markdownToSignalText, markdownToSignalTextChunks。
  - `src/signal/monitor.ts`: 393 行，imports=17，exports=MonitorSignalOpts, monitorSignalProvider。
  - `src/signal/format.chunking.test.ts`: 391 行，imports=2，exports=无显式导出。
  - `src/signal/monitor/event-handler.mention-gating.test.ts`: 305 行，imports=4，exports=无显式导出。
  - `src/signal/send.ts`: 249 行，imports=8，exports=SignalSendOpts, SignalSendResult, SignalRpcOpts, SignalReceiptType, sendMessageSignal, sendTypingSignal。
  - `src/signal/client.ts`: 196 行，imports=3，exports=SignalRpcOptions, SignalRpcError, SignalRpcResponse, SignalSseEvent, signalRpcRequest, signalCheck。
  - `src/signal/send-reactions.ts`: 188 行，imports=4，exports=SignalReactionOpts, SignalReactionResult, sendReactionSignal, removeReactionSignal。
  - `src/signal/identity.ts`: 136 行，imports=1，exports=SignalSender, resolveSignalSender, formatSignalSenderId, formatSignalSenderDisplay, formatSignalPairingIdLine, resolveSignalRecipient。
  - `src/signal/monitor/event-handler.types.ts`: 127 行，imports=6，exports=SignalEnvelope, SignalMention, SignalDataMessage, SignalReactionMessage, SignalAttachment, SignalReactionTarget。
  - `src/signal/monitor.tool-result.test-harness.ts`: 117 行，imports=4，exports=getSignalToolResultTestMocks, setSignalToolResultTestConfig, flush, installSignalToolResultTestHooks。
  - `src/signal/monitor.tool-result.pairs-uuid-only-senders-uuid-allowlist-entry.e2e.test.ts`: 113 行，imports=2，exports=无显式导出。
  - `src/signal/daemon.ts`: 103 行，imports=2，exports=SignalDaemonOpts, SignalDaemonHandle, classifySignalCliLogLine, spawnSignalDaemon。
  - `src/signal/monitor.event-handler.typing-read-receipts.e2e.test.ts`: 96 行，imports=1，exports=无显式导出。
  - `src/signal/accounts.ts`: 92 行，imports=3，exports=ResolvedSignalAccount, listSignalAccountIds, resolveDefaultSignalAccountId, resolveSignalAccount, listEnabledSignalAccounts。
  - `src/signal/monitor.event-handler.sender-prefix.e2e.test.ts`: 90 行，imports=1，exports=无显式导出。
  - `src/signal/sse-reconnect.ts`: 81 行，imports=5，exports=runSignalSseLoop。
  - `src/signal/monitor/event-handler.inbound-contract.test.ts`: 80 行，imports=4，exports=无显式导出。
  - `src/signal/probe.test.ts`: 70 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- network: 命中 9 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 8 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 2 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 1 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/signal` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

