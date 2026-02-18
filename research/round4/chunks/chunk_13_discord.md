1) 覆盖确认
- 已完整研读本次列表中的 34 个文件（全部位于 `src/discord` 及其子目录）：
  `monitor/provider.ts`、`monitor/reply-context.ts`、`monitor/reply-delivery.ts`、`monitor/sender-identity.ts`、`monitor/system-events.ts`、`monitor/threading.ts`、`monitor/typing.ts`、
  `pluralkit.ts`/`pluralkit.test.ts`、`probe.ts`/`probe.intents.test.ts`、`resolve-channels.ts`/`resolve-channels.test.ts`、`resolve-users.ts`、
  `send.channels.ts`、`send.components.ts`、`send.creates-thread.test.ts`、`send.emojis-stickers.ts`、`send.guild.ts`、`send.messages.ts`、`send.outbound.ts`、`send.permissions.ts`、`send.reactions.ts`、`send.shared.ts`、`send.test-harness.ts`、`send.ts`、`send.types.ts`、`send.sends-basic-channel-messages.test.ts`、
  `targets.ts`/`targets.test.ts`、`token.ts`/`token.test.ts`、`ui.ts`、`voice-message.ts`。
2) 模块要点
- 监控层：`monitor/provider.ts` 初始化 Discord 模块（配置、令牌、allowlist、命令、监听器、exec 审批、gateway 插件），与容易受权限/allowlist 影响的 `resolve-*`、`commands` 以及 `auto-reply` 共享配置。`reply-context.ts`/`reply-delivery.ts` 负责把被引用消息转成上下文并交给 `sendMessageDiscord`，`sender-identity.ts` 兼容 PluralKit 后缀；`threading.ts` 保存留言线程源、回填父频道信息，`system-events.ts` 统一系统事件友好描述，`typing.ts` 负责状态指示。 
- 发送能力：`send.shared.ts` 封装 `createDiscordClient`、recipient 解析、chunk 逻辑、错误翻译、组件/嵌入/文件管理、权限提示；`send.outbound.ts` 利用这套工具实现普通文本、媒体、Forum 线程、选票、贴纸以及语音消息（`voice-message.ts` 提供 ffmpeg/ffprobe 转码和 waveform 生成）；`send.media`、`send.guild`、`send.messages`、`send.channels`、`send.emojis-stickers`、`send.reactions` 基于共享 REST 客户端封装各类 endpoint；`send.components.ts` 进一步封装组件式消息、组件注册、附件名一致性。`send.types.ts` 汇总错误、flag 与 payload 定义，`send.ts` 对外出口。 
- 解析/校验：`targets.ts`/`resolveDiscordTarget` 利用 directory 查询把模糊 username 解析成 user:id，`resolve-channels.ts`/`resolve-users.ts` 把配置中的 allowlist 音译成 guild/channel/user ID，再由 `monitor/provider` 参与 allowlist 合并；`token.ts`/`resolveDiscordToken` 选取 account/config/env 令牌，`probe.ts` 检查 `/users/@me` 和 intent bits，`ui.ts`/`DiscordUiContainer` 提供默认主题。 
- 外部依赖：`pluralkit.ts` 访问 PluralKit API 并在监控/身份模块复用，`voice-message.ts` 强依赖本地 ffmpeg/ffprobe。测试覆盖了 token、intent 解析、channel/user resolution、send 逻辑（包括 thread creation、chunking、权限提示、rate-limit 重试、表情上传、投票、反应/权限查询等）。
3) 关键调用链
- 发送消息（含媒体/组件）：`sendMessageDiscord` → `createDiscordClient`（加载 config、令牌、Rest） → `parseAndResolveRecipient`/`resolveDiscordTarget`（目录查找 + `targets.ts`） → `resolveChannelId`（需要时创建 DM 频道） → 决定 channel 类型 → `sendDiscordText`/`sendDiscordMedia`（`send.shared.ts`）：
    - `sendDiscordText` 先 `buildDiscordTextChunks`（2000 字/线限制），然后按 chunk 逐条 POST `/channels/{id}/messages`，首条带 `message_reference`、第一条组件/嵌入； `sendDiscordMedia` 先上传文件再在后续 chunk 里调用 `sendDiscordText`。
    - `sendDiscordVoiceMessage` 通过 `voice-message.ts` 的 `ensureOggOpus`、`getVoiceMessageMetadata`、`sendDiscordVoiceMessage`（申请 upload URL、PUT、POST）完成语音消息。所有发送路径中 `buildDiscordSendError` 会在 50013 时报错并调用 `fetchChannelPermissionsDiscord` 给出缺失权限提示。`recordChannelActivity` 负责统计 outbound 流量。
- Forum 线程 / 部分内容：`sendMessageDiscord` 检测 channel type 为 Forum/Media，再调用 `Routes.threads` 创建线程 starter，将 chunk 0 作为 thread starter，后续 chunk 由 `sendDiscordMedia`/`sendDiscordText` 补发；`send.outbound.ts` 还允许 `mediaUrl` 作为第二条、`replyTo` 只在首 chunk 生效。
- Monitor → Auto-reply：`monitor/provider.ts` 里的 Discord gateway 注册 → `listeners` 捕获消息 → `message-handler`（未在列表中，但可推）决定是否触发 reply → `monitor/reply-delivery.ts` 把 `ReplyPayload` 交由上述发送链；`reply-context.ts`/`threading.ts` 先构建引用 context，用于 OpenClaw 的 reply 记录与 thread 元信息，`deliverDiscordReply` 里也尊重 `chunkMode`、media、tableMode。`
4) 风险
- 语音消息路径依赖系统上的 `ffmpeg`/`ffprobe`（`ensureOggOpus`, `getAudioDuration`, `generateWaveform`），且拒绝直接 URL，调用失败会抛出，如果环境缺失二进制需要上游安装；waveform 生成还会在临时目录写 `waveform-*.raw`。 
- Discord API rate limit：`send.outbound.ts` 和 `send.creates-thread.test.ts` 通过 `RetryRunner` 重试 `RateLimitError`，但如果 retry 配置不足或 `retry_after` 非零，会延迟；`deliverDiscordReply` 每 chunk 单独 POST，增加命中 rate limit 的概率。 
- 权限/DM：`buildDiscordSendError` 在 50013 抛出并附上 `fetchChannelPermissionsDiscord` 的缺失权限，若 bot 被 mute、频道覆盖、缺少 `SendMessages`、`AttachFiles` 等会导致无输出；`resolveDiscordToken` 仍允许 env 注入但若 default 账号没有 token 就会抛错。 
- 外部依赖：PluralKit（`pluralkit.ts`）或 Discord directory/search（`resolve-users.ts`, `targets.ts`）请求失败会中断 allowlist/user resolve，配置中 `guild:` 前缀必须准确防止 `/channels/<guild>` 404（`resolve-channels.test.ts` 捕获）。
- 组件/文件限制：`send.components.ts` 目前只支持单文件附件，上传名必须匹配组件定好的 `file` block，组件模式下 `mediaUrl` 必须提供，否则报错。 
5) 与已研究模块关联
- 与先前分析的 auto-reply/command 模块共享配置：`monitor/provider.ts` 调用了 `resolveAllowlist*`、`listNativeCommandSpecsForConfig`、`listSkillCommandsForAgents`、`createDiscordNativeCommand`、`resolveDiscordPresenceUpdate`，是 `src/auto-reply` 和 `src/config` 思路的 Discord 实现分支；也依赖 `src/routing/resolve-route.ts` 的 `buildAgentSessionKey`（线程缓存）、`src/infra/retry-policy.js`、`src/markdown/tables.js` 等跨平台通用组件。 
- `targets.ts`/`resolveDiscordTarget` 继续利用 `listDiscordDirectoryPeersLive`（与其他 channel directory 共享的 `channels/plugins/directory`）来让用户可用用户名触发 DM，与 `src/channels/targets.ts` 的 `buildMessagingTarget` 体系一致。 
- `send.shared.ts` 里对 chunk/text/component/permissions 的处理和 `src/media`/`src/web/media` 的加载一起支撑所有 channel 的统一 outbound 接口、`recordChannelActivity` 让 `infra/channel-activity.ts` 统计在 `send`、`monitor` 中复用。 
- `probe.ts` 的 intent flag 解析（`resolveDiscordPrivilegedIntentsFromFlags`）与 `docs/platforms` 中关于 gateway intent 的要求相关，测试保证与 `monitor`/`gateway` 的配置保持一致。 
- `voice-message.ts` 的 ffmpeg 转码与 `src/media/constants.ts`（`maxBytesForKind("audio")`）、`src/infra/tmp-openclaw-dir.ts` 的临时目录逻辑共同决定了语音消息的大小/路径限制，并与闲置 `check`/`recordChannelActivity` 复用同一路径。 
