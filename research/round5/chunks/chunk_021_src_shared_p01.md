# chunk_021_src_shared_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：18
- 实际可读文件数：18
- 缺失/不可读文件数：0
- 主目录组：`src/shared`
- 代码总行数（近似）：1423

## 2. 模块要点
- 文件类型分布：module=15，test=3，doc=0，config=0。
- 导入语句总数（近似）：15。
- 重点文件（按行数）与导出摘要：
  - `src/shared/text/reasoning-tags.test.ts`: 219 行，imports=2，exports=无显式导出。
  - `src/shared/requirements.ts`: 219 行，imports=0，exports=Requirements, RequirementConfigCheck, RequirementsMetadata, resolveMissingBins, resolveMissingAnyBins, resolveMissingOs。
  - `src/shared/text/reasoning-tags.ts`: 124 行，imports=0，exports=ReasoningTagMode, ReasoningTagTrim, stripReasoningTagsFromText。
  - `src/shared/shared-misc.test.ts`: 112 行，imports=4，exports=无显式导出。
  - `src/shared/frontmatter.ts`: 100 行，imports=3，exports=normalizeStringList, getFrontmatterString, parseFrontmatterBool, resolveOpenClawManifestBlock, OpenClawManifestRequires, resolveOpenClawManifestRequires。
  - `src/shared/subagents-format.ts`: 97 行，imports=0，exports=formatDurationCompact, formatTokenShort, truncateLine, TokenUsageLike, resolveTotalTokens, resolveIoTokens。
  - `src/shared/config-eval.ts`: 88 行，imports=2，exports=isTruthy, resolveConfigPath, isConfigPathTruthyWithDefaults, resolveRuntimePlatform, hasBinary。
  - `src/shared/requirements.test.ts`: 83 行，imports=2，exports=无显式导出。
  - `src/shared/node-match.ts`: 70 行，imports=0，exports=NodeMatchCandidate, normalizeNodeKey, resolveNodeMatches, resolveNodeIdFromCandidates。
  - `src/shared/usage-aggregates.ts`: 64 行，imports=0，exports=buildUsageAggregateTail。
  - `src/shared/entry-status.ts`: 57 行，imports=2，exports=evaluateEntryMetadataRequirements。
  - `src/shared/chat-envelope.ts`: 50 行，imports=0，exports=stripEnvelope, stripMessageIdHints。
  - `src/shared/chat-content.ts`: 38 行，imports=0，exports=extractTextFromChatContent。
  - `src/shared/device-auth.ts`: 31 行，imports=0，exports=DeviceAuthEntry, DeviceAuthStore, normalizeDeviceAuthRole, normalizeDeviceAuthScopes。
  - `src/shared/net/ipv4.ts`: 20 行，imports=0，exports=validateIPv4AddressInput。
  - `src/shared/model-param-b.ts`: 20 行，imports=0，exports=inferParamBFromIdOrName。
  - `src/shared/entry-metadata.ts`: 19 行，imports=0，exports=resolveEmojiAndHomepage。
  - `src/shared/pid-alive.ts`: 12 行，imports=0，exports=isPidAlive。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 3 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 2 文件。涉及状态写入，需关注并发覆盖与回滚策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/shared` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

