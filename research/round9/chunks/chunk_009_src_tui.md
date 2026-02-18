# chunk_009_src_tui 研究笔记

## 1. 覆盖确认
- 清单文件数：102
- 实际可读文件数：102
- 缺失/不可读文件数：0
- 主目录组：`src/utils, src/tui, src/wizard, src/types`
- 代码总行数（近似）：10698

## 2. 模块要点
- 文件类型分布：module=72，test=26，doc=0，config=4。
- 导入语句总数（近似）：260。
- 重点文件（按行数）与导出摘要：
  - `src/tui/tui.ts`: 821 行，imports=17，exports=createEditorSubmitHandler, shouldEnableWindowsGitBashPasteFallback, createSubmitBurstCoalescer, resolveTuiSessionKey, runTui。
  - `src/wizard/onboarding.finalize.ts`: 478 行，imports=21，exports=finalizeOnboardingWizard。
  - `src/wizard/onboarding.ts`: 468 行，imports=9，exports=runOnboardingWizard。
  - `test/gateway.multi.e2e.test.ts`: 429 行，imports=12，exports=无显式导出。
  - `src/tui/tui-session-actions.ts`: 413 行，imports=7，exports=createSessionActions。
  - `src/utils.ts`: 402 行，imports=6，exports=ensureDir, pathExists, clampNumber, clampInt, clamp, escapeRegExp。
  - `src/wizard/onboarding.test.ts`: 392 行，imports=8，exports=无显式导出。
  - `src/tui/tui-formatters.ts`: 335 行，imports=3，exports=sanitizeRenderableText, resolveFinalAssistantText, composeThinkingAndContent, extractThinkingFromMessage, extractContentFromMessage, extractTextFromMessage。
  - `test/provider-timeout.e2e.test.ts`: 311 行，imports=9，exports=无显式导出。
  - `src/tui/tui-event-handlers.ts`: 286 行，imports=5，exports=createEventHandlers。
  - `src/wizard/session.ts`: 265 行，imports=2，exports=WizardStepOption, WizardStep, WizardSessionStatus, WizardNextResult, WizardSession。
  - `src/wizard/onboarding.gateway-config.ts`: 253 行，imports=9，exports=configureGatewayForOnboarding。
  - `src/tui/tui-stream-assembler.test.ts`: 229 行，imports=2，exports=无显式导出。
  - `src/utils.test.ts`: 226 行，imports=5，exports=无显式导出。
  - `src/tui/tui.submit-handler.test.ts`: 192 行，imports=2，exports=无显式导出。
  - `test/setup.ts`: 190 行，imports=5，exports=无显式导出。
  - `src/tui/tui-formatters.test.ts`: 187 行，imports=2，exports=无显式导出。
  - `src/tui/tui-stream-assembler.ts`: 175 行，imports=1，exports=TuiStreamAssembler。
  - `test/media-understanding.auto.e2e.test.ts`: 166 行，imports=8，exports=无显式导出。
  - `src/tui/tui-input-history.test.ts`: 160 行，imports=2，exports=无显式导出。

## 3. 关键调用链
- chunk 内本地依赖边（Top 20）：
  - `test/global-setup.ts` -> `test/test-env.ts`

## 4. 风险
- secrets: 命中 30 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 25 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 7 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 6 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 5 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/utils, src/tui, src/wizard, src/types, test/fixtures, test/helpers` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

