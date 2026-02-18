# chunk_005_extensions_phone-control 研究笔记

## 1. 覆盖确认
- 清单文件数：86
- 实际可读文件数：86
- 缺失/不可读文件数：0
- 主目录组：`extensions/zalo, extensions/zalouser, extensions/whatsapp, extensions/signal`
- 代码总行数（近似）：9930

## 2. 模块要点
- 文件类型分布：module=52，test=6，doc=5，config=23。
- 导入语句总数（近似）：149。
- 重点文件（按行数）与导出摘要：
  - `extensions/zalo/src/monitor.ts`: 728 行，imports=7，exports=ZaloRuntimeEnv, ZaloMonitorOptions, ZaloMonitorResult, registerZaloWebhookTarget, handleZaloWebhookRequest, monitorZaloProvider。
  - `extensions/zalouser/src/channel.ts`: 653 行，imports=10，exports=zalouserDock, zalouserPlugin。
  - `extensions/zalouser/src/monitor.ts`: 603 行，imports=7，exports=ZalouserMonitorOptions, ZalouserMonitorResult, monitorZalouserProvider。
  - `extensions/slack/src/channel.ts`: 550 行，imports=2，exports=slackPlugin。
  - `extensions/zalouser/src/onboarding.ts`: 505 行，imports=5，exports=zalouserOnboardingAdapter。
  - `extensions/telegram/src/channel.ts`: 481 行，imports=2，exports=telegramPlugin。
  - `extensions/whatsapp/src/channel.ts`: 460 行，imports=2，exports=whatsappPlugin。
  - `extensions/phone-control/index.ts`: 422 行，imports=3，exports=无显式导出。
  - `extensions/zalo/src/onboarding.ts`: 402 行，imports=3，exports=zaloOnboardingAdapter。
  - `extensions/zalo/src/channel.ts`: 381 行，imports=10，exports=zaloDock, zaloPlugin。
  - `extensions/signal/src/channel.ts`: 301 行，imports=2，exports=signalPlugin。
  - `package.json`: 236 行，imports=0，exports=无显式导出。
  - `extensions/zalouser/README.md`: 226 行，imports=0，exports=无显式导出。
  - `extensions/zalo/src/api.ts`: 209 行，imports=0，exports=ZaloFetch, ZaloApiResponse, ZaloBotInfo, ZaloMessage, ZaloUpdate, ZaloSendMessageParams。
  - `extensions/zalouser/src/zca.ts`: 199 行，imports=3，exports=runZca, runZcaInteractive, parseJsonOutput, checkZcaInstalled, ZcaStreamingOptions, runZcaStreaming。
  - `extensions/whatsapp/src/resolve-target.test.ts`: 194 行，imports=2，exports=无显式导出。
  - `extensions/qwen-portal-auth/oauth.ts`: 191 行，imports=1，exports=QwenDeviceAuthorization, QwenOAuthToken, loginQwenPortalOAuth。
  - `extensions/thread-ownership/index.test.ts`: 181 行，imports=2，exports=无显式导出。
  - `extensions/zalouser/src/tool.ts`: 167 行，imports=2，exports=ZalouserToolSchema, executeZalouserTool。
  - `extensions/zalouser/src/send.ts`: 161 行，imports=1，exports=ZalouserSendOptions, ZalouserSendResult, sendMessageZalouser, sendImageZalouser, sendLinkZalouser。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 30 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 15 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 11 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 1 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/zalo, extensions/zalouser, extensions/whatsapp, extensions/signal, extensions/slack, extensions/telegram` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

