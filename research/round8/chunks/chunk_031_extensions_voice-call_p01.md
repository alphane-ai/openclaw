# chunk_031_extensions_voice-call_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：47
- 实际可读文件数：47
- 缺失/不可读文件数：0
- 主目录组：`extensions/voice-call`
- 代码总行数（近似）：10173

## 2. 模块要点
- 文件类型分布：module=35，test=8，doc=2，config=2。
- 导入语句总数（近似）：170。
- 重点文件（按行数）与导出摘要：
  - `extensions/voice-call/src/webhook-security.ts`: 789 行，imports=2，exports=validateTwilioSignature, WebhookUrlOptions, reconstructWebhookUrl, TwilioVerificationResult, TelnyxVerificationResult, verifyTelnyxWebhook。
  - `extensions/voice-call/src/providers/twilio.ts`: 638 行，imports=10，exports=TwilioProviderOptions, TwilioProvider。
  - `extensions/voice-call/openclaw.plugin.json`: 560 行，imports=0，exports=无显式导出。
  - `extensions/voice-call/src/providers/plivo.ts`: 516 行，imports=6，exports=PlivoProviderOptions, PlivoProvider。
  - `extensions/voice-call/index.ts`: 513 行，imports=6，exports=无显式导出。
  - `extensions/voice-call/src/webhook.ts`: 492 行，imports=13，exports=VoiceCallWebhookServer, TailscaleSelfInfo, getTailscaleSelfInfo, getTailscaleDnsName, setupTailscaleExposureRoute, cleanupTailscaleExposureRoute。
  - `extensions/voice-call/src/config.ts`: 455 行，imports=2，exports=E164Schema, InboundPolicySchema, InboundPolicy, TelnyxConfigSchema, TelnyxConfig, TwilioConfigSchema。
  - `extensions/voice-call/src/media-stream.ts`: 418 行，imports=4，exports=MediaStreamConfig, MediaStreamHandler。
  - `extensions/voice-call/src/webhook-security.test.ts`: 410 行，imports=3，exports=无显式导出。
  - `extensions/voice-call/src/providers/telnyx.ts`: 319 行，imports=5，exports=TelnyxProviderOptions, TelnyxProvider。
  - `extensions/voice-call/src/tunnel.ts`: 315 行，imports=2，exports=TunnelConfig, TunnelResult, startNgrokTunnel, isNgrokAvailable, startTailscaleTunnel, startTunnel。
  - `extensions/voice-call/src/providers/stt-openai-realtime.ts`: 312 行，imports=1，exports=RealtimeSTTConfig, RealtimeSTTSession, OpenAIRealtimeSTTProvider。
  - `extensions/voice-call/src/manager/outbound.ts`: 307 行，imports=10，exports=initiateCall, speak, speakInitialMessage, continueCall, endCall。
  - `extensions/voice-call/src/cli.ts`: 277 行，imports=9，exports=registerVoiceCallCli。
  - `extensions/voice-call/src/types.ts`: 273 行，imports=2，exports=ProviderNameSchema, ProviderName, CallId, ProviderCallId, CallStateSchema, CallState。
  - `extensions/voice-call/src/manager.test.ts`: 265 行，imports=7，exports=无显式导出。
  - `extensions/voice-call/src/providers/tts-openai.ts`: 260 行，imports=0，exports=OpenAITTSConfig, OPENAI_TTS_VOICES, OpenAITTSVoice, OpenAITTSProvider, mulawToLinear, chunkAudio。
  - `extensions/voice-call/src/config.test.ts`: 248 行，imports=2，exports=无显式导出。
  - `extensions/voice-call/src/manager/events.test.ts`: 241 行，imports=8，exports=无显式导出。
  - `extensions/voice-call/src/manager/events.ts`: 230 行，imports=9，exports=processEvent。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 22 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 15 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 14 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/voice-call` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

