**覆盖确认 (32 个文件)**
1. `src/cli/program/register.subclis.ts`
2. `src/cli/program/routes.ts` / `.test.ts`
3. `src/cli/progress.ts` / `.test.ts`
4. `src/cli/prompt.ts` / `.test.ts`
5. `src/cli/respawn-policy.ts`
6. `src/cli/route.ts`
7. `src/cli/run-main.ts` / `.test.ts` / `.exit.test.ts`
8. `src/cli/sandbox-cli.ts`
9. `src/cli/security-cli.ts`
10. `src/cli/shared/parse-port.ts`
11. `src/cli/skills-cli.ts`, `.format.ts`, `.test.ts`, `.e2e.test.ts`
12. `src/cli/system-cli.ts`
13. `src/cli/tagline.ts`
14. `src/cli/tui-cli.ts`
15. `src/cli/update-cli.ts`, `.shared.ts`, `.progress.ts`, `.update-command.ts`, `.status.ts`, `.suppress-deprecations.ts`, `.wizard.ts`, `.test.ts`
16. `src/cli/wait.ts`
17. `src/cli/webhooks-cli.ts`
18. `src/cli/windows-argv.ts`

**模块要点**
- **命令路由与注册**:`run-main.ts` 先归一化 argv、加载 env、检查运行时、尝试 fast path 路由 (`route.ts`+`program/routes.ts`)，若无路由再构建 `commander` program；`register.subclis.ts` 提供按需懒加载的子命令注册列表（含 pairing/plugins 等），`routes.ts` 负责 `status`/`health`/`config`/`models` 等命令的快速执行并决定是否预先加载 plugin registry。`program/routes.test.ts` 验证 flag 检查、未知路由返回 `null`。
- **CLI 体验/辅助工具**: `progress.ts` 结合 `spinner`、`osc-progress` 及 fallback 模式，确保 tty/非 tty 场景下只开一个进度；`prompt.ts` 用 global `--yes`/`--verbose` 配合 readline 实现 yes/no 问答；`tagline.ts` 维持节日/随机提示，`wait.ts` 提供保持事件循环的长期 promise，`windows-argv.ts` 处理 Win32 node 前缀清理。各自的测试覆盖了 fallback、flag 路径和 holiday 逻辑（节日规则/override）。
- **子系统命令**: `sandbox-cli.ts`（容器列举/重建/解释），`security-cli.ts`（安全 audit + fix 的 JSON/富文本输出），`system-cli.ts`（system event/heartbeat/presence 转发到 gateway RPC）和 `webhooks-cli.ts`（Gmail webhook setup/run）都统一使用 `defaultRuntime`、rich text/links、error 捕获模式并将命令参数转为对应 helper 调用。`tui-cli.ts` 负责从 CLI 启动 terminal UI 连接，验证 timeout 参数。
- **技能/插件**: `skills-cli.ts` 提供 list/info/check 命令，重用 `agents/skills-status` 的报告并输出格式化表格或 JSON；`skills-cli.format.ts` 维护 table 渲染、status 栏和 missing requirement 描述，并在 `--eligible`/`--json`/`--verbose` 下提供不同视图；相关测试（单元+e2e）mock `pi-coding-agent` 降低耦合并验证 CLI 文本提示包含 `npx clawhub`。 
- **更新流程**: `update-cli.ts` 负责 `update`、`update wizard`、`status` 命令，集中引用 `shared.ts` 里对安装环境、tag/version、global manager 的解析；`update-command.ts` 处理交互确认（`downgrade`/`shell completion`）、选择 channel/tag、运行 git/npm 更新、同步插件、写 completion cache、安装 shell completion、重启服务及配套 quip；`progress.ts` 追踪更新步骤 spinner；`status.ts` 生成表格/JSON；`suppress-deprecations.ts` 关闭 Node 警告；`wizard.ts` 提供 TTY 操作。`update-cli.test.ts` mock 绝大部分依赖，覆盖 channel/tag 分支、JSON 输出、daemon 重启、timeout 校验和 wizard 交互。

**关键调用链**
1. 启动 `openclaw` → `runCli` → 先 `normalizeWindowsArgv`、`loadDotEnv`、`normalizeEnv`、`assertSupportedRuntime`、`tryRouteCli`（若路由匹配则提前执行 `route.run`、跳过 Commander）→ 没匹配继续 `buildProgram` → 注册 core/subcommands（调用 `registerSubCliByName`、`registerPluginCliCommands`）→ `program.parseAsync` 进入具体 command action。
2. `update` 输入 → `update-cli.ts` 把 flag 转为 `updateCommand` → `shared.resolveUpdateRoot` + `checkUpdateStatus` 决定 channel/installKind → 根据 `updateInstallKind` 选择 `runPackageInstallUpdate` 或 `runGitUpdate` → 运行 `runGatewayUpdate`/`runUpdateStep` 和 spinner（`progress.ts`）→ 结果输出→ `updatePluginsAfterCoreUpdate`→ `tryWriteCompletionCache`/`tryInstallShellCompletion`→ `maybeRestartService` → `doctor` + `pickUpdateQuip`。
3. Fast path `status/health/models/config` → `tryRouteCli` 解析 command path → `findRoutedCommand` 返回 `run` 函数 → `prepareRoutedCommand` 运行 `emitCliBanner`、`ensureConfigReady`、根据需不需要 `ensurePluginRegistryLoaded` → 直接调用相应 `commands/*`（如 `commands/status.js`）绕过 commander 帮助打印。

**风险**
- `registerSubCliByName` 的 lazy placeholder 依赖 `reparseProgramFromActionArgs`; 若后续 `commander` 版本或 `actionArgs` 结构变更，可能遗留 placeholder 造成命令无法正确传递参数。
- `parse-port.ts`、`system-cli.ts` 与 `webhooks-cli.ts` 解析 port/number/string 选项十分宽松；若接受 `0`/负数或非数值字符串，会返回 `null` 并终止命令，需继续在调用层给出清晰错误。
- 更新流程的降级确认逻辑依赖 `process.stdin.isTTY` 与 `confirm`，若被非交互环境误标为 TTY（例如输出被管道）可能跳过确认并触发不可恢复降级。
- `webhooks-cli` 与 `sandbox-cli` 直接调用外部命令（gogcli/sandbox helpers），一旦路径或依赖变更、权限受限会导致运行失败；需要保持 `danger` log + exit 1 保证用户可见。

**与已研究模块关联**
- 路由/注册机制延续了 `chunk_06_cli` 中 `program/command-registry` 和 lazy subcommand 模式，快速路由路径 (`status/health/models/config`) 与 `commands/*` 的 `defaultRuntime` 兼容。v
- `progress`、`prompt`、`tagline` 等通用工具与 `chunk_06_cli` 中 `terminal/progress-line.ts`、`globals.ts`、`banner.js` 搭配，保持 CLI 交互一致；`run-main` 与早前 `node/daemon` 模块在 `ensureConfigReady`、`enableConsoleCapture` 和 `installUnhandledRejectionHandler` 方面复用同一套 guard。
- `skills-cli` 和 `plugins/agents` 相关代码跟 `chunk_06_cli` 中的插件同步逻辑、`callGatewayCli` 机制相互交织，共用 `loadConfig`、`defaultRuntime`、`theme` 输出风格以及 `formatCliCommand` 里处理的 `profile/command` 语法。
