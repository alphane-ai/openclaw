# chunk_010_src_browser_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：73
- 实际可读文件数：73
- 缺失/不可读文件数：0
- 主目录组：`src/browser`
- 代码总行数（近似）：13569

## 2. 模块要点
- 文件类型分布：module=50，test=23，doc=0，config=0。
- 导入语句总数（近似）：248。
- 重点文件（按行数）与导出摘要：
  - `src/browser/pw-session.ts`: 797 行，imports=6，exports=BrowserConsoleMessage, BrowserPageError, BrowserNetworkRequest, WithSnapshotForAI, rememberRoleRefsForTarget, storeRoleRefsForTarget。
  - `src/browser/extension-relay.ts`: 760 行，imports=8，exports=ChromeExtensionRelayServer, getChromeExtensionRelayAuthHeaders, ensureChromeExtensionRelayServer, stopChromeExtensionRelayServer。
  - `src/browser/pw-tools-core.interactions.ts`: 647 行，imports=3，exports=highlightViaPlaywright, clickViaPlaywright, hoverViaPlaywright, dragViaPlaywright, selectOptionViaPlaywright, pressKeyViaPlaywright。
  - `src/browser/chrome.executables.ts`: 626 行，imports=5，exports=BrowserExecutable, findChromeExecutableMac, findChromeExecutableLinux, findChromeExecutableWindows, resolveBrowserExecutableForPlatform。
  - `src/browser/routes/agent.act.ts`: 587 行，imports=7，exports=registerBrowserAgentActRoutes。
  - `src/browser/cdp.ts`: 455 行，imports=1，exports=normalizeCdpWsUrl, captureScreenshotPng, captureScreenshot, createTargetViaCdp, CdpRemoteObject, CdpExceptionDetails。
  - `src/browser/routes/agent.storage.ts`: 436 行，imports=4，exports=registerBrowserAgentStorageRoutes。
  - `src/browser/pw-role-snapshot.ts`: 435 行，imports=0，exports=RoleRef, RoleRefMap, RoleSnapshotStats, RoleSnapshotOptions, getRoleSnapshotStats, parseRoleRef。
  - `src/browser/extension-relay.test.ts`: 370 行，imports=5，exports=无显式导出。
  - `src/browser/chrome.ts`: 346 行，imports=14，exports=RunningChrome, resolveOpenClawUserDataDir, isChromeReachable, getChromeWebSocketUrl, isChromeCdpReady, launchOpenClawChrome。
  - `src/browser/client.ts`: 338 行，imports=1，exports=BrowserStatus, ProfileStatus, BrowserResetProfileResult, BrowserTab, SnapshotAriaNode, SnapshotResult。
  - `src/browser/routes/agent.snapshot.ts`: 330 行，imports=9，exports=registerBrowserAgentSnapshotRoutes。
  - `src/browser/client-actions-state.ts`: 285 行，imports=3，exports=browserCookies, browserCookiesSet, browserCookiesClear, browserStorageGet, browserStorageSet, browserStorageClear。
  - `src/browser/client.test.ts`: 285 行，imports=3，exports=无显式导出。
  - `src/browser/pw-tools-core.downloads.ts`: 282 行，imports=7，exports=armFileUploadViaPlaywright, armDialogViaPlaywright, waitForDownloadViaPlaywright, downloadViaPlaywright。
  - `src/browser/config.ts`: 262 行，imports=6，exports=ResolvedBrowserConfig, ResolvedBrowserProfile, parseHttpUrl, resolveBrowserConfig, resolveProfile, shouldStartLocalBrowserServer。
  - `src/browser/chrome.test.ts`: 259 行，imports=7，exports=无显式导出。
  - `src/browser/client-actions-core.ts`: 253 行，imports=3，exports=BrowserFormField, BrowserActRequest, BrowserActResponse, BrowserDownloadPayload, browserNavigate, browserArmDialog。
  - `src/browser/client-fetch.ts`: 249 行，imports=6，exports=fetchBrowserJson, __test。
  - `src/browser/pw-tools-core.waits-next-download-saves-it.test.ts`: 246 行，imports=3，exports=无显式导出。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- state_write: 命中 23 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- network: 命中 21 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 18 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- command_exec: 命中 3 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/browser` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

