# chunk_008_src_agents_p07 研究笔记

## 1. 覆盖确认
- 清单文件数：52
- 实际可读文件数：52
- 缺失/不可读文件数：0
- 主目录组：`src/agents`
- 代码总行数（近似）：12368

## 2. 模块要点
- 文件类型分布：module=33，test=18，doc=0，config=1。
- 导入语句总数（近似）：267。
- 重点文件（按行数）与导出摘要：
  - `src/agents/tools/browser-tool.ts`: 829 行，imports=13，exports=createBrowserTool。
  - `src/agents/tools/discord-actions.e2e.test.ts`: 599 行，imports=5，exports=无显式导出。
  - `src/agents/tools/message-tool.ts`: 593 行，imports=18，exports=createMessageTool。
  - `src/agents/tools/image-tool.e2e.test.ts`: 573 行，imports=8，exports=无显式导出。
  - `src/agents/tools/image-tool.ts`: 569 行，imports=18，exports=__testing, resolveImageModelConfigForTool, createImageTool。
  - `src/agents/tools/nodes-tool.ts`: 563 行，imports=15，exports=createNodesTool。
  - `src/agents/tools/discord-actions-messaging.ts`: 523 行，imports=9，exports=handleDiscordMessagingAction。
  - `src/agents/tools/discord-actions-guild.ts`: 519 行，imports=5，exports=handleDiscordGuildAction。
  - `src/agents/tools/cron-tool.e2e.test.ts`: 504 行，imports=2，exports=无显式导出。
  - `src/agents/tools/session-status-tool.ts`: 475 行，imports=20，exports=createSessionStatusTool。
  - `src/agents/tools/cron-tool.ts`: 466 行，imports=13，exports=createCronTool。
  - `src/agents/tools/browser-tool.e2e.test.ts`: 429 行，imports=3，exports=无显式导出。
  - `src/agents/tool-display.json`: 317 行，imports=0，exports=无显式导出。
  - `src/agents/tool-policy.ts`: 304 行，imports=1，exports=ToolProfileId, TOOL_GROUPS, normalizeToolName, isOwnerOnlyToolName, applyOwnerOnlyToolPolicy, normalizeToolList。
  - `src/agents/tools/message-tool.e2e.test.ts`: 293 行，imports=6，exports=无显式导出。
  - `src/agents/tool-call-id.ts`: 269 行，imports=2，exports=ToolCallIdMode, ToolCallLike, sanitizeToolCallId, extractToolCallsFromAssistant, extractToolResultId, isValidCloudCodeAssistToolId。
  - `src/agents/tool-call-id.e2e.test.ts`: 268 行，imports=3，exports=无显式导出。
  - `src/agents/tools/common.ts`: 253 行，imports=4，exports=AnyAgentTool, StringParamOptions, ActionGate, ToolInputError, createActionGate, readStringParam。
  - `src/agents/tools/gateway-tool.ts`: 229 行，imports=9，exports=createGatewayTool。
  - `src/agents/tool-images.ts`: 224 行，imports=4，exports=sanitizeContentBlocksImages, sanitizeImageBlocks, sanitizeToolResultImages。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 15 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- secrets: 命中 14 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- network: 命中 11 文件。涉及网络请求/连接，需要关注超时与重试策略。
- command_exec: 命中 8 文件。涉及命令执行链路，需要关注注入与参数转义。
- fs_delete: 命中 2 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/agents` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

