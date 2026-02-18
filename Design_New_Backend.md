# Design New Backend

## Layer 1: 原则层（批判 + 边界）

### L1-1. 对《PostgreSQL IM 记忆系统设计》的批判性吸收

结论先行：这份设计里有很多正确方向，但如果直接照搬到 OpenClaw，会出现“把复杂度从 TS 挪到 PostgreSQL 内核里”的另一种过载。

主要问题：

1. 过早按十亿级目标设计，容易把当前产品阶段拖进“基础设施先行陷阱”。
- Citus、DiskANN、库内 PL/Python、全库任务调度是重武器，适合明确的高并发生产场景。
- OpenClaw 当前更急迫的问题不是“单库撑不住 10 亿”，而是“关键状态仍分散在 JSON/JSONL/文件队列里，跨进程一致性和观测性弱”。

2. 过度把业务逻辑塞进数据库（Database-as-Agent）风险高。
- 库内 PL/Python + pg_cron 虽然减少跳转，但会把推理、调度、数据一致性、资源隔离都压在 DB 上。
- 一旦出现慢查询/锁争用/扩展兼容问题，会同时冲击在线查询与离线处理。

3. 对 OpenClaw 来说，真正需要避免的是“TS 在做 Go + PostgreSQL 的活”，而不是“把所有活都给 PostgreSQL”。
- 应该把高并发状态机、可靠投递、流式聚合交给 Go 服务。
- 把持久化一致性、查询优化、事务边界交给 PostgreSQL。
- TS 退回到编排、插件生态、CLI/UI 协议适配层。

### L1-2. OpenClaw 当前错位（代码证据）

以下是“TS 正在做本应由 Go + PostgreSQL 处理”的直接证据：

1. 会话状态以文件为主、并在 TS 内做锁和缓存。
- `src/config/sessions/store.ts`：`fs.readFileSync` + JSON 解析 + TTL cache + 写锁队列。
- 这类状态属于高频读写、跨进程共享数据，天然更适合事务数据库。

2. 可靠投递队列是文件队列。
- `src/infra/outbound/delivery-queue.ts`：`enqueue/ack/fail/recover` 基于目录与 JSON 文件、重命名与重试回放。
- 这是典型的“消息队列/任务队列”语义，TS 文件系统实现在并发、可观测、恢复上先天弱于 DB 队列。

3. usage 统计通过 TS 流式扫 transcript JSONL。
- `src/infra/session-cost-usage.ts`：`readline` 扫 `.jsonl` 逐条聚合。
- `src/gateway/server-methods/usage.ts`：做缓存与聚合拼装。
- 这类计算可由 PostgreSQL 增量聚合/物化视图承担，避免网关线程读大文件。

4. exec approvals 仍是文件 + socket 状态。
- `src/infra/exec-approvals.ts`：`~/.openclaw/exec-approvals.json` + 本地 socket。
- 审批这类强一致审计事件更适合落库，具备事务、追踪、多副本恢复能力。

### L1-3. 新边界（必须执行）

1. TS 只做：
- Agent/插件编排。
- 通道协议适配和交互层（CLI/UI/websocket contract）。
- 业务规则表达，不做重状态持久化引擎。

2. Go 做：
- 高并发写路径（消息入队、投递状态机、审批状态机）。
- 后台任务执行器（重试、补偿、清理、增量聚合）。
- 与 PostgreSQL 的高吞吐数据访问层（pgx + prepared statements + COPY）。

3. PostgreSQL 做：
- 系统事实源（sessions/messages/memory/approvals/delivery jobs）。
- 事务一致性、索引、查询、增量统计与审计。
- 向量检索可先用 pgvector，分布式/磁盘索引后置到真正需要时再上。

## Layer 2: 目标层（升级后的三段式新架构）

### L2-1. 控制与编排层（TS, OpenClaw Core）

职责：
- 保持 `src/gateway`、`src/channels/plugins`、`src/commands` 的业务入口地位。
- 所有“写状态”动作改成 RPC 到 Go Backend（不再直接写 JSON/JSONL 队列文件）。

接口边界：
- `Gateway -> Go Backend`：gRPC 或 HTTP/JSON（建议先 HTTP/JSON，后续可切 gRPC）。
- 只传业务语义，不传存储细节。

保留在 TS 的能力：
- Prompt/工具链/插件扩展速度。
- 通道差异化协议映射。
- 前端控制面与 CLI 体验。

### L2-2. 状态与执行层（Go Backend Service）

建议拆成 4 个核心子域（可同进程多模块起步）：

1. Session Service
- 负责 `session upsert/read/reset/compact`。
- 用 PostgreSQL 事务替代 `src/config/sessions/store.ts` 的文件锁 + cache。

2. Delivery Service
- 负责 enqueue/ack/retry/dead-letter。
- 用 `delivery_jobs` 表 + `FOR UPDATE SKIP LOCKED` 实现并发 worker。
- 替代 `src/infra/outbound/delivery-queue.ts` 文件队列。

3. Memory Service
- 原始消息、摘要、embedding、检索 API。
- 第一阶段只做“消息与摘要可靠入库 + 基本检索”，避免一上来 PL/Python 全栈库内智能体。

4. Approvals & Audit Service
- 执行审批、决策回写、审计事件。
- 替代 `src/infra/exec-approvals.ts` 文件模式。

### L2-3. 数据层（PostgreSQL）

最小可行模型（先统一事实源，再谈超大规模优化）：

1. 核心表：
- `sessions`
- `messages`
- `transcript_entries`
- `delivery_jobs`
- `exec_approvals`
- `usage_daily_agg`

2. 关键约束：
- 每张表主键可追踪来源（session_id/message_id/job_id）。
- 关键状态迁移必须事务化（如 delivery: pending -> processing -> done/failed）。
- 审批与投递全链路写审计日志。

3. 可选扩展（后置）：
- `pgvector`：先用于 memory recall。
- Citus/DiskANN：当单机 PostgreSQL 明确到达瓶颈再迁移，不作为初始门槛。

## Layer 3: 落地层（迁移计划 + 禁止事项）

### L3-1. 迁移计划（四阶段）

1. Phase A: 建立“新后端旁路”
- 新建 Go service 与 PostgreSQL schema。
- TS 仍走旧逻辑，但同步做 shadow write（写 DB，不读 DB）。

2. Phase B: 切读
- 先切 `usage` 和 `session 查询` 到 PostgreSQL。
- 验证性能与一致性后，再切 `delivery queue` 的生产流量。

3. Phase C: 切写
- `sessions/transcript/delivery/approvals` 改为只写 Go+Postgres。
- 保留文件写作为短期回退开关（有时间窗）。

4. Phase D: 清理旧路径
- 删除 TS 文件锁队列、JSON queue/recover 关键路径。
- 只保留导入工具用于历史迁移与应急修复。

### L3-2. 明确禁止事项（避免再走回头路）

1. 禁止在 TS 新增任何“文件队列 + 重试状态机”。
2. 禁止在 TS 新增跨进程共享状态缓存作为事实源。
3. 禁止把高频统计聚合继续放在网关请求线程里扫描 JSONL。
4. 禁止一开始就上 Citus + PL/Python + pg_cron 全家桶；先单库可验证、再按压测升级。

### L3-3. 验收标准（Definition of Done）

1. 架构验收
- `sessions/delivery/approvals` 的事实源全部是 PostgreSQL。
- TS 侧同类文件存储路径不再承载生产写入。

2. 性能验收
- 高峰时网关 P95 延迟不再受 transcript 扫描影响。
- 投递恢复不依赖“重启时扫目录”，改为 worker 常驻消费。

3. 可运维验收
- 审批、投递、会话变更均有可查询审计轨迹。
- 失败重试、死信、补偿任务可观测可回放。

### L3-4. 5389 模块系统扫描结果（基于 `files.todo.csv` 全量完成项）

本轮不是抽样，而是对 `research/tracking/files.todo.csv` 中全部 `done` 项做规则化扫描：

1. 扫描覆盖
- 总文件数：`5389`（全部 `done`，无剩余未研究项）。
- 聚合模块数：`98`（按路径近邻归并）。
- 产物：`research/consistency/go_postgres_rewrite_scan.md`、`research/consistency/go_postgres_rewrite_scan.json`。

2. 优先级分布
- `P0`: `9` 个模块。
- `P1`: `10` 个模块。
- `P2`: `79` 个模块。

3. 触发重写优先级的主要信号（全局累计）
- `ws_hotpath=8532`、`lock_cache=8214`、`fs_write=4548`、`queue_retry=4364`。
- `jsonl_scan=1170`、`sqlite_local=515`。
- 关键核心命中：`sessions_store_core=130`、`outbound_delivery_core=330`、`usage_aggregation_core=30`、`exec_approvals_core=36`、`memory_index_pipeline=441`。

4. 结果解释
- `src/agents`、`src/commands`、`src/cli` 这类大模块分数高，不等于“整模块改写为 Go”。
- 正确动作是只抽离其“状态密集、并发敏感、可事务化”的子路径到 Go + PostgreSQL，其余编排与交互逻辑仍保留在 TS。

### L3-5. Go + PostgreSQL 改写清单（按职责边界，不按目录整体搬迁）

1. P0 必改（第一批上线，直接影响一致性与吞吐）
- `src/config/sessions/store.ts`、`src/config/sessions/transcript.ts`、`src/config/sessions/*`：从文件事实源迁移到 `sessions`/`transcript_entries` 表。
- `src/infra/outbound/delivery-queue.ts`、`src/infra/outbound/*`：迁移到 `delivery_jobs`（`pending -> processing -> done/failed/dead`）。
- `src/infra/session-cost-usage.ts`、`src/gateway/server-methods/usage.ts`：迁移到增量聚合表 `usage_daily_agg`（或物化视图）。
- `src/infra/exec-approvals.ts`：迁移到 `exec_approvals` + `approval_events` 审计流水。
- `src/gateway/server-methods/sessions*`、`src/gateway/sessions-resolve*`、`src/gateway/session-utils*`：改为调用 Go Session API，不再直接读写本地状态。
- `src/memory/*`（尤其 `sqlite/index/scan` 路径）：迁移到 PostgreSQL（含可选 `pgvector`）并由 Go 提供检索接口。

2. P1 协同改（第二批，围绕 P0 读写路径收敛）
- `src/auto-reply/*`、`src/cron/*`：去文件队列化，统一接入 Go Job API。
- `src/discord/*`、`src/telegram/*`、`src/web/*`、`src/browser/*`、`src/plugins/*`：仅改“投递/回执/重试”共享状态路径，协议适配逻辑保留 TS。
- `apps/macos`、`apps/ios`、`apps/android`、`ui`：改为调用后端查询接口，不在端侧聚合或持久化关键事实源。

3. P2 暂缓（第三批或按需）
- 文档、测试、纯展示层与低频脚本优先不改写。
- 仅在压测或故障复盘证明是瓶颈时再升级到 Go 路径。

4. 映射原则（防止“误改写”）
- TS 保留：编排、插件生态、通道协议、CLI/UI 交互。
- Go 承担：状态机、并发执行、重试补偿、批处理。
- PostgreSQL 承担：唯一事实源、事务一致性、索引查询、审计回放。

---

## 附：给 OpenClaw 的一句话架构原则

不要让 TypeScript 再承担“状态数据库 + 任务队列 + 批处理引擎”的职责。

让 TS 专注“业务编排和生态扩展”，让 Go 承担“高并发执行与状态机”，让 PostgreSQL 成为“唯一事实源与查询引擎”。
