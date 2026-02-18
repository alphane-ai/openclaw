# chunk_003_src_commands_p03 研究笔记

## 1. 覆盖确认
- 清单文件数：74
- 实际可读文件数：74
- 缺失/不可读文件数：0
- 主目录组：`src/commands`
- 代码总行数（近似）：13095

## 2. 模块要点
- 文件类型分布：module=57，test=17，doc=0，config=0。
- 导入语句总数（近似）：404。
- 重点文件（按行数）与导出摘要：
  - `src/commands/onboard-non-interactive.provider-auth.e2e.test.ts`: 761 行，imports=8，exports=无显式导出。
  - `src/commands/onboard-non-interactive/local/auth-choice.ts`: 739 行，imports=16，exports=applyNonInteractiveAuthChoice。
  - `src/commands/models/list.status-command.ts`: 692 行，imports=20，exports=modelsStatusCommand。
  - `src/commands/onboard-channels.ts`: 680 行，imports=19，exports=noteChannelStatus, setupChannels。
  - `src/commands/onboard-custom.ts`: 658 行，imports=9，exports=CustomApiCompatibility, CustomApiResult, ApplyCustomApiConfigParams, ParseNonInteractiveCustomApiFlagsParams, ParsedNonInteractiveCustomApiFlags, CustomApiErrorCode。
  - `src/commands/onboard-auth.e2e.test.ts`: 590 行，imports=7，exports=无显式导出。
  - `src/commands/onboard-auth.config-core.ts`: 487 行，imports=10，exports=applyZaiProviderConfig, applyZaiConfig, applyOpenrouterProviderConfig, applyOpenrouterConfig, applyMoonshotProviderConfig, applyMoonshotProviderConfigCn。
  - `src/commands/onboard-helpers.ts`: 487 行，imports=22，exports=guardCancel, summarizeExistingConfig, randomToken, normalizeGatewayTokenInput, validateGatewayPasswordInput, printWizardHeader。
  - `src/commands/models/scan.ts`: 375 行，imports=9，exports=modelsScanCommand。
  - `src/commands/onboard-custom.e2e.test.ts`: 347 行，imports=3，exports=无显式导出。
  - `src/commands/sandbox-explain.ts`: 338 行，imports=11，exports=sandboxExplainCommand。
  - `src/commands/sandbox.e2e.test.ts`: 328 行，imports=3，exports=无显式导出。
  - `src/commands/onboard-non-interactive.gateway.e2e.test.ts`: 287 行，imports=6，exports=无显式导出。
  - `src/commands/onboard-auth.credentials.ts`: 277 行，imports=3，exports=writeOAuthCredentials, setAnthropicApiKey, setGeminiApiKey, setMinimaxApiKey, setMoonshotApiKey, setKimiCodingApiKey。
  - `src/commands/openai-model-default.e2e.test.ts`: 259 行，imports=8，exports=无显式导出。
  - `src/commands/models/list.status.e2e.test.ts`: 250 行，imports=2，exports=无显式导出。
  - `src/commands/onboard-hooks.e2e.test.ts`: 246 行，imports=6，exports=无显式导出。
  - `src/commands/onboard-auth.config-minimax.ts`: 245 行，imports=4，exports=applyMinimaxProviderConfig, applyMinimaxHostedProviderConfig, applyMinimaxConfig, applyMinimaxHostedConfig, applyMinimaxApiProviderConfig, applyMinimaxApiConfig。
  - `src/commands/onboard-channels.e2e.test.ts`: 234 行，imports=13，exports=无显式导出。
  - `src/commands/onboard-skills.ts`: 223 行，imports=8，exports=setupSkills。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 38 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 25 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 6 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 3 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/commands` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

