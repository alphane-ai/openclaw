**覆盖确认**
1. `src/security/audit-channel.ts`
2. `src/security/audit-extra.async.ts`
3. `src/security/audit-extra.sync.test.ts`
4. `src/security/audit-extra.sync.ts`
5. `src/security/audit-extra.ts`
6. `src/security/audit-fs.ts`
7. `src/security/audit-tool-policy.ts`
8. `src/security/audit.test.ts`
9. `src/security/audit.ts`
10. `src/security/channel-metadata.ts`
11. `src/security/dangerous-tools.ts`
12. `src/security/external-content.test.ts`
13. `src/security/external-content.ts`
14. `src/security/fix.test.ts`
15. `src/security/fix.ts`
16. `src/security/scan-paths.ts`
17. `src/security/secret-equal.ts`
18. `src/security/skill-scanner.test.ts`
19. `src/security/skill-scanner.ts`
20. `src/security/windows-acl.test.ts`
21. `src/security/windows-acl.ts`

**模块要点**
- `src/security/audit.ts` is the top-level entry for `openclaw security audit`, stitching together the config-based collectors, filesystem examinations, channel warnings, plugin/skill code scans, and an optional deep gateway probe into a single `SecurityAuditReport`.
- `src/security/audit-extra.sync.ts` contains the pure-config collectors (attack surface summary, synced-folder detection, hooks hardening, gateway nodes policies, sandbox/docker guardrails, model hygiene, elevated access, exposure matrix, secrets-in-config, small-model sandboxing) while `src/security/audit-extra.async.ts` adds filesystem permission checks (`collectFilesystemFindings`, include files, OAuth/agent state dirs) plus plugin/skill trust and code-safety scans backed by `skill-scanner.ts`.
- `src/security/audit-channel.ts` inspects every channel plugin through `listChannelPlugins`, applies DM/group policy expectations, ensures allowlists exist when slash/native commands are enabled, and surfaces multicast risk via shared DM sessions.
- `src/security/fix.ts` automates remediations (`applyConfigFixes`, `setGroupPolicyAllowlist`, seeding WhatsApp allowlists, `chmodCredentialsAndAgentState`) while `fix.test.ts` covers the Windows/Unix chmod/icacls paths and invalid-config fallbacks.
- `src/security/external-content.ts` + tests wrap untrusted inputs (emails, webhooks, web search/fetch) with explicit markers, warnings, and prompt-injection detection before passing content into agents.
- `src/security/skill-scanner.ts` (and its tests) drives plugin and skill scanning, flagging child_process/`eval` usage, obfuscated payloads, WebSocket high ports, env harvesting, and large files, so `collectPluginsCodeSafetyFindings`/`collectInstalledSkillsCodeSafetyFindings` can translate them into audit findings.
- `src/security/windows-acl.ts` together with `audit-fs.ts` adapt POSIX permission checks to Windows ACLs, exposing helpers such as `inspectWindowsAcl`, `formatWindowsAclSummary`, and the icacls reset commands used in `fix.ts`.
- Utility modules `src/security/dangerous-tools.ts`, `scan-paths.ts`, `secret-equal.ts`, and `channel-metadata.ts` provide shared tool-deny lists, path containment checks, timing-safe secret comparison, and sanitized channel metadata wrappers for logging.

**关键调用链**
1. `runSecurityAudit` → config/attack-surface collectors (hooks, gateway, browser, logging, sandbox, models, secrets) → optional filesystem/perms collectors (`collectFilesystemFindings`, include files, `inspectPathPermissions`) → plugin/skill scans → `collectChannelSecurityFindings` → aggregated `SecurityAuditReport` and optionally `maybeProbeGateway`.
2. `collectChannelSecurityFindings` → per-plugin config resolution/`resolveDmPolicy` → `warnDmPolicy` (reads pairing store, normalizes allowlists, formats CLI remediations via `formatCliCommand`) → channel-specific warnings for Discord/Slack/Telegram DM/policy settings.
3. `collectPluginsCodeSafetyFindings`/`collectInstalledSkillsCodeSafetyFindings` → `readPluginManifestExtensions`/workspace skill entries → `skillScanner.scanDirectoryWithSummary` → `scanSource` (line + source rules) → aggregated findings fed back to audits with severity-based details.
4. `fixSecurityFootguns` → `applyConfigFixes`/`setGroupPolicyAllowlist` → WhatsApp pairing updates → config rewrite → `chmodCredentialsAndAgentState` → platform-specific `safeChmod` or `safeAclReset` (via `formatIcaclsResetCommand`, `createIcaclsResetCommand`).
5. `collectIncludeFilePermFindings` + `collectStateDeepFilesystemFindings` → `inspectPathPermissions` → `audit-fs.ts` → POSIX vs Windows ACL logic (`windows-acl.ts`) to format remediation commands.

**风险**
- Gateway surfaces (`collectGatewayConfigFindings`) warn about non-loopback binds without auth, uncontrolled tool re-enablement over `/tools/invoke`, missing rate limits, trusted-proxy misconfigurations, insecure Control UI auth, and tailscale funnel exposure.
- Hooks/logging risks: short or reused tokens, missing `hooks.defaultSessionKey`, allowing caller-supplied session keys without prefix restrictions, and disabling `logging.redactSensitive` weaken audit trails.
- Channel risks (`audit-channel.ts`): open DM policies without `allowFrom`, Slack/Discord slash commands without allowlists or access-group enforcement, Telegram wildcard or non-numeric allowlist entries, and shared-session DMs leaking context.
- Filesystem risks: world/group readable/writable state, config, include files, OAuth dir, auth profile JSON, and sessions store (POSIX or Windows ACL via `audit-fs.ts`/`windows-acl.ts`) can spill secrets or pairing tokens.
- Plugin/skill risks: missing `plugins.allow`, permissive tool policies exposing plugin tools, code-safety detections of exec/eval/obfuscation, and deep audits showing malicious code inside extension entries or workspace skills.
- Small-model exposures: `collectSmallModelRiskFindings` raises critical warnings when GPT/Claude sub-5 tiers run with web_search/web_fetch/browser without sandboxing, highlighting prompt-injection/command execution danger.
- External content risk: `wrapExternalContent` ensures prompts mark untrusted payloads (with detection of suspicious markers) so agents do not execute instructions from emails/webhooks/web tools.

**与已研究模块关联**
- Gateway-related warnings lean on `src/gateway/auth.ts`, `src/gateway/probe.ts`, `src/gateway/node-command-policy.ts`, and `src/browser/*`, so this chunk ties directly into previously reviewed gateway/browser surfaces.
- Channel audits reuse `src/channels/plugins/*`, `src/pairing/pairing-store.ts`, `src/commands/format.ts`, and provider helpers (`src/channels/telegram`, `discord`, `slack`), reinforcing earlier channel-routing research.
- Plugin/skill scanning hooks into `src/agents/skills.ts`, workspace-dir helpers, and config includes, so security findings propagate into agent workspace/extension workflows covered in other research rounds.
- Remediation hooks (`fix.ts`) rely on `src/config/config.ts`, `src/agents/agent-scope.ts`, `src/routing/session-key.ts`, and `src/process/exec.ts`, linking the security chunk to the configuration and agent lifecycle surfaces.
