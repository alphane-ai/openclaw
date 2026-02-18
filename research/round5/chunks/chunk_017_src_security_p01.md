# chunk_017_src_security_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：21
- 实际可读文件数：21
- 缺失/不可读文件数：0
- 主目录组：`src/security`
- 代码总行数（近似）：8261

## 2. 模块要点
- 文件类型分布：module=15，test=6，doc=0，config=0。
- 导入语句总数（近似）：114。
- 重点文件（按行数）与导出摘要：
  - `src/security/audit.test.ts`: 2169 行，imports=9，exports=(anonymous-or-reexport)。
  - `src/security/audit-extra.sync.ts`: 973 行，imports=13，exports=SecurityAuditFinding, collectAttackSurfaceSummaryFindings, collectSyncedFolderFindings, collectSecretsInConfigFindings, collectHooksHardeningFindings, collectGatewayHttpSessionKeyOverrideFindings。
  - `src/security/audit-extra.async.ts`: 794 行，imports=24，exports=SecurityAuditFinding, collectPluginsTrustFindings, collectIncludeFilePermFindings, collectStateDeepFilesystemFindings, readConfigSnapshotForAudit, collectPluginsCodeSafetyFindings。
  - `src/security/audit.ts`: 690 行，imports=15，exports=SecurityAuditSeverity, SecurityAuditFinding, SecurityAuditSummary, SecurityAuditReport, SecurityAuditOptions, runSecurityAudit。
  - `src/security/audit-channel.ts`: 507 行，imports=9，exports=collectChannelSecurityFindings。
  - `src/security/fix.ts`: 459 行，imports=11，exports=SecurityFixChmodAction, SecurityFixIcaclsAction, SecurityFixAction, SecurityFixResult, fixSecurityFootguns。
  - `src/security/skill-scanner.ts`: 433 行，imports=3，exports=SkillScanSeverity, SkillScanFinding, SkillScanSummary, SkillScanOptions, isScannable, scanSource。
  - `src/security/skill-scanner.test.ts`: 346 行，imports=9，exports=greet, y, x, x, clean, ok。
  - `src/security/windows-acl.test.ts`: 345 行，imports=2，exports=无显式导出。
  - `src/security/external-content.test.ts`: 303 行，imports=2，exports=无显式导出。
  - `src/security/external-content.ts`: 300 行，imports=0，exports=detectSuspiciousPatterns, ExternalContentSource, WrapExternalContentOptions, wrapExternalContent, buildSafeExternalPrompt, isExternalHookSession。
  - `src/security/fix.test.ts`: 275 行，imports=5，exports=无显式导出。
  - `src/security/windows-acl.ts`: 229 行，imports=2，exports=ExecFn, WindowsAclEntry, WindowsAclSummary, resolveWindowsUserPrincipal, parseIcaclsOutput, summarizeWindowsAcl。
  - `src/security/audit-fs.ts`: 195 行，imports=2，exports=PermissionCheck, PermissionCheckOptions, safeStat, inspectPathPermissions, formatPermissionDetail, formatPermissionRemediation。
  - `src/security/audit-extra.sync.test.ts`: 56 行，imports=4，exports=无显式导出。
  - `src/security/channel-metadata.ts`: 46 行，imports=1，exports=buildUntrustedChannelMetadata。
  - `src/security/dangerous-tools.ts`: 38 行，imports=0，exports=DEFAULT_GATEWAY_HTTP_TOOL_DENY, DANGEROUS_ACP_TOOL_NAMES, DANGEROUS_ACP_TOOLS。
  - `src/security/audit-extra.ts`: 36 行，imports=0，exports=(anonymous-or-reexport)。
  - `src/security/audit-tool-policy.ts`: 32 行，imports=1，exports=pickSandboxToolPolicy。
  - `src/security/scan-paths.ts`: 18 行，imports=1，exports=isPathInside, extensionUsesSkippedScannerPath。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- command_exec: 命中 12 文件。涉及命令执行链路，需要关注注入与参数转义。
- secrets: 命中 11 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 6 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 6 文件。涉及网络请求/连接，需要关注超时与重试策略。
- fs_delete: 命中 4 文件。涉及文件删除/清理路径，需要严格路径边界验证。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/security` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

