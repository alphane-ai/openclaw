## 覆盖确认
- 已阅读 `/tmp/research_round4/chunk_04_commands.txt` 列出的 33 个文件，涵盖命令实现及对应测试、辅助展示模板和诊断辅助内容。

## 模块要点
- `src/commands/sandbox.{ts,e2e.test.ts}` 负责列出与重新创建 sandbox 容器/浏览器，靠 `agents/sandbox` 提供的列举/移除能力，`--browser`/`--all`/`--session`/`--agent` 参数验证、交互确认与统计输出都在此层处理。
- `src/commands/sessions.{ts,e2e.test.ts}` 读取代理配置与会话存储，推算上下文令牌/模型、活跃过滤、JSON 或彩色表格输出，并保证 `--active` 参数必须为正整数。
- `src/commands/setup.ts` 根据 CLI 输入或现有 `agents.defaults.workspace` 写回配置、创建工作区与会话目录，确保首次安装与后续运行都有一致基础。
- `src/commands/signal-install.{ts,test}` 提供 Signal CLI 自动安装：根据平台与 `process.arch` 选择 GitHub 资产或 Homebrew，下载/解压/定位二进制并记录版本；测试覆盖资产过滤、归档识别与密闭性。
- `src/commands/status*.{ts,tsx?}`（`statusCommand`、`statusAllCommand`、`scanStatus`、`status.summary`、`status.update`、`status.format`、`status.gateway-probe`、`status.link-channel`、`status.agent-local`、`status.daemon`、`status.types` 等）构成复杂状态报告体系：基础 `status` 显示概要、审计与频道信息，`--all` 启动 `status --all` 更深入诊断；涉及安全审计、Tailscale/网关探测、内存、会话与通道统计，并输出 JSON 形式。
- `status-all` 子模块（`agents`/`channels`/`diagnosis`/`format`/`gateway`/`report-lines`）负责 `status --all` 的数据收集、渠道级诊断（token/账户状态、链路信息）与可复制报告，强调 `redactSecrets`/`summarizeLogTail` 以避免泄漏；`diagnosis` 还会附带日志片段、重启哨兵、端口占用、Tailscale 状态等。
- `src/commands/systemd-linger.ts` 在 Linux 上提示（或在非交互模式下自动）开启 systemd user linger，以防 gateway 服务在登出时被杀死。
- `src/commands/uninstall.ts` 提供交互/非交互卸载，按 `service/state/workspace/app` 分步删除，并根据用户选择打印/执行脚本，依赖 `cleanup-plan` 生成清理目标。
- `src/commands/vllm-setup.ts` 通过向导收集 vLLM API 信息并通过 `upsertAuthProfileWithLock` 写入认证，同时为配置注入 `vllm` provider 和模型定义。
- `src/commands/zai-endpoint-detect*.ts` 探测 ZAI API 端点，依次尝试 `global`/`cn` `glm-5` 与 `coding` `glm-4.7`，并根据探测结果返回记录好的 baseUrl、默认 modelId 与说明；测试模拟 `fetch` 响应确保回退顺序。

## 关键调用链
1. `openclaw status --all`：`statusCommand` 检测到 `opts.all` → 调用 `statusAllCommand`，借 `withProgress` 依次：读配置、Tailscale 状态、更新检查、网关探针、服务状态、代理本地状态、通道表、`probeGateway`/`callGateway` 获取健康与通道问题、诊断（重启哨兵、端口、Tailscale、日志尾部）→ 通过 `buildStatusAllReportLines` 格式化（含 `appendStatusAllDiagnosis`）输出表格与诊断文本。
2. 默认 `openclaw status`：`statusCommand` 调用 `scanStatus`（Load config → Tailscale DNS → 更新检查 → 代理本地状态 → 网关探测/认证 → Gateway 状态与通道问题 → `buildChannelsTable` → 判断 Memory 插件 → `getStatusSummary` → `getProviderUsageSummary`/`runSecurityAudit`）→ 再根据 `opts` 选择 JSON 或自动彩色表格，调用 `formatUsageReportLines`/`theme`，最终在 CLI 中依次打印概览、安全审计、通道、会话、事件、健康、用量与 FAQ/下一步提示。
3. `openclaw sandbox recreate`：`sandboxRecreateCommand` 校验 `--all/--session/--agent`，调用 `fetchAndFilterContainers` 读取所有容器（容器+浏览器）、基于会话或 agent 过滤 → 显示预览 → 若无 `--force` 则通过 `clackConfirm`；确认后调用 `removeContainers`，分别调用 `removeSandboxContainer` / `removeSandboxBrowserContainer` 并统计 成功/失败 → 输出结果，失败时 `runtime.exit(1)`。
4. `openclaw signal-install`：`installSignalCli` 检查平台（Win32 报错；linux/x64 走 release，其他走 brew）→ `installSignalCliFromRelease` 拉 GitHub 发布信息、选资产（`pickAsset`）、下载/解压、查找 `signal-cli` → `installSignalCliViaBrew`（调用 `brew install`、查找安装路径、读取 `--version`）→ 返回 `cliPath/version`。
5. `openclaw sessions`：解析 `--store`/`--active` 参数、加载配置与模型 defaults、`loadSessionStore` 提取 entries、`toRows` 组装 `SessionRow`（计算上下文 tokens、percent、flags、kind）→ 若 `--json` 输出 enriched JSON；否则以 `theme` 输出彩色表格并应用百分比着色/截断。

## 风险
- `signal-install` 临时目录（`mkdtemp` → 下载/解压）并未清理，失败或重复执行会在 `CONFIG_DIR/tools/signal-cli` 及临时目录留下残余，长期运行可能占用磁盘；在释放失败或下载中断时也不会回滚旧版本。
- `status`/`status --all` 大量读写配置、会话、日志、通道等敏感数据，虽然诊断部分调用 `redactSecrets`，但默认 CLI 输出（包括 JSON）仍会泄露会话 ID、token 来源或 paths；需要确保调用 `redactSensitiveStatusSummary` 在需要公用/共享数据的场合（目前只有 `status.summary` 提供此接口）或在上层强制 `includeSensitive=false`。
- `systemd-linger`、`uninstall`、`setup` 等命令在 `sudo`/`prompt` 模式下依赖交互，非交互模式只记录建议但不会失败，可能导致自动化脚本误判已完成操作；此外 `uninstall` 仅在 `--non-interactive` 时强制 `--yes`，但仍会尝试停止服务，若 `resolveGatewayService()` 出错（例如缺失 LaunchAgent）会在 CLI 直接输出错误但退出码未统一。
- `zai-endpoint-detect` 在 Vitest 没有 `fetchFn` 时直接返回 `null`，避免测试网络依赖，但部署环境若某个端点暂不可访问，就会改为 `null`，未提供重试或备用告警；此函数也没有缓存，多个调用会重复探测。

## 与已研究模块关联
- `sandbox` 系列直接依赖 `agents/sandbox.js` 提供 container/browsers 列表与移除逻辑，与之前研究过的 `agents/workspace`、`agents/auth-profiles` 等共享 runtime/agent 概念；重建命令还复用了 `sandbox-display.ts` 统一展示。
- `status` 核心层串联了 `config`、`gateway`、`channels`、`infra`、`memory`、`daemon`、`security` 等多个模块，推动当前调研的 `agent/session`、`routing` 与 `infra/ports` 方向，在 `status --all` 中尤其突出（诊断会引用 `daemon/launchd`, `infra/ports`, `daemon/diagnostics`, `infra/restart-sentinel`, `gateway/probe`、`channels-status-issues` 等）。
- `sessions` 命令与 `config/sessions`、`routing/session-key`、`agents/context` 形成闭环，验证了会话分类与 token 计算逻辑。
- `signal-install` 依赖 `infra/archive`, `infra/brew`, `process/exec`，展示了已有工具库在 CLI 扩展中的复用；测试利用 `tar`/`JSZip` 确保安全性，与 `infra/archive` 的 zip-slip 检测一致。
- `systemd-linger`、`setup`、`uninstall` 等命令与 `daemon/service`、`config/config`, `utils` 等共享环境/路径决策，强调 CLI 需对 Linux/macOS 进行不同策略的兼容处理。
