# chunk_006_src_agents_p05 研究笔记

## 1. 覆盖确认
- 清单文件数：82
- 实际可读文件数：82
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：13072

## 2. 模块要点
- 文件类型分布：module=51，test=31，doc=0，config=0。
- 导入语句总数（近似）：345。
- 重点文件（按行数）与导出摘要：
  - `src/agents/pi-tools-agent-config.e2e.test.ts`: 694 行，imports=9，exports=无显式导出。
  - `src/agents/pi-extensions/context-pruning.e2e.test.ts`: 526 行，imports=5，exports=无显式导出。
  - `src/agents/sandbox-agent-config.agent-specific-sandbox-config.e2e.test.ts`: 525 行，imports=5，exports=无显式导出。
  - `src/agents/pi-tools.create-openclaw-coding-tools.adds-claude-style-aliases-schemas-without-dropping.e2e.test.ts`: 517 行，imports=11，exports=无显式导出。
  - `src/agents/pi-tools.ts`: 465 行，imports=23，exports=__testing, createOpenClawCodingTools。
  - `src/agents/sandbox/docker.ts`: 456 行，imports=9，exports=ExecDockerRawResult, execDockerRaw, ExecDockerOptions, execDocker, readDockerContainerLabel, readDockerPort。
  - `src/agents/pi-embedded-utils.ts`: 431 行，imports=5，exports=isAssistantMessage, stripMinimaxToolCallXml, stripDowngradedToolCallText, stripThinkingTagsFromText, extractAssistantText, extractAssistantThinking。
  - `src/agents/pi-tools.read.ts`: 417 行，imports=8，exports=CLAUDE_PARAM_GROUPS, normalizeToolParams, patchToolSchemaForClaudeCompatibility, assertRequiredParams, wrapToolParamNormalization, wrapToolWorkspaceRootGuard。
  - `src/agents/schema/clean-for-gemini.ts`: 356 行，imports=0，exports=GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS, cleanSchemaForGemini。
  - `src/agents/pi-extensions/compaction-safeguard.ts`: 347 行，imports=4，exports=__testing。
  - `src/agents/pi-extensions/context-pruning/pruner.ts`: 347 行，imports=5，exports=pruneContextMessages。
  - `src/agents/sandbox/browser.ts`: 327 行，imports=14，exports=ensureSandboxBrowser。
  - `src/agents/pi-tools.policy.ts`: 325 行，imports=10，exports=resolveSubagentToolPolicy, isToolAllowedByPolicyName, filterToolsByPolicy, resolveEffectiveToolPolicy, resolveGroupToolPolicy, isToolAllowedByPolicies。
  - `src/agents/pty-keys.ts`: 292 行，imports=1，exports=BRACKETED_PASTE_START, BRACKETED_PASTE_END, KeyEncodingRequest, KeyEncodingResult, encodeKeySequence, encodePaste。
  - `src/agents/sandbox-create-args.e2e.test.ts`: 271 行，imports=2，exports=无显式导出。
  - `src/agents/pi-extensions/compaction-safeguard.e2e.test.ts`: 252 行，imports=4，exports=无显式导出。
  - `src/agents/sandbox/fs-bridge.ts`: 248 行，imports=3，exports=SandboxResolvedPath, SandboxFsStat, SandboxFsBridge, createSandboxFsBridge。
  - `src/agents/sandbox/fs-paths.ts`: 232 行，imports=4，exports=SandboxFsMount, SandboxResolvedFsPath, parseSandboxBindMount, buildSandboxFsMounts, resolveSandboxFsPathWithMounts。
  - `src/agents/pi-tool-definition-adapter.ts`: 230 行，imports=9，exports=toToolDefinitions, toClientToolDefinitions。
  - `src/agents/pi-tools.workspace-paths.e2e.test.ts`: 218 行，imports=6，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 27 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 20 文件。涉及命令执行链路，需要关注注入与参数转义。
- secrets: 命中 18 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- fs_delete: 命中 8 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

