# chunk_028_extensions_matrix_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：71
- 实际可读文件数：71
- 缺失/不可读文件数：0
- 主目录组：`extensions/matrix`
- 代码总行数（近似）：8091

## 2. 模块要点
- 文件类型分布：module=56，test=12，doc=1，config=2。
- 导入语句总数（近似）：235。
- 重点文件（按行数）与导出摘要：
  - `extensions/matrix/src/matrix/monitor/handler.ts`: 702 行，imports=15，exports=MatrixMonitorHandlerParams, createMatrixRoomMessageHandler。
  - `extensions/matrix/src/channel.ts`: 481 行，imports=14，exports=matrixPlugin。
  - `extensions/matrix/src/onboarding.ts`: 451 行，imports=7，exports=matrixOnboardingAdapter。
  - `extensions/matrix/src/matrix/monitor/index.ts`: 346 行，imports=14，exports=MonitorMatrixOpts, monitorMatrixProvider。
  - `extensions/matrix/src/matrix/send.ts`: 263 行，imports=9，exports=sendMessageMatrix, sendPollMatrix, sendTypingMatrix, sendReadReceiptMatrix, reactMatrixMessage。
  - `extensions/matrix/src/matrix/send.test.ts`: 237 行，imports=3，exports=无显式导出。
  - `extensions/matrix/src/matrix/send/media.ts`: 231 行，imports=4，exports=buildMatrixMediaInfo, buildMediaContent, prepareImageInfo, resolveMediaDurationMs, uploadMediaMaybeEncrypted。
  - `extensions/matrix/src/matrix/client/config.ts`: 220 行，imports=6，exports=resolveMatrixConfigForAccount, resolveMatrixConfig, resolveMatrixAuth。
  - `extensions/matrix/src/matrix/client/shared.ts`: 202 行，imports=8，exports=resolveSharedMatrixClient, waitForMatrixSync, stopSharedClient, stopSharedClientForAccount。
  - `extensions/matrix/src/actions.ts`: 196 行，imports=4，exports=matrixMessageActions。
  - `extensions/matrix/src/directory-live.ts`: 191 行，imports=2，exports=listMatrixDirectoryPeersLive, listMatrixDirectoryGroupsLive。
  - `extensions/matrix/src/matrix/poll-types.ts`: 168 行，imports=1，exports=M_POLL_START, M_POLL_RESPONSE, M_POLL_END, ORG_POLL_START, ORG_POLL_RESPONSE, ORG_POLL_END。
  - `extensions/matrix/src/tool-actions.ts`: 165 行，imports=5，exports=handleMatrixAction。
  - `extensions/matrix/src/matrix/send/targets.ts`: 151 行，imports=2，exports=normalizeThreadId, resolveMatrixRoomId。
  - `extensions/matrix/src/channel.directory.test.ts`: 145 行，imports=5，exports=无显式导出。
  - `extensions/matrix/src/matrix/accounts.ts`: 138 行，imports=4，exports=ResolvedMatrixAccount, listMatrixAccountIds, resolveDefaultMatrixAccountId, resolveMatrixAccount, resolveMatrixAccountConfig, listEnabledMatrixAccounts。
  - `extensions/matrix/src/resolve-targets.ts`: 136 行，imports=2，exports=resolveMatrixTargets。
  - `extensions/matrix/CHANGELOG.md`: 136 行，imports=0，exports=无显式导出。
  - `extensions/matrix/src/matrix/client/storage.ts`: 132 行，imports=6，exports=DEFAULT_ACCOUNT_KEY, resolveMatrixStoragePaths, maybeMigrateLegacyStorage, writeStorageMeta。
  - `extensions/matrix/src/matrix/actions/messages.ts`: 129 行，imports=4，exports=sendMatrixMessage, editMatrixMessage, deleteMatrixMessage, readMatrixMessages。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 23 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 14 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 12 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `extensions/matrix` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

