# chunk_034_extensions_tlon_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：30
- 实际可读文件数：30
- 缺失/不可读文件数：0
- 主目录组：`extensions/tlon`
- 代码总行数（近似）：3251

## 2. 模块要点
- 文件类型分布：module=21，test=6，doc=1，config=2。
- 导入语句总数（近似）：79。
- 重点文件（按行数）与导出摘要：
  - `extensions/tlon/src/monitor/index.ts`: 604 行，imports=14，exports=MonitorTlonOpts, monitorTlonProvider。
  - `extensions/tlon/src/urbit/sse-client.ts`: 431 行，imports=5，exports=UrbitSseLogger, UrbitSSEClient。
  - `extensions/tlon/src/channel.ts`: 396 行，imports=11，exports=tlonPlugin。
  - `extensions/tlon/src/onboarding.ts`: 248 行，imports=5，exports=tlonOnboardingAdapter。
  - `extensions/tlon/src/urbit/channel-ops.ts`: 165 行，imports=3，exports=UrbitChannelDeps, pokeUrbitChannel, scryUrbitPath, createUrbitChannel, wakeUrbitChannel, ensureUrbitChannelOpen。
  - `extensions/tlon/src/urbit/channel-client.ts`: 158 行，imports=4，exports=UrbitChannelClientOptions, UrbitChannelClient。
  - `extensions/tlon/src/urbit/send.ts`: 132 行，imports=1，exports=TlonPokeApi, sendDm, sendGroupMessage, buildMediaText。
  - `extensions/tlon/src/monitor/utils.ts`: 107 行，imports=1，exports=formatModelName, isBotMentioned, isDmAllowed, extractMessageText, isSummarizationRequest, formatChangesDate。
  - `extensions/tlon/src/types.ts`: 100 行，imports=1，exports=TlonResolvedAccount, resolveTlonAccount, listTlonAccountIds。
  - `extensions/tlon/src/monitor/history.ts`: 93 行，imports=2，exports=TlonHistoryEntry, cacheMessage, fetchChannelHistory, getChannelHistory。
  - `extensions/tlon/src/targets.ts`: 90 行，imports=0，exports=TlonTarget, normalizeShip, parseChannelNest, parseTlonTarget, formatTargetHint。
  - `extensions/tlon/src/monitor/discovery.ts`: 79 行，imports=2，exports=fetchGroupChanges, fetchAllChannels。
  - `extensions/tlon/src/urbit/base-url.ts`: 58 行，imports=1，exports=UrbitBaseUrlValidation, validateUrbitBaseUrl, isBlockedUrbitHostname。
  - `extensions/tlon/src/urbit/errors.ts`: 52 行，imports=0，exports=UrbitErrorCode, UrbitError, UrbitUrlError, UrbitHttpError, UrbitAuthError。
  - `extensions/tlon/src/urbit/auth.ts`: 49 行，imports=3，exports=UrbitAuthenticateOptions, authenticate。
  - `extensions/tlon/src/config-schema.ts`: 48 行，imports=2，exports=TlonChannelRuleSchema, TlonAuthorizationSchema, TlonAccountSchema, TlonConfigSchema, tlonChannelConfigSchema。
  - `extensions/tlon/src/urbit/context.ts`: 48 行，imports=3，exports=UrbitContext, resolveShipFromHostname, normalizeUrbitShip, normalizeUrbitCookie, getUrbitContext, ssrfPolicyFromAllowPrivateNetwork。
  - `extensions/tlon/src/monitor/processed-messages.ts`: 47 行，imports=0，exports=ProcessedMessageTracker, createProcessedMessageTracker。
  - `extensions/tlon/src/urbit/auth.ssrf.test.ts`: 43 行，imports=3，exports=无显式导出。
  - `extensions/tlon/src/urbit/sse-client.test.ts`: 43 行，imports=2，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- network: 命中 10 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 4 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 1 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/tlon` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

