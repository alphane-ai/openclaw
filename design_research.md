# OpenClaw 逐文件/逐模块深度研究执行清单

更新时间：2026-02-16

## 0. 使用说明（先读）

- [ ] 本清单只做研究，不做发布/版本变更。
- [ ] 勾选规则统一：只有“产物已落盘 + 证据可回溯到文件路径”才可打勾。
- [ ] 模块项勾选前提：该模块内文件覆盖率达到 100%。
- [ ] 若有“进行中”状态，在条目后加 `(进行中)`，不要提前打勾。
- [ ] 每天结束前更新进度统计：已完成文件数、剩余文件数、阻塞项。

## 1. 研究目标与完成定义（DoD）

- [ ] 每个代码文件都有研究记录（自动索引 + 人工结论）。
- [ ] 每个一级模块（`src/*`、`extensions/*`、`apps/*`、`packages/*`）都有模块报告。
- [ ] 每条消息通道（内置 + 扩展）都有“接入 -> 路由 -> 发送 -> 状态”闭环说明。
- [ ] 每个 CLI 命令都能追溯到实现文件、配置键、测试。
- [ ] 关键链路（启动、收消息、路由、模型调用、回包）都有调用图。
- [ ] 高风险项有复现证据与修复建议。

## 2. 研究产物目录初始化清单

- [ ] 创建 `research/inventory/`。
- [ ] 创建 `research/tracking/`。
- [ ] 创建 `research/flows/`。
- [ ] 创建 `research/architecture/`。
- [ ] 创建 `research/extensions/`。
- [ ] 创建 `research/consistency/`。
- [ ] 创建 `research/final/`。

## 3. 总执行看板（阶段勾选）

- [ ] 阶段 0：清单冻结与索引初始化。
- [ ] 阶段 1：运行入口与主链路（P0）。
- [ ] 阶段 2：内置通道全覆盖（P0）。
- [ ] 阶段 3：Agent 与工具链（P0）。
- [ ] 阶段 4：基础设施与跨切面（P1）。
- [ ] 阶段 5：媒体/模型/记忆/Provider（P1）。
- [ ] 阶段 6：扩展生态全覆盖（P1）。
- [ ] 阶段 7：客户端/脚本/测试/文档一致性（P2）。
- [ ] 阶段 8：复核与审计归档。

## 4. 阶段详细执行清单（优化版）

### 4.1 阶段 0：清单冻结与索引初始化

- [ ] 导出全仓文件清单到 `research/inventory/all-files.txt`。
- [ ] 导出 `src/` 文件清单到 `research/inventory/src-files.txt`。
- [ ] 导出 `extensions/` 文件清单到 `research/inventory/extensions-files.txt`。
- [ ] 导出 `apps/` 文件清单到 `research/inventory/apps-files.txt`。
- [ ] 导出 `packages/` 文件清单到 `research/inventory/packages-files.txt`。
- [ ] 建立 `research/tracking/files.todo.csv`（字段：`path,status,owner,reviewed_at,notes`）。
- [ ] 标注自动生成/资源文件（避免把图片等当成代码研究）。
- [ ] 输出 `research/inventory/manifest.md`（记录快照时间与统计口径）。

退出条件：

- [ ] 所有纳入目录均有文件列表。
- [ ] `files.todo.csv` 覆盖 `all-files.txt`。

### 4.2 阶段 1：运行入口与主链路（P0）

- [ ] 梳理 CLI 主入口与命令注册路径。
- [ ] 梳理 `gateway` 启动与 server-methods 分发路径。
- [ ] 梳理消息路由入口（`routing/channels/commands` 交汇点）。
- [ ] 输出启动链路图到 `research/flows/runtime-core.md`。
- [ ] 输出命令到实现映射表到 `research/flows/cli-command-map.md`。

退出条件：

- [ ] “启动 -> 命令 -> 网关 -> 路由 -> 通道”链路可单步追踪到文件。

### 4.3 阶段 2：内置通道全覆盖（P0）

- [ ] 建立内置通道统一对照模板（入口、发送、状态探测、错误处理）。
- [ ] 完成 `telegram` 通道研究卡。
- [ ] 完成 `discord` 通道研究卡。
- [ ] 完成 `slack` 通道研究卡。
- [ ] 完成 `signal` 通道研究卡。
- [ ] 完成 `imessage` 通道研究卡。
- [ ] 完成 `web` 通道研究卡。
- [ ] 完成 `whatsapp` 通道研究卡。
- [ ] 完成 `line` 通道研究卡。
- [ ] 输出 `research/flows/channels-core.md`（含差异矩阵）。

退出条件：

- [ ] 每个内置通道都可回答“如何接入、如何发、如何探活、失败如何退避”。

### 4.4 阶段 3：Agent 与工具链（P0）

- [ ] 梳理 `agents` 主运行路径（会话、工具调用、输出返回）。
- [ ] 梳理 `agents/tools`、`agents/skills`、`auto-reply` 交互关系。
- [ ] 梳理 `channels/plugins/agent-tools` 连接点。
- [ ] 输出 `research/flows/agent-runtime.md`。

退出条件：

- [ ] “消息 -> Agent -> Tool -> 回包”闭环具备文件级证据。

### 4.5 阶段 4：基础设施与跨切面（P1）

- [ ] 梳理配置系统（加载、覆盖、优先级、默认值）。
- [ ] 梳理进程/守护/定时任务生命周期。
- [ ] 梳理网络/TLS/安全边界。
- [ ] 梳理日志、状态输出、可观测性。
- [ ] 输出 `research/architecture/platform-foundation.md`。

退出条件：

- [ ] 每个跨切面能力都列出“入口 + 副作用 + 故障模式 + 可观测点”。

### 4.6 阶段 5：媒体/模型/记忆/Provider（P1）

- [ ] 梳理 `media` 与 `media-understanding` 调用链。
- [ ] 梳理各 provider 适配层与错误处理。
- [ ] 梳理 `memory` 读写链路与一致性风险。
- [ ] 梳理 `providers` 与模型选择策略。
- [ ] 输出 `research/architecture/model-media-memory.md`。

退出条件：

- [ ] 模型与媒体关键路径具备“成功流 + 失败流 + 回退流”描述。

### 4.7 阶段 6：扩展生态全覆盖（P1）

- [ ] 为每个插件生成 `research/extensions/<plugin>.md`。
- [ ] 每个插件都回答：加载方式、能力声明、配置键、依赖核心模块、测试情况。
- [ ] 输出扩展能力总矩阵 `research/extensions/_matrix.md`。
- [ ] 对通道型扩展与内置通道做冲突/重叠分析。

退出条件：

- [ ] `extensions/*` 每个目录均有研究页。

### 4.8 阶段 7：客户端/脚本/测试/文档一致性（P2）

- [ ] 梳理 `apps/android` 运行链路与构建关键点。
- [ ] 梳理 `apps/ios` 运行链路与状态管理关键点。
- [ ] 梳理 `apps/macos` 网关控制与日志关键点。
- [ ] 梳理 `apps/shared` 共享协议边界。
- [ ] 梳理 `ui` 前端与主系统交互边界。
- [ ] 梳理 `scripts` 与 CI/发布检查脚本。
- [ ] 完成代码与 docs 命令/配置一致性核查。
- [ ] 输出 `research/consistency/client-and-docs.md`。

退出条件：

- [ ] 客户端、脚本、文档之间无明显冲突项，或已登记差异。

### 4.9 阶段 8：复核与审计归档

- [ ] 运行漏项扫描（未打勾文件、未覆盖模块、未归档报告）。
- [ ] 对高风险条目执行二次复核。
- [ ] 汇总成最终报告 `research/final/openclaw-deep-research-report.md`。
- [ ] 给出优先修复建议（P0/P1/P2）。

退出条件：

- [ ] 文件覆盖率 100%。
- [ ] 所有高风险项都有证据与建议。

## 5. 模块执行清单（可直接打勾）

### 5.1 `src/` 模块清单

核心运行模块：

- [ ] `src/agents`
- [ ] `src/commands`
- [ ] `src/gateway`
- [ ] `src/infra`
- [ ] `src/auto-reply`
- [ ] `src/cli`
- [ ] `src/config`
- [ ] `src/channels`
- [ ] `src/telegram`
- [ ] `src/web`
- [ ] `src/discord`
- [ ] `src/slack`
- [ ] `src/cron`
- [ ] `src/daemon`
- [ ] `src/routing`
- [ ] `src/pairing`
- [ ] `src/sessions`

能力与支撑模块：

- [ ] `src/plugins`
- [ ] `src/media`
- [ ] `src/media-understanding`
- [ ] `src/memory`
- [ ] `src/providers`
- [ ] `src/hooks`
- [ ] `src/security`
- [ ] `src/process`
- [ ] `src/line`
- [ ] `src/signal`
- [ ] `src/imessage`
- [ ] `src/browser`
- [ ] `src/logging`
- [ ] `src/shared`
- [ ] `src/terminal`
- [ ] `src/plugin-sdk`
- [ ] `src/acp`
- [ ] `src/tui`
- [ ] `src/wizard`
- [ ] `src/markdown`
- [ ] `src/types`
- [ ] `src/node-host`
- [ ] `src/canvas-host`
- [ ] `src/tts`
- [ ] `src/macos`
- [ ] `src/whatsapp`
- [ ] `src/test-helpers`
- [ ] `src/test-utils`
- [ ] `src/link-understanding`
- [ ] `src/compat`
- [ ] `src/docs`
- [ ] `src/scripts`

`src/` 根级单文件与测试入口：

- [ ] `src/entry.ts`
- [ ] `src/index.ts`
- [ ] `src/runtime.ts`
- [ ] `src/extensionAPI.ts`
- [ ] `src/channel-web.ts`
- [ ] `src/globals.ts`
- [ ] `src/logging.ts`
- [ ] `src/logger.ts`
- [ ] `src/logger.test.ts`
- [ ] `src/polls.ts`
- [ ] `src/polls.test.ts`
- [ ] `src/utils.ts`
- [ ] `src/utils.test.ts`
- [ ] `src/version.ts`
- [ ] `src/version.test.ts`
- [ ] `src/docker-setup.test.ts`

### 5.2 `extensions/` 插件清单

通道扩展：

- [ ] `extensions/matrix`
- [ ] `extensions/msteams`
- [ ] `extensions/feishu`
- [ ] `extensions/voice-call`
- [ ] `extensions/twitch`
- [ ] `extensions/nostr`
- [ ] `extensions/irc`
- [ ] `extensions/mattermost`
- [ ] `extensions/zalo`
- [ ] `extensions/zalouser`
- [ ] `extensions/nextcloud-talk`
- [ ] `extensions/googlechat`
- [ ] `extensions/line`
- [ ] `extensions/whatsapp`
- [ ] `extensions/telegram`
- [ ] `extensions/slack`
- [ ] `extensions/signal`
- [ ] `extensions/imessage`
- [ ] `extensions/discord`
- [ ] `extensions/bluebubbles`
- [ ] `extensions/tlon`

能力扩展：

- [ ] `extensions/open-prose`
- [ ] `extensions/lobster`
- [ ] `extensions/llm-task`
- [ ] `extensions/memory-core`
- [ ] `extensions/memory-lancedb`
- [ ] `extensions/thread-ownership`
- [ ] `extensions/talk-voice`
- [ ] `extensions/phone-control`
- [ ] `extensions/device-pair`

鉴权/接入/观测扩展：

- [ ] `extensions/google-gemini-cli-auth`
- [ ] `extensions/google-antigravity-auth`
- [ ] `extensions/qwen-portal-auth`
- [ ] `extensions/minimax-portal-auth`
- [ ] `extensions/copilot-proxy`
- [ ] `extensions/diagnostics-otel`

### 5.3 客户端、包与其余目录清单

- [ ] `apps/android`
- [ ] `apps/ios`
- [ ] `apps/macos`
- [ ] `apps/shared`
- [ ] `packages/clawdbot`
- [ ] `packages/moltbot`
- [ ] `ui`
- [ ] `scripts`
- [ ] `test`
- [ ] `docs`（英文主文档）
- [ ] `docs/zh-CN`（仅一致性检查）

## 6. 文件级研究卡模板（每个文件一条）

将以下模板写入 `research/tracking/file-cards/<path>.md`：

```md
- path:
- type: (entry/module/test/doc/script/config)
- primary_responsibility:
- exports_or_commands:
- inbound_dependencies:
- outbound_dependencies:
- runtime_side_effects: (io/network/fs/env/process)
- config_keys_or_env:
- channel_or_provider_scope:
- test_coverage_links:
- risk_level: (low/medium/high)
- evidence:
- notes:
```

文件卡完成勾选条件：

- [ ] 字段填写完整。
- [ ] 至少 1 条可回溯证据（文件路径 + 搜索命令或调用点）。
- [ ] 风险等级明确且有理由。

## 7. 每日执行节奏清单（优化版）

开工前（15 分钟）：

- [ ] 同步当前进度与阻塞项。
- [ ] 选定当日批次（建议 150-250 文件或 2-4 模块）。
- [ ] 确认今日产物文件名。

执行中（每 90 分钟）：

- [ ] 更新 `files.todo.csv` 状态。
- [ ] 抽样复查 10 条文件卡，防止机械填充。
- [ ] 记录新发现的跨模块依赖。

收工前（20 分钟）：

- [ ] 更新阶段看板勾选状态。
- [ ] 输出当日总结到 `research/tracking/daily-YYYY-MM-DD.md`。
- [ ] 列出次日优先级与风险。

## 8. 自动化命令清单

```bash
# 全仓索引
rg --files > research/inventory/all-files.txt

# 分目录索引
rg --files src > research/inventory/src-files.txt
rg --files extensions > research/inventory/extensions-files.txt
rg --files apps > research/inventory/apps-files.txt
rg --files packages > research/inventory/packages-files.txt

# 一级目录统计
rg --files src | awk -F/ 'NF>=2{print $2}' | sort | uniq -c | sort -nr
rg --files extensions | awk -F/ 'NF>=2{print $2}' | sort | uniq -c | sort -nr

# 入口/注册点
rg "(main\(|create.*Deps|program\.command|register|bootstrap|init|run\()" src

# 配置与环境变量
rg "(process\.env|config set|OPENCLAW_|CLAWDBOT_)" src extensions apps

# 测试映射
rg --files src extensions apps | rg "\.test\.ts$|\.e2e\.test\.ts$"
```

## 9. 质量闸门清单

- [ ] 覆盖率闸门：阶段内文件覆盖率 >= 95%，最终 100%。
- [ ] 可追溯闸门：每条结论能链接到文件证据。
- [ ] 一致性闸门：代码行为与 docs/CLI 帮助文本一致。
- [ ] 风险闸门：高风险项有复现建议或验证步骤。
- [ ] 复核闸门：每阶段至少一次同伴复核或隔日自复核。

## 10. 风险与应对清单

- [ ] 风险：动态加载导致静态漏链路。应对：静态图 + 运行证据双轨验证。
- [ ] 风险：插件与内置通道重叠。应对：统一能力矩阵逐项比对。
- [ ] 风险：大目录推进失控。应对：按 P0/P1/P2 分层推进 + 每日封账。
- [ ] 风险：文档滞后。应对：阶段 7 做代码/文档一致性专项检查。

## 11. 最终交付清单

- [ ] `research/inventory/all-files.txt`
- [ ] `research/inventory/manifest.md`
- [ ] `research/tracking/files.todo.csv`
- [ ] `research/flows/runtime-core.md`
- [ ] `research/flows/cli-command-map.md`
- [ ] `research/flows/channels-core.md`
- [ ] `research/flows/agent-runtime.md`
- [ ] `research/architecture/platform-foundation.md`
- [ ] `research/architecture/model-media-memory.md`
- [ ] `research/extensions/_matrix.md`
- [ ] `research/extensions/*.md`（每插件一页）
- [ ] `research/consistency/client-and-docs.md`
- [ ] `research/final/openclaw-deep-research-report.md`

