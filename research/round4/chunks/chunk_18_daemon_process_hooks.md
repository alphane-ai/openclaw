**1. 覆盖确认**
- 本条 chunk_18 目录覆盖了 91 个文件（包括 `src/daemon/*`, `src/hooks/*`、`src/hooks/bundled/*` 及涉及 `workspace`/`installer`、`hooks` 运行时的 `HOOK.md` 发现工具、以及 `src/process/*` 相关工具）。已逐一确认文件存在并归类，满足完整研究要求。

**2. 模块要点**
- `src/daemon` 负责启动守护进程的系统集成：`program-args.ts` 决定 service/agent 的 entrypoint 与 Bun/Node 选择，`service.ts` 抽象 macOS/Linux/Windows 的 LaunchAgent/systemd/Scheduled Task 接口，`paths.ts` 计算配置和 state 目录，`runtime-*` 负责持续状态解析/格式化，`diagnostics.ts` 从 gateway logs 抓取已知故障提示，`inspect.ts`/`exec-file.ts`/`launchd-*.ts` 等支撑各系统服务脚本。
- `src/hooks` 整体构成内部 hook 平台：`internal-hooks.ts` 提供事件注册/触发基础，`config.ts` 与 `types.ts` 处理 frontmatter 描述的依赖/过滤条件，`workspace.ts` 与 `bundled-dir.ts` 负责从 workspace/managed/bundled/extra 目录中收集带 `HOOK.md` 的 hook，`loader.ts` 依据配置动态导入并注册 handler，`install.ts` 管理 hook 包的验证、安装与 dry-run 报告，配套的 frontmatter/utils（如 `frontmatter.ts`、`gmail-*`、`plugin-hooks.ts`）则封装具体事件与配置信息。
- `src/process` 集中子进程管理：`command-queue.ts` 和 `lanes.ts` 实现多 lane 串行/并行命令执行，`exec.ts`/`spawn-utils.ts`/`kill-tree.ts` 提供跨平台 spawn/exec 包装，`child-process-bridge.ts`/`command-queue` 与 `process/supervisor/*`（适配器、registry、types）辅助 CLI 任务在 `child`/`pty` 模式间运行、追踪运行状态与超时恢复，`restart-recovery.ts` 提供 in-process 重启的 iteration hook，以防重启时遗留 pending 任务。

**3. 关键调用链**
- Hook 注册链：`hooks/workspace.ts` 依赖 `frontmatter` 创建 `HookEntry` → `hooks/loader.ts` 调用 `loadWorkspaceHookEntries`、`resolveHookConfig`/`shouldIncludeHook` 筛选 → 通过 `pathToFileURL` + cache-busting import 加载 handler → `registerInternalHook` 将 `event`/`event:action` 绑定到 `internal-hooks.ts` 的 `handlers` Map。附加的 `hooks/config.ts`/`hooks/types.ts` 提供是否加载、依赖检查、平台约束等逻辑，`hooks/install.ts` / `hooks/bundled/*` 负责 hook 包的 placement，并记录 `HOOK.md` frontmatter metadata 以影响 loader 策略。
- Process 执行链：CLI/agent 工具先调用 `enqueueCommand`/`enqueueCommandInLane` 将任务送入 `command-queue` → 队列触发 `drainLane`，在允许并发数下调用 `createProcessSupervisor().spawn` → 选择 `createChildAdapter`（或 `createPtyAdapter`）执行命令 → `registry` 跟踪 `RunRecord` 状态与输出时间戳 → `adapter.wait` 完成后 `finalize` 并清理 `active` & timers → `ManagedRun.wait` 返回 `RunExit` 给上层。这套链条结合 `spawn-utils`、`kill-tree`、`exec.ts` 的 timeout/stdio 选项，保证了 cross-platform 任务可以报告 `terminationReason`/`no-output-timeout` 并在工作区 scoped lane 上管理。

**4. 风险**
- Hook 动态导入：`loader.ts` 直接使用 `pathToFileURL(...)?t=Date.now()` 触发 cache-bust import，如果 workspace/managed hook 包含恶意代码或依赖未受控的用户路径，脑中无沙箱时会直接执行。需确认 hooks 入口的前置校验、权限边界与 logging 严密。
- 平台服务抽象：`daemon/service.ts` 中多平台策略依赖外部 system 工具（`launchctl`/`systemctl`/`schtasks`），但 `inspect`/`diagnostics`/`runtime-paths` 捕获信息较少，错误输出可能被掩盖，需确保 `readRuntime` 与 `readCommand` 在各平台抛错时提供清晰指示。
- 进程 lane & supervisor：`command-queue` 在 `clearCommandLane` 詹中直接 reject 所有待办，`supervisor` 的 `reconcileOrphans` 目前是 no-op，意味着进程重启后可能会丢失 long-running runs、stdin 仍然 open 或队列 deadlock，需在主 agent 信号（如 SIGUSR1）触发 `clearCommandLane` + `restart-recovery` 逻辑。

**5. 与已研究模块关联**
- Daemon service 与 CLI/commands（前几轮 chunk_01~chunk_05 的命令/CLI 研究）直接对接：`program-args` 和 `service-runtime` 结果最终被 CLI 的 `gateway` start 命令调用并传给 `openclaw gateway run` 相关代码，hooks/daemon 共同保证安装/重启命令可跨平台触发。
- Hooks 事件（如 `command:new`、`gateway:startup`）与 auto-reply/command pipelines（chunk_08~chunk_11 的自动回复研究、chunk_13/14 的 Discord/Slack 针对命令处理）共享 `InternalHook` 机制，loader 执行的 handler 会被 CLI `session`、`command` 等入口触发，而这些入口在早期 chunk 已详细描述。
- Process supervisor 与 CLI 里 `pi`/`agent` 命令的 `spawn` 逻辑一致，任何增加的 child run（如 hooks 中启动的 bootstrap task）都会通过 `process/exec`、`command-queue`、`supervisor` 形成闭环，因此前面的命令/auto-reply/cron 模块的表现都依赖这套守护流程。
