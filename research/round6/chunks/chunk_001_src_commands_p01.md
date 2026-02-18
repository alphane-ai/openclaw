# chunk_001_src_commands_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：75
- 实际可读文件数：75
- 缺失/不可读文件数：0
- 主目录组：`src/commands`
- 代码总行数（近似）：12802

## 2. 模块要点
- 文件类型分布：module=58，test=17，doc=0，config=0。
- 导入语句总数（近似）：507。
- 重点文件（按行数）与导出摘要：
  - `src/commands/auth-choice.e2e.test.ts`: 1314 行，imports=10，exports=无显式导出。
  - `src/commands/auth-choice.apply.api-providers.ts`: 965 行，imports=11，exports=applyAuthChoiceApiProviders。
  - `src/commands/agent.ts`: 643 行，imports=33，exports=agentCommand。
  - `src/commands/channels/capabilities.ts`: 557 行，imports=11，exports=ChannelsCapabilitiesOptions, channelsCapabilitiesCommand。
  - `src/commands/channels.adds-non-default-telegram-account.e2e.test.ts`: 491 行，imports=11，exports=无显式导出。
  - `src/commands/agent.e2e.test.ts`: 485 行，imports=16，exports=无显式导出。
  - `src/commands/agents.commands.add.ts`: 368 行，imports=21，exports=agentsAddCommand。
  - `src/commands/auth-choice-options.ts`: 359 行，imports=3，exports=AuthChoiceOption, AuthChoiceGroup, formatAuthChoiceChoicesForCli, buildAuthChoiceOptions, buildAuthChoiceGroups。
  - `src/commands/agent.delivery.e2e.test.ts`: 301 行，imports=5，exports=无显式导出。
  - `src/commands/channels/status.ts`: 286 行，imports=13，exports=ChannelsStatusOptions, formatGatewayChannelsStatusLines, channelsStatusCommand。
  - `src/commands/agents.identity.e2e.test.ts`: 260 行，imports=6，exports=无显式导出。
  - `src/commands/agents.commands.identity.ts`: 234 行，imports=14，exports=agentsSetIdentityCommand。
  - `src/commands/channels/add.ts`: 222 行，imports=13，exports=ChannelsAddOptions, channelsAddCommand。
  - `src/commands/chutes-oauth.ts`: 218 行，imports=6，exports=loginChutes。
  - `src/commands/agents.config.ts`: 217 行，imports=5，exports=AgentSummary, AgentIdentity, listAgentEntries, findAgentEntryIndex, parseIdentityMarkdown, loadAgentIdentity。
  - `src/commands/configure.gateway-auth.e2e.test.ts`: 211 行，imports=2，exports=无显式导出。
  - `src/commands/agent/session.test.ts`: 210 行，imports=2，exports=无显式导出。
  - `src/commands/agent/delivery.ts`: 206 行，imports=13，exports=deliverAgentCommandResult。
  - `src/commands/agent-via-gateway.ts`: 197 行，imports=12，exports=AgentCliOpts, agentViaGatewayCommand, agentCliCommand。
  - `src/commands/auth-choice-options.e2e.test.ts`: 193 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- secrets: 命中 37 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 21 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 7 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/commands` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

