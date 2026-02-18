# OpenClaw Overall Architecture (3-Layer)

本文档将 `research/` 目录下的分项研究统一成一个三层层级架构视图。

- 研究快照时间：2026-02-17
- 研究完成度：`research/tracking/files.todo.csv` 当前 `done=5389`、`todo=0`
- 证据入口：`research/final/research-round-2026-02-17-r8.md`、`research/round9/verification.json`

## Layer 1: 系统全局架构（What + Why）

### L1-1. 系统目标与边界
- OpenClaw 的核心是“多通道消息系统 + Agent runtime + Gateway 控制面 + 插件扩展面”。
- 全链路目标是把“接入 -> 路由 -> 推理/工具 -> 回包 -> 状态观测”闭环标准化，不依赖单一通道实现。
- 架构边界覆盖：核心 `src/*`、扩展 `extensions/*`、客户端 `apps/*`、UI/脚本/docs、以及运维/发布相关资产。

### L1-2. 两条主链路
- 数据平面（消息链路）：
  - Channel inbound（Telegram/Discord/Slack/...）
  - Routing + Session key 归一化
  - Agent/Auto-reply 执行与工具调用
  - Outbound adapter 回发到目标通道
- 控制平面（网关链路）：
  - Gateway WS/HTTP 协议接入
  - Method 授权 + 业务分发
  - Config/Health/Usage/Wizard/Exec approvals
  - 客户端（CLI/UI/Mobile）状态可见与运维操作

### L1-3. 治理与质量状态
- 研究执行采用分轮并发（Round1~Round9），每轮按近邻模块分配，并以 `manifest + verification` 做去重/遗漏校验。
- 自 R4 起执行“每个 subagent 分片输入 <= 400KB”约束；R9 对超大单文件采用主线程单独处理以避免违反上限。
- 当前研究追踪层面已全量覆盖（`todo=0`），但这不等于业务风险为 0，仍需持续回归与运行态验证。

## Layer 2: 领域架构分层（How）

### L2-1. Gateway 运行与协议层
- 职责：统一协议契约、连接鉴权、方法分发、生命周期管理、重载/重启策略。
- 关键结论：
  - `protocol/schema/*` 定义请求/事件/错误契约，`server-methods*` 提供业务编排。
  - `server-startup/close/maintenance/reload` 形成运行时生命周期骨架。
  - `auth-rate-limit/origin-check/node-invoke*` 构成网关安全边界。
- 证据：
  - `research/architecture/gateway-protocol-runtime.md`
  - `research/architecture/gateway-server-methods.md`
  - `research/architecture/gateway-core-runtime-auth-probe.md`
  - `research/architecture/gateway-server-runtime-lifecycle.md`

### L2-2. 通道与插件层（In/Out + Onboarding + Status）
- 职责：统一多通道接入、发送适配、动作执行、接入引导和状态诊断。
- 关键结论：
  - `src/channels/*` 提供 gating/allowlist/session 元信息等共用治理层。
  - `src/channels/plugins/*` 把 actions/onboarding/outbound/status 抽象为可扩展能力。
  - Telegram 主链路在 bot/update/context/dispatch/send 维度覆盖完整。
- 证据：
  - `research/flows/channels-core-gating-registry.md`
  - `research/extensions/channels-plugins-core-flow.md`
  - `research/flows/telegram-core-bot-pipeline.md`
  - `research/flows/telegram-send-ops-outbound-bridge.md`

### L2-3. 会话、路由与消息投递层
- 职责：会话状态管理、transcript 持久化、目标解析、投递队列与配对信任。
- 关键结论：
  - `config/sessions/store/transcript` 与 `gateway sessions.*` 构成读写闭环。
  - `infra/outbound/*` 负责 target 归一化、queue/recovery、adapter 分发。
  - `device/node pairing` 与 token 生命周期控制跨端信任。
- 证据：
  - `research/flows/sessions-store-transcript-flow.md`
  - `research/flows/infra-outbound-pairing-delivery.md`

### L2-4. 配置、安全与基础设施层
- 职责：配置读写与 schema 验证、网络/执行安全、发现/更新/心跳、运行时守护。
- 关键结论：
  - `config io + validation + zod schema` 定义“可配置即可运行”的强契约。
  - `infra net/ssrf/exec approvals/tls/ssh/runtime guard` 形成安全执行基座。
  - `heartbeat/provider-usage/update/discovery` 提供运维可观测与持续运行能力。
- 证据：
  - `research/architecture/config-core-io-validation.md`
  - `research/architecture/config-schema-types-telegram.md`
  - `research/architecture/infra-network-exec-security.md`
  - `research/architecture/infra-runtime-ops-heartbeat-update.md`

### L2-5. Agent 与应用层（执行面）
- 职责：命令入口、agent 编排、auto-reply、客户端与扩展生态协同。
- 关键结论：
  - R4~R9 批量研究将 `src/agents/src/commands/src/auto-reply/src/cli` 与 apps/ui/extensions 全覆盖。
  - 客户端（macOS/Android/iOS/shared）与 UI/scripts/docs 通过 gateway 与核心能力闭环。
- 证据：
  - `research/round4/chunks/*.md`
  - `research/round5/chunks/*.md`
  - `research/round6/chunks/*.md`
  - `research/round7/chunks/*.md`
  - `research/round8/chunks/*.md`
  - `research/round9/chunks/*.md`

## Layer 3: 实证矩阵与索引（Where + Evidence）

### L3-1. 轮次覆盖矩阵
| Round | 覆盖文件 | 分片数 | 主要近邻模块 | 校验文件 |
|---|---:|---:|---|---|
| R1 (`research-round-2026-02-17.md`) | 152 | 4 主题 | gateway methods/protocol, sessions, channels plugins | `research/final/research-round-2026-02-17.md` |
| R2 | 186 | 6 主题 | gateway runtime/core, channels core, telegram | `research/final/research-round-2026-02-17-r2.md` |
| R3 | 300 | 5 主题 | config, infra outbound/network/runtime | `research/final/research-round-2026-02-17-r3.md` |
| R4 (round5) | 1009 | 21 | agents/browser/cron/media/memory/plugins | `research/round5/verification.json` |
| R5 (round6) | 1007 | 18 | commands/auto-reply/cli/discord/web/slack | `research/round6/verification.json` |
| R6 (round7) | 993 | 20 | apps/ui/scripts/open-prose/Swabble | `research/round7/verification.json` |
| R7 (round8) | 1005 | 34 | docs + matrix/msteams/feishu/voice-call 等扩展 | `research/round8/verification.json` |
| R8 (round9) | 658 | 9 + 8 oversize | 剩余长尾模块 + 超大单文件收敛 | `research/round9/verification.json` |

### L3-2. 专题文档索引（按领域）
- Gateway 与协议：
  - `research/architecture/gateway-server-methods.md`
  - `research/architecture/gateway-protocol-runtime.md`
  - `research/architecture/gateway-core-runtime-auth-probe.md`
  - `research/architecture/gateway-server-runtime-lifecycle.md`
- Channels / Telegram / Outbound：
  - `research/flows/channels-core-gating-registry.md`
  - `research/extensions/channels-plugins-core-flow.md`
  - `research/flows/telegram-core-bot-pipeline.md`
  - `research/flows/telegram-send-ops-outbound-bridge.md`
  - `research/flows/infra-outbound-pairing-delivery.md`
- Sessions / Config / Infra：
  - `research/flows/sessions-store-transcript-flow.md`
  - `research/architecture/config-core-io-validation.md`
  - `research/architecture/config-schema-types-telegram.md`
  - `research/architecture/infra-network-exec-security.md`
  - `research/architecture/infra-runtime-ops-heartbeat-update.md`
- 回归与全量分片：
  - `research/flows/gateway-e2e-harness-regression-map.md`
  - `research/round4/chunks/*.md` 到 `research/round9/chunks/*.md`

### L3-3. 全局架构结论与后续建议
- 架构结论：
  - OpenClaw 已形成“协议统一 + 通道插件化 + 会话持久化 + 送达适配 + 安全护栏 + 客户端控制面”的完整分层。
  - Gateway 是控制平面中枢，channels/plugins 与 infra/outbound 构成数据平面执行骨架。
  - 配置 schema 与 runtime 行为基本对齐，研究证据链已可回溯到模块/分片级。
- 后续建议：
  - 将 `research/round*/manifest.json + verification.json` 纳入自动质量看板，持续跟踪新增文件的“研究债务”。
  - 对高风险域（exec approvals、SSRF、reload/defer restart、multi-channel target normalization）补充运行态压测与故障注入测试。
  - 未来新增模块优先在本文件补齐 L2/L3 索引，保持“分项研究 -> 总体架构”单文档一致性。
