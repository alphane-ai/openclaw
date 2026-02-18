# chunk_014_src_media_p01 研究笔记

## 1. 覆盖确认
- 清单文件数：26
- 实际可读文件数：26
- 缺失/不可读文件数：0
- 主目录组：`src/media`
- 代码总行数（近似）：3370

## 2. 模块要点
- 文件类型分布：module=17，test=9，doc=0，config=0。
- 导入语句总数（近似）：91。
- 重点文件（按行数）与导出摘要：
  - `src/media/image-ops.ts`: 474 行，imports=4，exports=ImageMetadata, getImageMetadata, normalizeExifOrientation, resizeToJpeg, convertHeicToJpeg, hasAlphaChannel。
  - `src/media/input-files.ts`: 386 行，imports=5，exports=InputImageContent, InputFileExtractResult, InputPdfLimits, InputFileLimits, InputImageLimits, InputImageSource。
  - `src/media/store.test.ts`: 291 行，imports=8，exports=无显式导出。
  - `src/media/store.ts`: 263 行，imports=10，exports=MEDIA_MAX_BYTES, setMediaStoreNetworkDepsForTest, extractOriginalFilename, getMediaDir, ensureMediaDir, cleanOldMedia。
  - `src/media/parse.ts`: 252 行，imports=2，exports=MEDIA_TOKEN_RE, normalizeMediaSource, splitMediaFromOutput。
  - `src/media/mime.ts`: 192 行，imports=3，exports=normalizeMimeType, getFileExtension, isAudioFileName, detectMime, extensionForMime, isGifMedia。
  - `src/media/fetch.ts`: 179 行，imports=5，exports=MediaFetchErrorCode, MediaFetchError, FetchLike, fetchRemoteMedia。
  - `src/media/mime.test.ts`: 144 行，imports=4，exports=无显式导出。
  - `src/media/store.redirect.test.ts`: 129 行，imports=8，exports=无显式导出。
  - `src/media/server.ts`: 113 行，imports=8，exports=attachMediaRoutes, startMediaServer。
  - `src/media/input-files.fetch-guard.test.ts`: 105 行，imports=1，exports=无显式导出。
  - `src/media/server.test.ts`: 103 行，imports=5，exports=无显式导出。
  - `src/media/host.test.ts`: 93 行，imports=3，exports=无显式导出。
  - `src/media/parse.test.ts`: 91 行，imports=2，exports=无显式导出。
  - `src/media/png-encode.ts`: 91 行，imports=1，exports=crc32, pngChunk, fillPixel, encodePngRgba。
  - `src/media/host.ts`: 69 行，imports=8，exports=HostedMedia, ensureMediaHosted。
  - `src/media/fetch.test.ts`: 63 行，imports=2，exports=无显式导出。
  - `src/media/read-response-with-limit.ts`: 53 行，imports=0，exports=readResponseWithLimit。
  - `src/media/audio.ts`: 49 行，imports=1，exports=TELEGRAM_VOICE_AUDIO_EXTENSIONS, TELEGRAM_VOICE_MIME_TYPES, isTelegramVoiceCompatibleAudio, isVoiceCompatibleAudio。
  - `src/media/constants.ts`: 47 行，imports=0，exports=MAX_IMAGE_BYTES, MAX_AUDIO_BYTES, MAX_VIDEO_BYTES, MAX_DOCUMENT_BYTES, MediaKind, mediaKindFromMime。

## 3. 关键调用链
- 本 chunk 内未解析到显著的本地相对导入边，更多依赖可能跨模块。

## 4. 风险
- fs_delete: 命中 7 文件。涉及文件删除/清理路径，需要严格路径边界验证。
- network: 命中 6 文件。涉及网络请求/连接，需要关注超时与重试策略。
- secrets: 命中 6 文件。涉及凭据或环境变量读取，需要关注泄漏与降级行为。
- state_write: 命中 5 文件。涉及状态写入，需关注并发覆盖与回滚策略。
- command_exec: 命中 2 文件。涉及命令执行链路，需要关注注入与参数转义。

## 5. 与已研究模块关联
- 本 chunk 与既有研究主要在 `src/media` 范围形成补全，尤其对同模块测试与实现的一致性进行了补充覆盖。
- 本文档为分片研究结果，整体进度以后续 `files.todo.csv` 回填为准。

