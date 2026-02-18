# chunk_011_src_browser_p02 研究笔记

## 1. 覆盖确认
- 清单文件数：25
- 实际可读文件数：25
- 缺失/不可读文件数：0
- 主目录组：`src/browser`
- 代码总行数（近似）：3549

## 2. 模块要点
- 文件类型分布：module=15，test=10，doc=0，config=0。
- 导入语句总数（近似）：105。
- 重点文件（按行数）与导出摘要：
  - `src/browser/server-context.ts`: 666 行，imports=13，exports=listKnownProfileNames, createBrowserRouteContext。
  - `src/browser/server.control-server.test-harness.ts`: 367 行，imports=6，exports=getBrowserControlServerTestState, getBrowserControlServerBaseUrl, setBrowserControlServerCreateTargetId, setBrowserControlServerAttachOnly, setBrowserControlServerEvaluateEnabled, setBrowserControlServerReachable。
  - `src/browser/server.agent-contract-form-layout-act-commands.test.ts`: 320 行，imports=5，exports=无显式导出。
  - `src/browser/server-context.remote-tab-ops.test.ts`: 289 行，imports=8，exports=无显式导出。
  - `src/browser/routes/basic.ts`: 191 行，imports=5，exports=registerBrowserBasicRoutes。
  - `src/browser/server.agent-contract-snapshot-endpoints.test.ts`: 175 行，imports=4，exports=无显式导出。
  - `src/browser/server-context.hot-reload-profiles.test.ts`: 172 行，imports=3，exports=无显式导出。
  - `src/browser/server.evaluate-disabled-does-not-block-storage.test.ts`: 161 行，imports=3，exports=无显式导出。
  - `src/browser/server.post-tabs-open-profile-unknown-returns-404.test.ts`: 154 行，imports=3，exports=无显式导出。
  - `src/browser/routes/tabs.ts`: 145 行，imports=3，exports=registerBrowserTabRoutes。
  - `src/browser/server-context.ensure-tab-available.prefers-last-target.test.ts`: 141 行，imports=6，exports=无显式导出。
  - `src/browser/server.ts`: 137 行，imports=12，exports=startBrowserControlServerFromConfig, stopBrowserControlServer。
  - `src/browser/routes/dispatcher.ts`: 127 行，imports=4，exports=createBrowserRouteDispatcher。
  - `src/browser/server-context.types.ts`: 77 行，imports=4，exports=ProfileRuntimeState, BrowserServerState, BrowserRouteContext, ProfileContext, ProfileStatus, ContextOptions。
  - `src/browser/routes/utils.ts`: 74 行，imports=3，exports=getProfileContext, jsonError, toStringOrEmpty, toNumber, toBoolean, toStringArray。
  - `src/browser/server.auth-token-gates-http.test.ts`: 65 行，imports=4，exports=无显式导出。
  - `src/browser/screenshot.ts`: 58 行，imports=1，exports=DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE, DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES, normalizeBrowserScreenshot。
  - `src/browser/screenshot.e2e.test.ts`: 51 行，imports=3，exports=无显式导出。
  - `src/browser/routes/dispatcher.abort.test.ts`: 47 行，imports=2，exports=无显式导出。
  - `src/browser/server-middleware.ts`: 38 行，imports=4，exports=installBrowserCommonMiddleware, installBrowserAuthMiddleware。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- network: 命中 10 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 7 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 5 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- fs_delete: 命中 3 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/browser` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

