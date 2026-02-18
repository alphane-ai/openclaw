1) 覆盖确认
- 80 个文件已覆盖。
- 覆盖清单（按子域分组，合计 80）：
  - CLI 基础与通用：`src/cli/acp-cli.ts`、`src/cli/argv.test.ts`、`src/cli/argv.ts`、`src/cli/banner.ts`、`src/cli/cli-name.ts`、`src/cli/cli-utils.test.ts`、`src/cli/cli-utils.ts`、`src/cli/command-format.ts`、`src/cli/command-options.ts`、`src/cli/completion-cli.ts`、`src/cli/deps.test.ts`、`src/cli/deps.ts`、`src/cli/docs-cli.ts`、`src/cli/gateway-rpc.ts`。
  - Browser CLI：`src/cli/browser-cli.ts`、`src/cli/browser-cli.test.ts`、`src/cli/browser-cli-shared.ts`、`src/cli/browser-cli-manage.ts`、`src/cli/browser-cli-inspect.ts`、`src/cli/browser-cli-inspect.test.ts`、`src/cli/browser-cli-debug.ts`、`src/cli/browser-cli-actions-observe.ts`、`src/cli/browser-cli-actions-input.ts`、`src/cli/browser-cli-actions-input/register.ts`、`src/cli/browser-cli-actions-input/shared.ts`、`src/cli/browser-cli-actions-input/register.element.ts`、`src/cli/browser-cli-actions-input/register.files-downloads.ts`、`src/cli/browser-cli-actions-input/register.form-wait-eval.ts`、`src/cli/browser-cli-actions-input/register.navigation.ts`、`src/cli/browser-cli-state.ts`、`src/cli/browser-cli-state.cookies-storage.ts`、`src/cli/browser-cli-resize.ts`、`src/cli/browser-cli-examples.ts`、`src/cli/browser-cli-extension.ts`、`src/cli/browser-cli-extension.test.ts`。
  - Channel/Directory/Devices/DNS：`src/cli/channel-auth.ts`、`src/cli/channel-options.ts`、`src/cli/channels-cli.ts`、`src/cli/devices-cli.ts`、`src/cli/directory-cli.ts`、`src/cli/dns-cli.ts`。
  - Config/Cron：`src/cli/config-cli.ts`、`src/cli/config-cli.test.ts`、`src/cli/cron-cli.ts`、`src/cli/cron-cli/register.ts`、`src/cli/cron-cli/register.cron-add.ts`、`src/cli/cron-cli/register.cron-edit.ts`、`src/cli/cron-cli/register.cron-simple.ts`、`src/cli/cron-cli/shared.ts`、`src/cli/cron-cli.test.ts`、`src/cli/cron-cli/shared.test.ts`。
  - Daemon CLI：`src/cli/daemon-cli.ts`、`src/cli/daemon-cli/register.ts`、`src/cli/daemon-cli/register-service-commands.ts`、`src/cli/daemon-cli/install.ts`、`src/cli/daemon-cli/lifecycle.ts`、`src/cli/daemon-cli/lifecycle-core.ts`、`src/cli/daemon-cli/probe.ts`、`src/cli/daemon-cli/response.ts`、`src/cli/daemon-cli/runners.ts`、`src/cli/daemon-cli/shared.ts`、`src/cli/daemon-cli/status.ts`、`src/cli/daemon-cli/status.gather.ts`、`src/cli/daemon-cli/status.print.ts`、`src/cli/daemon-cli/types.ts`、`src/cli/daemon-cli-compat.ts`、`src/cli/daemon-cli-compat.test.ts`、`src/cli/daemon-cli.coverage.e2e.test.ts`。
  - Gateway CLI：`src/cli/gateway-cli.ts`、`src/cli/gateway-cli/register.ts`、`src/cli/gateway-cli/call.ts`、`src/cli/gateway-cli/dev.ts`、`src/cli/gateway-cli/discover.ts`、`src/cli/gateway-cli/run.ts`、`src/cli/gateway-cli/run-loop.ts`、`src/cli/gateway-cli/run-loop.test.ts`、`src/cli/gateway-cli/shared.ts`、`src/cli/gateway-cli.coverage.e2e.test.ts`。
  - Exec approvals：`src/cli/exec-approvals-cli.ts`、`src/cli/exec-approvals-cli.test.ts`。

2) 模块要点
- CLI 入口通用层：
  - `argv.ts` 负责参数探测（help/version/verbose/flag value）、主命令路径推导、Node/Bun 启动参数归一化、状态迁移开关判定；`argv.test.ts` 覆盖这些边界。
  - `banner.ts` 提供 logo 文案、TTY/Rich 输出和彩色 ASCII；在 `--json`/`--version` 等场景抑制横幅。
  - `cli-name.ts` + `command-format.ts` 保证命令展示与实际二进制名一致，并在必要时自动补 `--profile`。
  - `cli-utils.ts` 抽象 `runCommandWithRuntime`/`withManager`，统一错误出口与资源释放；`cli-utils.test.ts` 校验关闭流程与错误分支。
  - `completion-cli.ts` 是完整补全子系统：脚本生成（zsh/bash/powershell/fish）、缓存落盘、profile 注入、慢动态补全检测与迁移。
  - `deps.ts` 使用动态 import 组装多渠道 outbound 发送依赖映射，避免 CLI 冷启动加载全部渠道实现；`deps.test.ts` 校验映射行为。
  - `acp-cli.ts` 挂载 ACP bridge/client 双路径，支持会话、URL、token、password、cwd 等参数。
  - `docs-cli.ts` 走 docs 搜索命令并复用 runtime 错误模型。

- Browser CLI 模块化很完整：
  - `browser-cli.ts` 是聚合层，挂载 manage/inspect/action/observe/debug/state/extension，并把 gateway 连接参数注入父命令。
  - `browser-cli-manage.ts` 覆盖状态、启停、tabs、target 级别 focus/close、profile 增删查改。
  - `browser-cli-inspect.ts` 覆盖 screenshot/snapshot，支持 ai/aria 两种格式、标签图、输出到文件。
  - `browser-cli-actions-input/*` 拆分为 navigation、element、files/downloads、form/wait/eval，统一经 `callBrowserAct` 触发 `/act`。
  - `browser-cli-actions-observe.ts` 提供 console/pdf/responsebody 观测。
  - `browser-cli-debug.ts` 提供 highlight/errors/requests/trace start-stop。
  - `browser-cli-state.ts` + `browser-cli-state.cookies-storage.ts` 负责 cookies/storage 与环境模拟（offline/headers/credentials/geo/media/timezone/locale/device/viewport）。
  - `browser-cli-extension.ts` 提供扩展安装与路径查询，支持复制路径和提示文档；`browser-cli-extension.test.ts` 覆盖安装路径与 manifest 相关行为。
  - `browser-cli-resize.ts` 和 `browser-cli-shared.ts` 是跨命令公共调用层；`browser-cli.test.ts`、`browser-cli-inspect.test.ts` 提供命令装配与输出行为回归。

- Channels / Directory / Devices / DNS：
  - `channels-cli.ts` 对应 list/status/capabilities/resolve/logs/add/remove/login/logout，结合 `hasExplicitOptions` 区分显式 CLI 覆盖。
  - `channel-auth.ts` 只做 auth 登录登出流程，不直接改 channel 配置，默认账号由插件 helper 决定。
  - `channel-options.ts` 合并 core channel 顺序与插件 catalog，支持 `OPENCLAW_EAGER_CHANNEL_OPTIONS` 触发 eager 加载。
  - `devices-cli.ts` 提供设备配对审批与 token rotate/revoke，并带表格输出与 age 展示。
  - `directory-cli.ts` 面向插件目录能力（self/peers/groups/members）统一做 channel/account 解析。
  - `dns-cli.ts` 针对 Wide-Area DNS-SD 提供 setup，引导配置并在 `--apply` 下执行 CoreDNS 安装/写入/重启。

- Config/Cron：
  - `config-cli.ts` 支持 get/set/unset 与 wizard 分支，路径解析支持 dot+bracket+转义，value 支持 JSON5；写入基于 `snapshot.resolved`（避免 runtime defaults 回写污染），`config-cli.test.ts` 覆盖 #6070 等路径。
  - `cron-cli/register*.ts` 完整拆分 status/list/add/edit/simple 子命令：
    - add：调度（三选一 at/every/cron）、payload（二选一 system-event/message）、session 与 delivery 约束、agent/wake/timeout/model/thinking。
    - edit：patch 语义，冲突检查（enable/disable、announce/no-deliver、agent/clear-agent、schedule 互斥等）。
    - simple：rm/enable/disable/runs/run 快捷入口。
  - `cron-cli/shared.ts` 提供 duration/at 解析、scheduler disabled 警告、表格化 list 展示；`cron-cli.test.ts` 和 `shared.test.ts` 验证 trimming、delivery patch、session 推断、undefined sessionTarget 兼容。

- Daemon CLI：
  - `daemon-cli.ts`/`register.ts` 负责对外导出与命令根挂载。
  - `register-service-commands.ts` 提供 service 生命周期命令统一注册。
  - `install.ts`、`lifecycle-core.ts`、`lifecycle.ts` 构成 install/uninstall/start/stop/restart 的执行主链。
  - `probe.ts`、`status.gather.ts`、`status.print.ts`、`status.ts` 形成状态采集与展示双层（JSON/人类可读）实现。
  - `response.ts` 负责 daemon action 的 JSON 输出封装、上下文写入器与安装时输出一致性。
  - `shared.ts` 提供端口/地址/env 过滤、hint 渲染、probe host 选择等公共逻辑。
  - `daemon-cli-compat.ts` 处理 legacy bundle export 兼容访问；`types.ts` 定义 RPC/lifecycle/status 类型；`runners.ts` 做入口重导出。
  - `daemon-cli-compat.test.ts`、`daemon-cli.coverage.e2e.test.ts` 负责兼容性与主流程覆盖回归。

- Gateway CLI：
  - `gateway-cli/register.ts` 是命令入口聚合，挂载 run/call/usage-cost/health/probe/discover 等。
  - `gateway-cli/run.ts` 与 `run-loop.ts` 负责前台运行、信号处理、重启循环、生命周期控制；`run-loop.test.ts` 覆盖信号监听清理等行为。
  - `gateway-cli/call.ts` 是直连 RPC 的命令层封装。
  - `gateway-cli/discover.ts` 提供 beacon host/port 选择、去重、展示。
  - `gateway-cli/dev.ts` 负责 dev 模式配置整理。
  - `gateway-cli/shared.ts` 包含错误描述、配置误键提取、停止服务提示等公共辅助。
  - `gateway-cli.coverage.e2e.test.ts` 覆盖运行路径；`gateway-cli.ts` 作为 re-export 入口。

- Exec approvals：
  - `exec-approvals-cli.ts` 管理本地/节点审批快照（get/set/allowlist add/remove），包含 agent key 归一化、allowlist 归一化、CLI 错误格式化与渲染；`exec-approvals-cli.test.ts` 覆盖读写与命令行为。

3) 关键调用链
- Browser 命令链：
  - `registerBrowserCli` 注入 `addGatewayClientOptions`。
  - 子命令通过 `callBrowserRequest`/`callBrowserAct` 统一转发到 `callGatewayFromCli("browser.request", ...)`。
  - gateway 层再调用 `callGateway`，最终进入 Gateway WebSocket RPC。

- Cron 写入链：
  - `cron add/edit/*` 在 CLI 层完成 schedule/payload/delivery/session 约束校验与 patch 组装。
  - 通过 `callGatewayFromCli("cron.add"|"cron.update"|...)` 下发。
  - 提交后调用 `warnIfCronSchedulerDisabled` 二次查询 `cron.status`，做运行时提醒。

- Daemon 生命周期链：
  - `register-service-commands` 绑定 install/uninstall/start/stop/restart/status。
  - lifecycle 命令进入 `lifecycle-core` 执行服务动作与 probe。
  - 输出经 `response.ts`（动作结果）和 `status.gather -> status.print`（状态快照）统一格式化。

- Gateway 运行链：
  - `gateway register` 下的 `run` 分支调用 `addGatewayRunCommand`。
  - `run.ts` 组装运行配置并进入 `runGatewayLoop`。
  - `run-loop.ts` 处理 stop/restart 信号动作，协调循环退出与重启。

- Channels 认证/配置链：
  - `channels add/remove` 走 `commands/channels.js`，并通过 `hasExplicitOptions` 决定仅显式参数覆写。
  - `channels login/logout` 走 `channel-auth.ts`，用 plugin registry + default account 解析执行渠道 auth API。

- Config 写入链：
  - `config set/unset` 调 `parsePath/parseValue/setAtPath/unsetAtPath`。
  - 从 `readConfigFileSnapshot` 读入后，基于 `snapshot.resolved` 修改并 `writeConfigFile` 持久化。

4) 风险
- 参数矩阵风险：cron/channels/exec-approvals 的互斥参数较多，新增 option 时容易出现 source 判定与 patch 语义漂移。
- 调用超时与体验风险：browser/cron/devices/gateway 依赖 gateway RPC，默认 timeout 与重试策略不一致时会产生“命令成功但用户感知失败”的体验差。
- 系统级副作用风险：`dns setup --apply`、daemon lifecycle、gateway run/stop 都可能触发 sudo、服务重启、文件写入，失败回滚路径需要持续验证。
- 兼容性风险：`daemon-cli-compat.ts` 通过 bundle 文本解析 legacy export，构建产物形态变化可能导致兼容逻辑失效。
- 输出一致性风险：多数命令双通道输出（`--json` 与富文本），新增字段时若只改其中一种输出，易导致脚本调用与人类排障信息不一致。
- 配置持久化风险：`config-cli.ts` 必须持续坚持基于 `snapshot.resolved` 写回；若回退到 runtime-merged config 会重引默认值污染问题。

5) 与已研究模块关联
- 与 Gateway 核心 (`src/gateway/*`)：CLI 的 `gateway-rpc.ts`、browser/cron/devices/directory/exec-approvals 都是 Gateway RPC 前端适配层。
- 与 Commands 层 (`src/commands/*`)：channels/docs/config wizard 等命令复用 commands 层核心逻辑，CLI 主要负责参数界面与错误输出。
- 与 Channels/Plugins (`src/channels/*` + `extensions/*`)：`channels-cli.ts`、`directory-cli.ts`、`channel-auth.ts` 通过插件注册与默认账号解析统一接入多渠道能力。
- 与 Browser 子系统 (`src/browser/*`)：browser CLI 是 browser HTTP/RPC 能力的薄封装，actions/state/inspect/debug 全部围绕 browser client contract。
- 与 Config/Runtime/Terminal (`src/config/*`, `src/runtime.ts`, `src/terminal/*`)：本 chunk 大量复用统一 runtime exit/log、theme、table、docs link、progress，保持 CLI 输出一致性。
- 与 Infra (`src/infra/*`)：涉及时间格式化、剪贴板、tailnet、wide-area dns、错误格式化等底层工具，说明 CLI 与系统环境耦合度较高。
