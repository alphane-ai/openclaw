import path from "node:path";
import {
  forkSessionFromParent,
  resolveParentForkMaxTokens,
} from "../auto-reply/reply/session-fork.js";
import type { OpenClawConfig } from "../config/config.js";
import { loadSessionStore, mergeSessionEntry, updateSessionStore } from "../config/sessions.js";
import type { SessionEntry } from "../config/sessions/types.js";
import {
  pruneLegacyStoreKeys,
  resolveGatewaySessionStoreTarget,
} from "../gateway/session-utils.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

export const SPAWN_SESSION_CONTEXT_MODES = ["fresh", "fork_parent"] as const;
export type SpawnSessionContextMode = (typeof SPAWN_SESSION_CONTEXT_MODES)[number];
const log = createSubsystemLogger("agents/spawn-context");

export function isForkParentContextEnabled(cfg: OpenClawConfig): boolean {
  return cfg.tools?.sessions_spawn?.forkParent?.enabled === true;
}

export function assertSpawnChildSessionContextModeAllowed(params: {
  cfg: OpenClawConfig;
  contextMode?: SpawnSessionContextMode;
  parentSessionKey: string;
  childSessionKey: string;
}): void {
  if ((params.contextMode ?? "fresh") !== "fork_parent") {
    return;
  }
  if (isForkParentContextEnabled(params.cfg)) {
    log.info("fork_parent requested", {
      event: "fork_parent_requested",
      parentSessionKey: params.parentSessionKey,
      childSessionKey: params.childSessionKey,
    });
    return;
  }
  log.warn("fork_parent rejected because the feature is disabled", {
    event: "fork_parent_rejected_disabled",
    parentSessionKey: params.parentSessionKey,
    childSessionKey: params.childSessionKey,
  });
  throw new Error(
    'sessions_spawn contextMode="fork_parent" is disabled by config (enable tools.sessions_spawn.forkParent.enabled).',
  );
}

function findStoreEntryByKeys(
  store: Record<string, SessionEntry>,
  keys: string[],
): SessionEntry | undefined {
  for (const key of keys) {
    const entry = store[key];
    if (entry) {
      return entry;
    }
  }
  return undefined;
}

export async function materializeSpawnChildSessionContext(params: {
  cfg: OpenClawConfig;
  contextMode?: SpawnSessionContextMode;
  parentSessionKey: string;
  childSessionKey: string;
}): Promise<
  | {
      contextMode: "fresh";
      parentSessionKey: undefined;
      forkedSessionId: undefined;
      forkedSessionFile: undefined;
    }
  | {
      contextMode: "fork_parent";
      parentSessionKey: string;
      forkedSessionId: string;
      forkedSessionFile: string;
    }
> {
  if ((params.contextMode ?? "fresh") !== "fork_parent") {
    return {
      contextMode: "fresh",
      parentSessionKey: undefined,
      forkedSessionId: undefined,
      forkedSessionFile: undefined,
    };
  }

  const parentTarget = resolveGatewaySessionStoreTarget({
    cfg: params.cfg,
    key: params.parentSessionKey,
  });
  const parentStore = loadSessionStore(parentTarget.storePath, { skipCache: true });
  const parentEntry = findStoreEntryByKeys(parentStore, parentTarget.storeKeys);
  if (!parentEntry?.sessionId) {
    log.warn("fork_parent failed because the parent session could not be resolved", {
      event: "fork_parent_failed_missing_parent",
      parentSessionKey: params.parentSessionKey,
      childSessionKey: params.childSessionKey,
    });
    throw new Error(
      `Unable to fork parent transcript: unknown parent session ${params.parentSessionKey}`,
    );
  }

  const maxParentForkTokens = resolveParentForkMaxTokens(params.cfg);
  const parentTokens = parentEntry.totalTokens ?? 0;
  if (maxParentForkTokens > 0 && parentTokens > maxParentForkTokens) {
    log.warn("fork_parent rejected by max-token guard", {
      event: "fork_parent_rejected_token_guard",
      parentSessionKey: parentTarget.canonicalKey,
      childSessionKey: params.childSessionKey,
      parentTokens,
      maxParentForkTokens,
    });
    throw new Error(
      `Unable to fork parent transcript: parent context is too large (${parentTokens} tokens > ${maxParentForkTokens} max).`,
    );
  }

  const childTarget = resolveGatewaySessionStoreTarget({
    cfg: params.cfg,
    key: params.childSessionKey,
  });
  const forked = await forkSessionFromParent({
    parentEntry,
    agentId: childTarget.agentId,
    sessionsDir: path.dirname(childTarget.storePath),
  });
  if (!forked?.sessionId || !forked.sessionFile) {
    log.warn("fork_parent failed because the fork substrate did not return a child transcript", {
      event: "fork_parent_failed_substrate",
      parentSessionKey: parentTarget.canonicalKey,
      childSessionKey: childTarget.canonicalKey,
    });
    throw new Error(
      "Unable to fork parent transcript: fork substrate did not produce a child session.",
    );
  }

  await updateSessionStore(
    childTarget.storePath,
    (store) => {
      pruneLegacyStoreKeys({
        store,
        canonicalKey: childTarget.canonicalKey,
        candidates: childTarget.storeKeys,
      });
      store[childTarget.canonicalKey] = mergeSessionEntry(store[childTarget.canonicalKey], {
        sessionId: forked.sessionId,
        sessionFile: forked.sessionFile,
        parentSessionKey: parentTarget.canonicalKey,
        forkedFromParent: true,
      });
    },
    {
      activeSessionKey: childTarget.canonicalKey,
    },
  );

  log.info("fork_parent materialized child transcript", {
    event: "fork_parent_succeeded",
    parentSessionKey: parentTarget.canonicalKey,
    childSessionKey: childTarget.canonicalKey,
    forkedSessionId: forked.sessionId,
  });

  return {
    contextMode: "fork_parent",
    parentSessionKey: parentTarget.canonicalKey,
    forkedSessionId: forked.sessionId,
    forkedSessionFile: forked.sessionFile,
  };
}
