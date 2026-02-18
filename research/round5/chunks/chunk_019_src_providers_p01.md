# chunk_019_src_providers_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：9
- 实际可读文件数：9
- 缺失/不可读文件数：0
- 主目录组：`src/providers`
- 代码总行数（近似）：1041

## 2. 模块要点
- 文件类型分布：module=5，test=4，doc=0，config=0。
- 导入语句总数（近似）：27。
- 重点文件（按行数）与导出摘要：
  - `src/providers/google-shared.preserves-parameters-type-is-missing.test.ts`: 285 行，imports=4，exports=无显式导出。
  - `src/providers/github-copilot-auth.ts`: 185 行，imports=7，exports=githubCopilotLoginCommand。
  - `src/providers/github-copilot-token.ts`: 138 行，imports=3，exports=CachedCopilotToken, DEFAULT_COPILOT_API_BASE_URL, deriveCopilotApiBaseUrlFromToken, resolveCopilotApiToken。
  - `src/providers/google-shared.test-helpers.ts`: 93 行，imports=2，exports=asRecord, getFirstToolParameters, makeModel, makeGeminiCliModel, makeGoogleAssistantMessage, makeGeminiCliAssistantMessage。
  - `src/providers/google-shared.ensures-function-call-comes-after-user-turn.test.ts`: 89 行，imports=4，exports=无显式导出。
  - `src/providers/qwen-portal-oauth.test.ts`: 78 行，imports=2，exports=无显式导出。
  - `src/providers/github-copilot-token.test.ts`: 76 行，imports=2，exports=无显式导出。
  - `src/providers/qwen-portal-oauth.ts`: 55 行，imports=2，exports=refreshQwenPortalCredentials。
  - `src/providers/github-copilot-models.ts`: 42 行，imports=1，exports=getDefaultCopilotModelIds, buildCopilotModelDefinition。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 7 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 5 文件。涉及网络请求/连接，需要关注超时与重试策略。
- state_write: 命中 3 文件。涉及状态写入，需关注并发覆盖与回滚策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/providers` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

