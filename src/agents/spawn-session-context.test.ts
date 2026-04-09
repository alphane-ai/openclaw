import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../config/config.js";
import { loadSessionStore, updateSessionStore } from "../config/sessions.js";
import { appendAssistantMessageToSessionTranscript } from "../config/sessions/transcript.js";
import {
  assertSpawnChildSessionContextModeAllowed,
  materializeSpawnChildSessionContext,
} from "./spawn-session-context.js";

function createTestDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-spawn-context-"));
}

describe("materializeSpawnChildSessionContext", () => {
  const createdDirs: string[] = [];

  afterEach(() => {
    for (const dir of createdDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("forks the parent transcript into a child session entry", async () => {
    const dir = createTestDir();
    createdDirs.push(dir);
    const storePath = path.join(dir, "sessions.json");
    const cfg: OpenClawConfig = {
      session: {
        mainKey: "main",
        scope: "per-sender",
        store: storePath,
      },
    };
    const parentSessionKey = "agent:main:main";
    const childSessionKey = "agent:main:subagent:child-1";

    await updateSessionStore(storePath, (store) => {
      store[parentSessionKey] = {
        sessionId: "parent-session-id",
        updatedAt: Date.now(),
        totalTokens: 42,
      };
    });
    const appended = await appendAssistantMessageToSessionTranscript({
      agentId: "main",
      sessionKey: parentSessionKey,
      text: "parent transcript seed",
      storePath,
    });
    expect(appended.ok).toBe(true);

    const result = await materializeSpawnChildSessionContext({
      cfg,
      contextMode: "fork_parent",
      parentSessionKey,
      childSessionKey,
    });

    expect(result).toMatchObject({
      contextMode: "fork_parent",
      parentSessionKey,
    });
    const store = loadSessionStore(storePath, { skipCache: true });
    const parentEntry = store[parentSessionKey];
    const childEntry = store[childSessionKey];

    expect(childEntry).toMatchObject({
      forkedFromParent: true,
      forkSourceSessionKey: parentSessionKey,
    });
    expect(childEntry?.parentSessionKey).toBeUndefined();
    expect(childEntry?.sessionId).toBeTruthy();
    expect(childEntry?.sessionId).not.toBe(parentEntry?.sessionId);
    expect(childEntry?.sessionFile).toBeTruthy();
    expect(childEntry?.sessionFile).not.toBe(parentEntry?.sessionFile);
    expect(typeof childEntry?.sessionFile).toBe("string");
    expect(fs.existsSync(childEntry?.sessionFile ?? "")).toBe(true);
    expect(fs.readFileSync(childEntry?.sessionFile ?? "", "utf-8")).toContain(
      "parent transcript seed",
    );
  });

  it("fails fast when parent transcript exceeds the fork token guard", async () => {
    const dir = createTestDir();
    createdDirs.push(dir);
    const storePath = path.join(dir, "sessions.json");
    const cfg: OpenClawConfig = {
      session: {
        mainKey: "main",
        scope: "per-sender",
        store: storePath,
        parentForkMaxTokens: 10,
      },
    };
    const parentSessionKey = "agent:main:main";

    await updateSessionStore(storePath, (store) => {
      store[parentSessionKey] = {
        sessionId: "parent-session-id",
        updatedAt: Date.now(),
        totalTokens: 99,
      };
    });

    await expect(
      materializeSpawnChildSessionContext({
        cfg,
        contextMode: "fork_parent",
        parentSessionKey,
        childSessionKey: "agent:main:subagent:child-2",
      }),
    ).rejects.toThrow(/parent context is too large/i);
  });

  it("can defer parentSessionKey persistence until ownership is written", async () => {
    const dir = createTestDir();
    createdDirs.push(dir);
    const storePath = path.join(dir, "sessions.json");
    const cfg: OpenClawConfig = {
      session: {
        mainKey: "main",
        scope: "per-sender",
        store: storePath,
      },
    };
    const parentSessionKey = "agent:main:main";
    const childSessionKey = "agent:main:subagent:child-3";

    await updateSessionStore(storePath, (store) => {
      store[parentSessionKey] = {
        sessionId: "parent-session-id",
        updatedAt: Date.now(),
        totalTokens: 42,
      };
    });
    const appended = await appendAssistantMessageToSessionTranscript({
      agentId: "main",
      sessionKey: parentSessionKey,
      text: "parent transcript seed",
      storePath,
    });
    expect(appended.ok).toBe(true);

    await materializeSpawnChildSessionContext({
      cfg,
      contextMode: "fork_parent",
      parentSessionKey,
      childSessionKey,
      persistParentSessionKey: false,
    });

    const store = loadSessionStore(storePath, { skipCache: true });
    expect(store[childSessionKey]).toMatchObject({
      forkedFromParent: true,
      forkSourceSessionKey: parentSessionKey,
    });
    expect(store[childSessionKey]?.parentSessionKey).toBeUndefined();
  });

  it("rejects fork_parent when the feature flag is disabled", () => {
    const cfg: OpenClawConfig = {
      tools: {
        sessions_spawn: {
          forkParent: {
            enabled: false,
          },
        },
      },
    };

    expect(() =>
      assertSpawnChildSessionContextModeAllowed({
        cfg,
        contextMode: "fork_parent",
        parentSessionKey: "agent:main:main",
        childSessionKey: "agent:main:subagent:child-3",
      }),
    ).toThrow(/forkParent\.enabled/i);
  });
});
