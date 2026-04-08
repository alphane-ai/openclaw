import { describe, expect, it } from "vitest";
import { resolveAcpSessionInteractionMode } from "./session-interaction-mode.js";

describe("resolveAcpSessionInteractionMode", () => {
  it("treats oneshot spawned children as parent-owned background", () => {
    expect(
      resolveAcpSessionInteractionMode({
        spawnedBy: "agent:main:main",
        acp: {
          backend: "acpx",
          agent: "codex",
          runtimeSessionName: "codex",
          mode: "oneshot",
          state: "idle",
          lastActivityAt: Date.now(),
        },
      }),
    ).toBe("parent-owned-background");
  });

  it("does not treat fork-only provenance as parent ownership", () => {
    expect(
      resolveAcpSessionInteractionMode({
        parentSessionKey: "agent:main:main",
        forkedFromParent: true,
        acp: {
          backend: "acpx",
          agent: "codex",
          runtimeSessionName: "codex",
          mode: "oneshot",
          state: "idle",
          lastActivityAt: Date.now(),
        },
      }),
    ).toBe("interactive");
  });

  it("still treats dashboard child sessions as parent-owned background", () => {
    expect(
      resolveAcpSessionInteractionMode({
        parentSessionKey: "agent:main:main",
        acp: {
          backend: "acpx",
          agent: "codex",
          runtimeSessionName: "codex",
          mode: "oneshot",
          state: "idle",
          lastActivityAt: Date.now(),
        },
      }),
    ).toBe("parent-owned-background");
  });
});
