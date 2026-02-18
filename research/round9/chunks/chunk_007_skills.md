# chunk_007_skills 研究笔记

## 1. 覆盖确认
- 清单文件数：109
- 实际可读文件数：109
- 缺失/不可读文件数：0
- 主目录组：`src/imessage, src/logging, src/acp, src/markdown`
- 代码总行数（近似）：13730

## 2. 模块要点
- 文件类型分布：module=69，test=28，doc=12，config=0。
- 导入语句总数（近似）：363。
- 重点文件（按行数）与导出摘要：
  - `src/markdown/ir.ts`: 923 行，imports=3，exports=MarkdownStyle, MarkdownStyleSpan, MarkdownLinkSpan, MarkdownIR, MarkdownParseOptions, markdownToIR。
  - `src/imessage/monitor/inbound-processing.ts`: 484 行，imports=13，exports=IMessageInboundDispatchDecision, IMessageInboundDecision, resolveIMessageInboundDecision, buildIMessageInboundContext, buildIMessageEchoScope, describeIMessageEchoDropLog。
  - `src/canvas-host/server.ts`: 479 行，imports=15，exports=CanvasHostOpts, CanvasHostServerOpts, CanvasHostServer, CanvasHostHandlerOpts, CanvasHostHandler, createCanvasHostHandler。
  - `src/imessage/monitor/monitor-provider.ts`: 472 行，imports=29，exports=monitorIMessageProvider。
  - `src/acp/translator.ts`: 455 行，imports=12，exports=AcpGatewayAgent。
  - `src/acp/client.ts`: 429 行，imports=9，exports=resolvePermissionRequest, AcpClientOptions, AcpClientHandle, createAcpClient, runAcpClientInteractive。
  - `src/imessage/monitor.gating.test.ts`: 356 行，imports=5，exports=无显式导出。
  - `src/logging/diagnostic.ts`: 354 行，imports=3，exports=logWebhookReceived, logWebhookProcessed, logWebhookError, logMessageQueued, logMessageProcessed, logSessionStateChange。
  - `src/logging/subsystem.ts`: 336 行，imports=10，exports=SubsystemLogger, stripRedundantSubsystemPrefixForConsole, createSubsystemLogger, runtimeForLogger, createSubsystemRuntime。
  - `src/markdown/ir.nested-lists.test.ts`: 333 行，imports=2，exports=无显式导出。
  - `src/logging/console.ts`: 311 行，imports=10，exports=ConsoleStyle, ConsoleLoggerSettings, setConsoleConfigLoaderForTests, getConsoleSettings, getResolvedConsoleSettings, routeLogsToStderr。
  - `src/canvas-host/server.test.ts`: 310 行，imports=11，exports=无显式导出。
  - `src/canvas-host/a2ui/index.html`: 308 行，imports=0，exports=无显式导出。
  - `src/macos/gateway-daemon.ts`: 280 行，imports=3，exports=无显式导出。
  - `src/imessage/client.ts`: 256 行，imports=5，exports=IMessageRpcError, IMessageRpcResponse, IMessageRpcNotification, IMessageRpcClientOptions, IMessageRpcClient, createIMessageRpcClient。
  - `src/logging/logger.ts`: 253 行，imports=10，exports=DEFAULT_LOG_DIR, DEFAULT_LOG_FILE, LoggerSettings, LoggerResolvedSettings, LogTransportRecord, LogTransport。
  - `src/markdown/ir.blockquote-spacing.test.ts`: 203 行，imports=2，exports=无显式导出。
  - `src/markdown/render.ts`: 197 行，imports=1，exports=RenderStyleMarker, RenderStyleMap, RenderLink, RenderOptions, renderMarkdownWithMarkers。
  - `src/imessage/targets.ts`: 196 行，imports=2，exports=IMessageService, IMessageTarget, IMessageAllowTarget, normalizeIMessageHandle, parseIMessageTarget, parseIMessageAllowTarget。
  - `src/canvas-host/a2ui.ts`: 187 行，imports=6，exports=A2UI_PATH, CANVAS_HOST_PATH, CANVAS_WS_PATH, injectCanvasLiveReload, handleA2uiHttpRequest。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 31 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 26 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 19 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 14 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/imessage, src/logging, src/acp, src/markdown, src/link-understanding, src/canvas-host` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

