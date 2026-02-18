# chunk_004_extensions_mattermost 研究笔记

## 1. 覆盖确认
- 清单文件数：69
- 实际可读文件数：69
- 缺失/不可读文件数：0
- 主目录组：`extensions/nostr, extensions/nextcloud-talk, extensions/mattermost, extensions/memory-lancedb`
- 代码总行数（近似）：13141

## 2. 模块要点
- 文件类型分布：module=42，test=14，doc=3，config=10。
- 导入语句总数（近似）：180。
- 重点文件（按行数）与导出摘要：
  - `extensions/mattermost/src/mattermost/monitor.ts`: 883 行，imports=10，exports=MonitorMattermostOpts, monitorMattermostProvider。
  - `extensions/nostr/src/nostr-bus.ts`: 720 行，imports=7，exports=DEFAULT_RELAYS, NostrBusOptions, NostrBusHandle, validatePrivateKey, getPublicKeyFromPrivate, startNostrBus。
  - `extensions/memory-lancedb/index.ts`: 671 行，imports=6，exports=looksLikePromptInjection, escapeMemoryForPrompt, formatRelevantMemoriesContext, shouldCapture, detectCategory。
  - `extensions/nostr/src/nostr-profile-http.ts`: 593 行，imports=6，exports=NostrProfileHttpContext, createNostrProfileHttpHandler。
  - `extensions/nostr/src/nostr-bus.fuzz.test.ts`: 534 行，imports=4，exports=无显式导出。
  - `extensions/nostr/src/nostr-profile.fuzz.test.ts`: 481 行，imports=3，exports=无显式导出。
  - `extensions/nostr/src/metrics.ts`: 479 行，imports=0，exports=EventMetricName, RelayMetricName, RateLimitMetricName, DecryptMetricName, MemoryMetricName, MetricName。
  - `extensions/nostr/src/nostr-bus.integration.test.ts`: 449 行，imports=3，exports=无显式导出。
  - `extensions/nostr/src/nostr-profile-http.test.ts`: 448 行，imports=6，exports=无显式导出。
  - `extensions/nostr/src/nostr-profile.test.ts`: 411 行，imports=4，exports=无显式导出。
  - `extensions/nextcloud-talk/src/channel.ts`: 410 行，imports=10，exports=nextcloudTalkPlugin。
  - `extensions/nextcloud-talk/src/onboarding.ts`: 349 行，imports=3，exports=nextcloudTalkOnboardingAdapter。
  - `extensions/nostr/src/channel.ts`: 347 行，imports=8，exports=nostrPlugin, getNostrMetrics, getActiveNostrBuses, publishNostrProfile, getNostrProfileState。
  - `extensions/nextcloud-talk/src/inbound.ts`: 337 行，imports=7，exports=handleNextcloudTalkInbound。
  - `extensions/memory-lancedb/index.test.ts`: 331 行，imports=4，exports=无显式导出。
  - `extensions/nostr/src/seen-tracker.ts`: 304 行，imports=0，exports=SeenTrackerOptions, SeenTracker, createSeenTracker。
  - `extensions/nostr/src/nostr-profile.ts`: 278 行，imports=2，exports=ProfilePublishResult, ProfileContent, profileToContent, contentToProfile, createProfileEvent, publishProfileEvent。
  - `extensions/nextcloud-talk/src/monitor.ts`: 275 行，imports=7，exports=readNextcloudTalkWebhookBody, createNextcloudTalkWebhookServer, NextcloudTalkMonitorOptions, monitorNextcloudTalkProvider。
  - `extensions/nostr/src/nostr-profile-import.ts`: 263 行，imports=4，exports=ProfileImportResult, ProfileImportOptions, importProfileFromRelays, mergeProfiles。
  - `extensions/minimax-portal-auth/oauth.ts`: 248 行，imports=1，exports=MiniMaxRegion, MiniMaxOAuthAuthorization, MiniMaxOAuthToken, loginMiniMaxPortalOAuth。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 24 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 18 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 15 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/nostr, extensions/nextcloud-talk, extensions/mattermost, extensions/memory-lancedb, extensions/minimax-portal-auth, extensions/memory-core` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

