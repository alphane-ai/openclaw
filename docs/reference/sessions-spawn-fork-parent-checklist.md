---
summary: "Closure checklist for the sessions_spawn fork_parent rollout"
title: "sessions_spawn fork_parent Checklist"
---

# sessions_spawn fork_parent Checklist

Goal: extend `sessions_spawn` with an explicit parent-transcript fork mode without changing the default isolated-child behavior.

## Delivery checklist

- [x] Keep default `sessions_spawn` behavior as `contextMode: "fresh"`.
- [x] Add explicit opt-in support for `contextMode: "fork_parent"`.
- [x] Support `inheritParentTranscript: true` as a compatibility alias for `fork_parent`.
- [x] Keep `fork_parent` behind a config gate (`tools.sessions_spawn.forkParent.enabled`, default `false`).
- [x] Use the config gate as the rollout kill switch.
- [x] Reject conflicting `contextMode` / `inheritParentTranscript` inputs.
- [x] Reject `resumeSessionId` together with `contextMode: "fork_parent"`.
- [x] Reuse the existing parent-session fork substrate instead of copying transcript history into prompts.
- [x] Materialize inherited context before the child runtime starts for `runtime: "subagent"`.
- [x] Materialize inherited context before ACP runtime initialization for `runtime: "acp"`.
- [x] Preserve existing announce, completion, delivery, cleanup, and task-registry flows.
- [x] Enforce the existing `session.parentForkMaxTokens` guard for `fork_parent`.

## Verification checklist

- [x] Tool-layer schema and parameter normalization tests updated.
- [x] Shared context materializer test covers successful parent transcript fork.
- [x] Shared context materializer test covers max-token rejection.
- [x] ACP spawn test covers the `resumeSessionId` + `fork_parent` incompatibility.
- [x] Subagent/ACP tests cover the disabled-by-default kill switch path.
- [x] Focused Vitest suite passes.
- [x] TypeScript no-emit build passes.
- [x] `oxlint` passes on touched files.

## Closure notes

- Remaining future work, if desired, should be treated as a separate phase:
  - Split spawn lineage from fork provenance into dedicated metadata fields.
  - Add broader end-to-end ACP replay coverage for `fork_parent`.
  - Document the new mode in additional localized docs if needed.
