# chunk_014_src_web_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：78
- 实际可读文件数：78
- 缺失/不可读文件数：0
- 主目录组：`src/web`
- 代码总行数（近似）：12468

## 2. 模块要点
- 文件类型分布：module=47，test=31，doc=0，config=0。
- 导入语句总数（近似）：451。
- 重点文件（按行数）与导出摘要：
  - `src/web/auto-reply/monitor.ts`: 453 行，imports=26，exports=monitorWebChannel。
  - `src/web/monitor-inbox.blocks-messages-from-unauthorized-senders-not-allowfrom.test.ts`: 441 行，imports=4，exports=无显式导出。
  - `src/web/auto-reply/monitor/process-message.ts`: 439 行，imports=30，exports=GroupHistoryEntry, processMessage。
  - `src/web/media.ts`: 433 行，imports=11，exports=WebMediaResult, getDefaultLocalRoots, loadWebMedia, loadWebMediaRaw, optimizeImageToJpeg。
  - `src/web/auto-reply/web-auto-reply-monitor.test.ts`: 424 行，imports=8，exports=无显式导出。
  - `src/web/media.test.ts`: 417 行，imports=10，exports=无显式导出。
  - `src/web/inbound/monitor.ts`: 408 行，imports=17，exports=monitorWebInbox。
  - `src/web/auto-reply.web-auto-reply.compresses-common-formats-jpeg-cap.e2e.test.ts`: 404 行，imports=5，exports=无显式导出。
  - `src/web/monitor-inbox.allows-messages-from-senders-allowfrom-list.test.ts`: 392 行，imports=4，exports=无显式导出。
  - `src/web/inbound/extract.ts`: 332 行，imports=6，exports=extractMentionedJids, extractText, extractMediaPlaceholder, extractLocationData, describeReplyContext。
  - `src/web/monitor-inbox.streams-inbound-messages.test.ts`: 324 行，imports=6，exports=无显式导出。
  - `src/web/session.ts`: 313 行，imports=10，exports=createWaSocket, waitForWaConnection, getStatusCode, formatError, newConnectionId。
  - `src/web/auto-reply/heartbeat-runner.ts`: 310 行，imports=18，exports=runWebHeartbeatOnce, resolveHeartbeatRecipients。
  - `src/web/login-qr.ts`: 296 行，imports=9，exports=startWebLoginWithQr, waitForWebLogin。
  - `src/web/monitor-inbox.captures-media-path-image-messages.test.ts`: 293 行，imports=9，exports=无显式导出。
  - `src/web/auto-reply.web-auto-reply.reconnects-after-connection-close.e2e.test.ts`: 283 行，imports=3，exports=无显式导出。
  - `src/web/auto-reply/deliver-reply.test.ts`: 272 行，imports=3，exports=无显式导出。
  - `src/web/auto-reply/monitor/process-message.inbound-contract.test.ts`: 268 行，imports=6，exports=无显式导出。
  - `src/web/inbound.test.ts`: 238 行，imports=2，exports=无显式导出。
  - `src/web/session.test.ts`: 237 行，imports=6，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 31 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 12 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- fs_delete: 命中 8 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/web` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

