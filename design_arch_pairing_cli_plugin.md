# design_arch_pairing_cli_plugin

研究日期：2026-02-16  
研究范围：

- `src/channels/plugins/pairing.ts`
- `src/channels/plugins/pairing-message.ts`
- `src/cli/pairing-cli.ts`
- `src/cli/pairing-cli.test.ts`

本批状态：已完成（4/4）

## 1. 模块职责定位

这组文件是 pairing 的“插件接入层 + CLI 操作层”：

- 插件接入层负责声明哪些 channel 支持 pairing，以及 approval 通知的适配器调用。
- CLI 层负责 `openclaw pairing list/approve` 的参数解析、展示、审批动作执行与可选通知。

## 2. 文件级研究结论

## 2.1 `src/channels/plugins/pairing.ts`

职责：从 channel plugin registry 暴露 pairing 能力。

核心行为：

- `listPairingChannels()`：筛选 `plugin.pairing` 存在的通道，见 `src/channels/plugins/pairing.ts:11`。
- `getPairingAdapter()/requirePairingAdapter()`：读取 pairing adapter，不存在则抛错，见 `src/channels/plugins/pairing.ts:18`、`src/channels/plugins/pairing.ts:23`。
- `resolvePairingChannel()`：归一化并校验 channel 是否在“支持 pairing 的 channel 列表”中，见 `src/channels/plugins/pairing.ts:31`。
- `notifyPairingApproved()`：审批成功后调用 adapter 的 `notifyApproval`（若实现），见 `src/channels/plugins/pairing.ts:51`。

依赖边界：

- 依赖 `channels/plugins/index.ts` 的 registry 能力。
- 若 registry 未初始化，调用链会失败；CLI 注册阶段专门做了预初始化保护（见下）。

风险评估：`medium`

- 风险点：该模块依赖 active plugin registry；在未初始化时调用会导致命令层面失败。

## 2.2 `src/channels/plugins/pairing-message.ts`

职责：统一审批成功提示文案常量。

核心行为：

- 仅导出 `PAIRING_APPROVED_MESSAGE`，见 `src/channels/plugins/pairing-message.ts:1`。

风险评估：`low`

- 风险小，主要是多语言或文案变化时集中维护。

## 2.3 `src/cli/pairing-cli.ts`

职责：注册 pairing 子命令并执行 list/approve 流程。

核心行为：

- 注册入口：`registerPairingCli(program)`，见 `src/cli/pairing-cli.ts:52`。
- 注册时调用 `listPairingChannels()` 形成 channel 列表，用于帮助文本与参数校验，见 `src/cli/pairing-cli.ts:53`。
- `parseChannel()`：
  - 优先用 `normalizeChannelId` 处理 core/已注册通道。
  - 对未注册但格式合法的扩展通道（`^[a-z][a-z0-9_-]{0,63}$`）放行。
  - 见 `src/cli/pairing-cli.ts:17`。
- `pairing list`：读取 pending requests，可按 `--account` 过滤，支持 `--json`，表格头使用 `resolvePairingIdLabel`，见 `src/cli/pairing-cli.ts:63`。
- `pairing approve`：支持 positional 与 `--channel` 两种模式，支持 `--account`，审批成功可选 `--notify` 调用 notify adapter，见 `src/cli/pairing-cli.ts:114`。

关键边界：

- 子命令注册前必须先加载插件命令以初始化 registry，见 `src/cli/program/register.subclis.ts:175`。
- CLI 自己不处理 pairing 存储细节，调用 `pairing-store` API 完成读写。

风险评估：`medium`

- 风险点 1：`listPairingChannels()` 在注册时静态取值，运行期间 registry 变化不会反映到帮助文本。
- 风险点 2：扩展 channel 放行依赖格式正则，若插件不存在，后续操作会在更深层报错。

## 2.4 `src/cli/pairing-cli.test.ts`

覆盖结论：

- 覆盖了注册时机（调用发生在 register 而非 import）、alias 归一化、扩展 channel 放行、`--account` 透传、approve positional 兼容等关键行为。
- 定向执行结果：9/9 通过。

## 3. 对外调用面

上游入口：

- `openclaw pairing ...`，通过 `register.subclis` 懒加载注册。

下游调用：

- pairing store：`listChannelPairingRequests` / `approveChannelPairingCode`
- pairing adapter：`notifyPairingApproved`

## 4. 本批完成文件

- `src/channels/plugins/pairing.ts`
- `src/channels/plugins/pairing-message.ts`
- `src/cli/pairing-cli.ts`
- `src/cli/pairing-cli.test.ts`

## 5. 验证

命令：`pnpm test:fast src/cli/pairing-cli.test.ts`  
结果：9/9 通过
