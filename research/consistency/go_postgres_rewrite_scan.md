# Go+PostgreSQL Rewrite Candidates Scan

- scan_date: 2026-02-17
- total_done_files: 5389
- scored_modules: 98

## Priority Summary
- P0: 9 modules
- P1: 10 modules
- P2: 79 modules

## Top 40 Modules

| priority | module | files | score | top reasons |
|---|---|---:|---:|---|
| P0 | src/agents | 533 | 3926 | lock_cache:1428, fs_write:784, ws_hotpath:674, queue_retry:616 |
| P0 | src/gateway | 226 | 3060 | ws_hotpath:1400, lock_cache:756, fs_write:344, queue_retry:312 |
| P0 | src/infra | 222 | 2304 | fs_write:500, lock_cache:456, ws_hotpath:346, queue_retry:340 |
| P0 | src/commands | 263 | 1804 | ws_hotpath:932, fs_write:364, lock_cache:309, fs_read:84 |
| P0 | apps/macos | 312 | 1800 | ws_hotpath:1064, lock_cache:294, queue_retry:268, fs_write:104 |
| P0 | src/memory | 63 | 1563 | memory_index_pipeline:441, sqlite_local:335, lock_cache:231, fs_write:184 |
| P0 | src/config | 153 | 1558 | lock_cache:342, queue_retry:316, fs_write:308, ws_hotpath:250 |
| P0 | src/auto-reply | 203 | 1379 | queue_retry:636, lock_cache:363, fs_write:132, jsonl_scan:100 |
| P0 | src/cli | 198 | 1306 | ws_hotpath:820, lock_cache:153, fs_write:124, jsonl_scan:105 |
| P1 | ui | 165 | 854 | ws_hotpath:402, lock_cache:252, queue_retry:108, fs_write:92 |
| P1 | scripts | 112 | 655 | ws_hotpath:202, lock_cache:159, fs_read:96, fs_write:84 |
| P1 | src/discord | 78 | 595 | queue_retry:208, lock_cache:195, ws_hotpath:152, fs_write:36 |
| P1 | apps/ios | 93 | 564 | ws_hotpath:340, queue_retry:104, lock_cache:87, jsonl_scan:25 |
| P1 | src/telegram | 82 | 499 | lock_cache:273, queue_retry:196, fs_write:20, fs_read:8 |
| P1 | src/browser | 98 | 493 | ws_hotpath:232, lock_cache:147, fs_write:56, queue_retry:44 |
| P1 | src/web | 78 | 459 | lock_cache:153, queue_retry:140, fs_write:104, fs_read:40 |
| P1 | apps/android | 107 | 457 | ws_hotpath:280, lock_cache:135, jsonl_scan:30, fs_write:8 |
| P1 | src/plugins | 49 | 373 | lock_cache:147, fs_write:100, ws_hotpath:86, queue_retry:28 |
| P1 | src/cron | 58 | 358 | fs_write:168, lock_cache:63, queue_retry:52, jsonl_scan:35 |
| P2 | src/daemon | 32 | 323 | ws_hotpath:230, fs_write:60, fs_read:24, lock_cache:9 |
| P2 | src/hooks | 36 | 293 | fs_write:148, lock_cache:63, ws_hotpath:32, fs_read:32 |
| P2 | extensions/voice-call | 47 | 288 | lock_cache:117, queue_retry:64, ws_hotpath:60, jsonl_scan:35 |
| P2 | extensions/msteams | 65 | 282 | lock_cache:126, queue_retry:120, fs_write:28, fs_read:6 |
| P2 | apps/shared | 85 | 271 | ws_hotpath:98, queue_retry:72, lock_cache:51, jsonl_scan:50 |
| P2 | extensions/bluebubbles | 33 | 270 | lock_cache:204, fs_write:36, queue_retry:16, ws_hotpath:8 |
| P2 | src/media-understanding | 43 | 248 | lock_cache:174, fs_write:60, fs_read:10, ws_hotpath:4 |
| P2 | src/media | 26 | 196 | fs_write:96, lock_cache:54, fs_read:32, queue_retry:12 |
| P2 | src/security | 21 | 174 | fs_write:72, ws_hotpath:58, fs_read:38, lock_cache:6 |
| P2 | test | 22 | 171 | lock_cache:69, fs_write:60, ws_hotpath:34, queue_retry:8 |
| P2 | extensions/nostr | 27 | 169 | lock_cache:87, ws_hotpath:46, fs_write:20, queue_retry:12 |
| P2 | extensions/matrix | 71 | 158 | lock_cache:105, fs_write:32, ws_hotpath:10, sqlite_local:5 |
| P2 | src/process | 23 | 158 | lock_cache:78, queue_retry:76, fs_write:4 |
| P2 | src/slack | 62 | 156 | lock_cache:96, queue_retry:56, fs_write:4 |
| P2 | extensions/feishu | 48 | 156 | lock_cache:84, ws_hotpath:30, queue_retry:20, fs_write:16 |
| P2 | src/channels | 91 | 152 | ws_hotpath:54, lock_cache:48, fs_write:44, queue_retry:4 |
| P2 | src/wizard | 12 | 147 | ws_hotpath:74, lock_cache:39, fs_write:32, fs_read:2 |
| P2 | extensions/mattermost | 24 | 144 | lock_cache:54, ws_hotpath:42, queue_retry:40, fs_write:8 |
| P2 | src/tui | 38 | 134 | ws_hotpath:80, lock_cache:54 |
| P2 | src/acp | 12 | 116 | ws_hotpath:70, jsonl_scan:20, lock_cache:18, queue_retry:8 |
| P2 | src/logging | 20 | 105 | lock_cache:57, queue_retry:24, ws_hotpath:18, fs_write:4 |

## Recommended P0 Rewrite Set (Go + PostgreSQL first)

- `src/agents` (score=3926, files=533)
- `src/gateway` (score=3060, files=226)
- `src/infra` (score=2304, files=222)
- `src/commands` (score=1804, files=263)
- `apps/macos` (score=1800, files=312)
- `src/memory` (score=1563, files=63)
- `src/config` (score=1558, files=153)
- `src/auto-reply` (score=1379, files=203)
- `src/cli` (score=1306, files=198)
