# Config Core IO/Validation 研究（2026-02-17，R3）

## 覆盖范围（70）
- `src/config/agent-dirs.test.ts`
- `src/config/agent-dirs.ts`
- `src/config/agent-limits.ts`
- `src/config/backup-rotation.ts`
- `src/config/cache-utils.ts`
- `src/config/commands.test.ts`
- `src/config/commands.ts`
- `src/config/config-misc.test.ts`
- `src/config/config-paths.ts`
- `src/config/config.multi-agent-agentdir-validation.test.ts`
- `src/config/config.nix-integration-u3-u5-u9.e2e.test.ts`
- `src/config/config.plugin-validation.test.ts`
- `src/config/config.pruning-defaults.test.ts`
- `src/config/config.sandbox-docker.test.ts`
- `src/config/config.skills-entries-config.test.ts`
- `src/config/config.talk-api-key-fallback.test.ts`
- `src/config/config.telegram-custom-commands.test.ts`
- `src/config/config.tools-alsoAllow.test.ts`
- `src/config/config.ts`
- `src/config/defaults.ts`
- `src/config/env-preserve-io.test.ts`
- `src/config/env-preserve.test.ts`
- `src/config/env-preserve.ts`
- `src/config/env-substitution.test.ts`
- `src/config/env-substitution.ts`
- `src/config/env-vars.ts`
- `src/config/group-policy.ts`
- `src/config/home-env.test-harness.ts`
- `src/config/includes-scan.ts`
- `src/config/includes.test.ts`
- `src/config/includes.ts`
- `src/config/io.compat.test.ts`
- `src/config/io.ts`
- `src/config/io.write-config.test.ts`
- `src/config/legacy-migrate.ts`
- `src/config/legacy.migrations.part-1.ts`
- `src/config/legacy.migrations.part-2.ts`
- `src/config/legacy.migrations.part-3.ts`
- `src/config/legacy.migrations.ts`
- `src/config/legacy.rules.ts`
- `src/config/legacy.shared.ts`
- `src/config/legacy.ts`
- `src/config/logging.ts`
- `src/config/markdown-tables.ts`
- `src/config/merge-config.ts`
- `src/config/merge-patch.test.ts`
- `src/config/merge-patch.ts`
- `src/config/model-alias-defaults.test.ts`
- `src/config/normalize-paths.test.ts`
- `src/config/normalize-paths.ts`
- `src/config/paths.test.ts`
- `src/config/paths.ts`
- `src/config/plugin-auto-enable.test.ts`
- `src/config/plugin-auto-enable.ts`
- `src/config/port-defaults.ts`
- `src/config/redact-snapshot.test.ts`
- `src/config/redact-snapshot.ts`
- `src/config/runtime-overrides.test.ts`
- `src/config/runtime-overrides.ts`
- `src/config/sessions.cache.test.ts`
- `src/config/sessions.test.ts`
- `src/config/sessions.ts`
- `src/config/slack-http-config.test.ts`
- `src/config/slack-token-validation.test.ts`
- `src/config/talk.ts`
- `src/config/telegram-custom-commands.ts`
- `src/config/telegram-webhook-secret.test.ts`
- `src/config/test-helpers.ts`
- `src/config/validation.ts`
- `src/config/version.ts`

## 核心结论
- 该组文件构成配置主读写链：`loadConfig`/`createConfigIO`、JSON5 + include + env substitution、legacy 迁移、默认值注入、路径归一化、写入审计与备份。
- `io.ts` 是中心：读取阶段整合 `includes`/`env-*`/`validation`，写入阶段使用 merge-patch、env 引用恢复、原子重命名与审计记录。
- `defaults.ts`、`runtime-overrides.ts`、`paths.ts`、`validation.ts` 决定 gateway 与 channel（特别是 telegram）在运行时的默认行为、安全边界与合法性。
- `channel-capabilities.ts` + `config/sessions*` + `group-policy.ts` 将配置语义连接到 channels/plugins、routing、session 流程。

## 关键调用链
1. `loadConfig` -> `createConfigIO().loadConfig` -> parse/inlcudes/env -> validation -> apply defaults -> normalize paths。
2. `writeConfigFile` -> merge patch -> validate patched config -> restore env refs -> backup/rename -> append audit。
3. `channel-capabilities` -> normalize channel/account -> 输出能力集给 channel plugins/outbound 流。
4. `legacy migrations` -> 新旧字段映射（如 gateway/token 与 telegram 旧字段）-> 最终 schema 校验。

## 风险点
- env 引用缺失会在关键密钥位点导致配置加载失败。
- reload 与写入缓存窗口可能在高频改配时引入短暂读写不一致。
- legacy 迁移规则若与新版字段不一致，会导致启动期 hard fail。
- 审计/备份依赖文件系统权限；异常时会影响可追溯性与回滚能力。
