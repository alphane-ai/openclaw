# chunk_008_src_markdown 研究笔记

## 1. 覆盖确认
- 清单文件数：95
- 实际可读文件数：95
- 缺失/不可读文件数：0
- 主目录组：`src/telegram, src/tui, src/terminal, src/plugin-sdk`
- 代码总行数（近似）：13292

## 2. 模块要点
- 文件类型分布：module=68，test=27，doc=0，config=0。
- 导入语句总数（近似）：272。
- 重点文件（按行数）与导出摘要：
  - `src/tts/tts.ts`: 942 行，imports=13，exports=ResolvedTtsConfig, ResolvedTtsModelOverrides, TtsDirectiveOverrides, TtsDirectiveParseResult, TtsResult, TtsTelephonyResult。
  - `src/node-host/invoke.ts`: 919 行，imports=11，exports=NodeInvokeRequestPayload, SkillBinsProvider, sanitizeEnv, handleInvoke, coerceNodeInvokePayload, buildNodeInvokeResultParams。
  - `src/tts/tts-core.ts`: 674 行，imports=8，exports=isValidVoiceId, parseTtsDirectives, OPENAI_TTS_MODELS, OPENAI_TTS_VOICES, isValidOpenAIModel, isValidOpenAIVoice。
  - `src/tts/tts.test.ts`: 567 行，imports=6，exports=无显式导出。
  - `src/tui/tui-command-handlers.ts`: 503 行，imports=12，exports=createCommandHandlers。
  - `src/tui/tui-event-handlers.test.ts`: 479 行，imports=5，exports=无显式导出。
  - `src/plugin-sdk/index.ts`: 444 行，imports=0，exports=(anonymous-or-reexport)。
  - `src/terminal/table.ts`: 420 行，imports=2，exports=TableColumn, RenderTableOptions, renderTable。
  - `src/telegram/format.wrap-md.test.ts`: 405 行，imports=2，exports=无显式导出。
  - `src/tui/components/searchable-select-list.ts`: 394 行，imports=3，exports=SearchableSelectListTheme, SearchableSelectList。
  - `src/telegram/model-buttons.test.ts`: 336 行，imports=2，exports=无显式导出。
  - `src/tui/components/searchable-select-list.test.ts`: 324 行，imports=3，exports=无显式导出。
  - `src/tui/gateway-chat.ts`: 271 行，imports=8，exports=GatewayConnectionOptions, ChatSendOptions, GatewayEvent, GatewaySessionList, GatewayAgentsList, GatewayModelChoice。
  - `src/telegram/format.ts`: 266 行，imports=3，exports=TelegramFormattedChunk, markdownToTelegramHtml, wrapFileReferencesInHtml, renderTelegramHtmlText, markdownToTelegramChunks, markdownToTelegramHtmlChunks。
  - `src/telegram/sticker-cache.ts`: 265 行，imports=11，exports=CachedSticker, getCachedSticker, cacheSticker, searchStickers, getAllCachedStickers, getCacheStats。
  - `src/telegram/sticker-cache.test.ts`: 262 行，imports=4，exports=无显式导出。
  - `src/telegram/monitor.test.ts`: 246 行，imports=2，exports=无显式导出。
  - `src/node-host/invoke-browser.ts`: 227 行，imports=7，exports=runBrowserProxyCommand。
  - `src/telegram/monitor.ts`: 218 行，imports=16，exports=MonitorTelegramOpts, createTelegramRunnerOptions, monitorTelegramProvider。
  - `src/telegram/model-buttons.ts`: 218 行，imports=0，exports=ButtonRow, ParsedModelCallback, ProviderInfo, ModelsKeyboardParams, parseModelCallbackData, buildProviderKeyboard。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 34 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 23 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 16 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 4 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/telegram, src/tui, src/terminal, src/plugin-sdk, src/node-host, src/test-utils` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

