**覆盖确认**
- 已阅读并覆盖 chunk_06_cli.txt 中列出的全部 83 个文件（包括 CLI helpers、nodes/media tooling、program/command registry 以及 profile/hook/log/memory utilities）。

**模块要点**
- `hooks-cli`, `logs-cli`, `memory-cli`, `models-cli`, `plugin-registry`, `plugins-cli` 等帮助工具负责配置与诊断输出，依赖 `defaultRuntime` 输出、`loadConfig`、`runCommandWithRuntime` 和 `formatCliCommand` 等通用打印/格式化辅助。
- Nodes 家族（`nodes-cli/*`、`nodes-camera`、`nodes-screen`、`nodes-canvas`、`nodes-run`、`nodes-cli/cli-utils` 等）以 `nodes` 命令为入口，按功能拆成 pairing、invoke、camera/canvas/screen/location/notify/status 等子命令，统一通过 `callGatewayCli` 和 `withProgress` 走 Gateway RPC，payload 解析与临时文件写入集中在 camera/screen/canvas 中的解析/写入 helpers。
- `node-cli`, `daemon.ts` 负责本地 node host 运行与服务生命周期（install/start/stop/status），边界用 `runService*` 工具、`buildNodeInstallPlan`、服务运行时信息与 hints 输出。
- 通用 CLI 框架：`program/build-program` + `program/command-registry` + `program/register.*` 负责 lazy register 核心命令（setup/onboard/configure/agent/message/status/health/sessions）以及子 CLI（gateway/logs/nodes/models/plugins 等）、help/preaction/config guard 等，确保命令在运行前完成 config/doctor guard、插件初始化和 banner/verbose 设置。
- CLI 基础工具如 `profile`, `command-format`, `parse-*`、`ports`/`parse-bytes`/`parse-duration` 等均为参数校验与 runtime 环境管理蓝本，`profile` 还负责 profile env 变量与 `formatCliCommand` 中插入 `--profile`/`--dev` 递归。

**关键调用链**
1. `buildProgram` → `registerProgramCommands` → `registerCoreCliCommands`/`registerSubCliCommands` → 某个命令（如 `nodes status`）的 placeholder action → 第二次 import 注册（`registerNodesCli`） → 命令主体 → `runNodesCommand` 包装 → `callGatewayCli` → `callGateway`。
2. `program` preAction hook → `ensureConfigReady`（doctor flow/config guard）→ `ensurePluginRegistryLoaded`（message/channels）→ `registerPreActionHooks` 设定 Verbose/Banner，再进入具体命令。
3. `nodes run` → `resolveExecDefaults`/`resolveNodeId` → `exec.approval.request`（timeout override）→ `node.invoke` (`system.run`) → 结果写入 stdio/exit handling。
4. `hooks install/update` → `installHooksFromPath/NpmSpec` → `recordHookInstall` + `writeConfigFile` → CLI 提示 restart。
5. `plugins install/update/doctor` → `installPluginFromPath/NpmSpec`/`updateNpmInstalledPlugins` → `applySlotSelection` → `writeConfigFile` → `clearPluginManifestRegistryCache` + log.

**风险**
- Nodes 的 approval timeout/transport timeout差异敏感（`DEFAULT_EXEC_APPROVAL_TIMEOUT_MS` 与 `callGatewayCli` transport override），漏掉会导致 CLI 在等待用户批准时先超时；文件中已有测试确保 transport ≥ approval。
- Camera/media helpers允许 URL 下载，受 HTTPS/content-length 检查保护；若后续更改忽略 `MAX_CAMERA_URL_DOWNLOAD_BYTES` 可能暴露 DoS/download 大文件；写入临时文件时需继续捕获并 cleanup 错误。
- `plugins-cli`、`hooks-cli` 直接修改 config/install 记录，若 config guard/doctor 未触发会留下无效插件记录；`profile` env 处理也需同步 `formatCliCommand` 才能在 help/error 信息中包含正确 `--profile` 语法，否则用户误导。
- `program` lazy registration 依赖 `reparseProgramFromActionArgs`、`registerCoreCliByName` 等，若未正确 reparse 可能导致 `commander` 保留 placeholder 且后续 action 无效，需要保持 fallback argv 逻辑与 tests 中模仿行为一致。

**与已研究模块关联**
- `nodes-cli`、`program` 与之前 chunk（如 chunk_05_cli）中的 `channels-cli`/`gateway-cli` 共享 `callGateway`、`defaultRuntime`、`cli-utils`、`progress` 工具，命令结构延续同样的 `runCommandWithRuntime` → `defaultRuntime.log/error` 模式。
- `hooks-cli`/`plugins-cli` 修改配置的流程与 `config/config-cli`、`register.configure` 复用 `loadConfig`/`writeConfigFile`，与 docs+setup/onboard 流程中使用的相同 guard 和 help link（docs.openclaw.ai/cli/*）。
- 消息命令（`program/message/*`）继续依赖 `messageCommand` 与 `message helpers`，与此前研究的 `infra/outbound`、`plugins/hook-runner-global` 互通，确保 CLI stop hooks 顺序一致。
