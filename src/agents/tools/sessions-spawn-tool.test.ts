import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => {
  const spawnSubagentDirectMock = vi.fn();
  const spawnAcpDirectMock = vi.fn();
  return {
    spawnSubagentDirectMock,
    spawnAcpDirectMock,
  };
});

vi.mock("../subagent-spawn.js", () => ({
  SUBAGENT_SPAWN_MODES: ["run", "session"],
  spawnSubagentDirect: (...args: unknown[]) => hoisted.spawnSubagentDirectMock(...args),
}));

vi.mock("../acp-spawn.js", () => ({
  ACP_SPAWN_MODES: ["run", "session"],
  ACP_SPAWN_STREAM_TARGETS: ["parent"],
  spawnAcpDirect: (...args: unknown[]) => hoisted.spawnAcpDirectMock(...args),
}));

let createSessionsSpawnTool: typeof import("./sessions-spawn-tool.js").createSessionsSpawnTool;

async function loadFreshSessionsSpawnToolModuleForTest() {
  vi.resetModules();
  vi.doMock("../subagent-spawn.js", () => ({
    SUBAGENT_SPAWN_MODES: ["run", "session"],
    spawnSubagentDirect: (...args: unknown[]) => hoisted.spawnSubagentDirectMock(...args),
  }));
  vi.doMock("../acp-spawn.js", () => ({
    ACP_SPAWN_MODES: ["run", "session"],
    ACP_SPAWN_STREAM_TARGETS: ["parent"],
    spawnAcpDirect: (...args: unknown[]) => hoisted.spawnAcpDirectMock(...args),
  }));
  ({ createSessionsSpawnTool } = await import("./sessions-spawn-tool.js"));
}

describe("sessions_spawn tool", () => {
  beforeEach(async () => {
    hoisted.spawnSubagentDirectMock.mockReset().mockResolvedValue({
      status: "accepted",
      childSessionKey: "agent:main:subagent:1",
      runId: "run-subagent",
    });
    hoisted.spawnAcpDirectMock.mockReset().mockResolvedValue({
      status: "accepted",
      childSessionKey: "agent:codex:acp:1",
      runId: "run-acp",
    });
    await loadFreshSessionsSpawnToolModuleForTest();
  });

  it("uses subagent runtime by default", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
      agentChannel: "discord",
      agentAccountId: "default",
      agentTo: "channel:123",
      agentThreadId: "456",
    });

    const result = await tool.execute("call-1", {
      task: "build feature",
      agentId: "main",
      model: "anthropic/claude-sonnet-4-6",
      thinking: "medium",
      runTimeoutSeconds: 5,
      thread: true,
      mode: "session",
      cleanup: "keep",
    });

    expect(result.details).toMatchObject({
      status: "accepted",
      childSessionKey: "agent:main:subagent:1",
      runId: "run-subagent",
    });
    expect(hoisted.spawnSubagentDirectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task: "build feature",
        agentId: "main",
        model: "anthropic/claude-sonnet-4-6",
        thinking: "medium",
        runTimeoutSeconds: 5,
        thread: true,
        mode: "session",
        cleanup: "keep",
      }),
      expect.objectContaining({
        agentSessionKey: "agent:main:main",
      }),
    );
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
  });

  it("passes inherited workspaceDir from tool context, not from tool args", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
      workspaceDir: "/parent/workspace",
    });

    await tool.execute("call-ws", {
      task: "inspect AGENTS",
      workspaceDir: "/tmp/attempted-override",
    });

    expect(hoisted.spawnSubagentDirectMock).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        workspaceDir: "/parent/workspace",
      }),
    );
  });

  it("routes to ACP runtime when runtime=acp", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
      agentChannel: "discord",
      agentAccountId: "default",
      agentTo: "channel:123",
      agentThreadId: "456",
    });

    const result = await tool.execute("call-2", {
      runtime: "acp",
      task: "investigate the failing CI run",
      agentId: "codex",
      cwd: "/workspace",
      thread: true,
      mode: "session",
      streamTo: "parent",
    });

    expect(result.details).toMatchObject({
      status: "accepted",
      childSessionKey: "agent:codex:acp:1",
      runId: "run-acp",
    });
    expect(hoisted.spawnAcpDirectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task: "investigate the failing CI run",
        agentId: "codex",
        cwd: "/workspace",
        thread: true,
        mode: "session",
        streamTo: "parent",
      }),
      expect.objectContaining({
        agentSessionKey: "agent:main:main",
      }),
    );
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
  });

  it("forwards ACP sandbox options and requester sandbox context", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:subagent:parent",
      sandboxed: true,
    });

    await tool.execute("call-2b", {
      runtime: "acp",
      task: "investigate",
      agentId: "codex",
      sandbox: "require",
    });

    expect(hoisted.spawnAcpDirectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task: "investigate",
        sandbox: "require",
      }),
      expect.objectContaining({
        agentSessionKey: "agent:main:subagent:parent",
        sandboxed: true,
      }),
    );
  });

  it("passes resumeSessionId through to ACP spawns", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    await tool.execute("call-2c", {
      runtime: "acp",
      task: "resume prior work",
      agentId: "codex",
      resumeSessionId: "7f4a78e0-f6be-43fe-855c-c1c4fd229bc4",
    });

    expect(hoisted.spawnAcpDirectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task: "resume prior work",
        agentId: "codex",
        resumeSessionId: "7f4a78e0-f6be-43fe-855c-c1c4fd229bc4",
      }),
      expect.any(Object),
    );
  });

  it("forwards fork_parent context to subagent spawns", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    await tool.execute("call-fork-subagent", {
      task: "continue with full context",
      contextMode: "fork_parent",
    });

    expect(hoisted.spawnSubagentDirectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task: "continue with full context",
        contextMode: "fork_parent",
      }),
      expect.any(Object),
    );
  });

  it("maps inheritParentTranscript to fork_parent for ACP spawns", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    await tool.execute("call-fork-acp", {
      runtime: "acp",
      task: "continue with full context",
      inheritParentTranscript: true,
    });

    expect(hoisted.spawnAcpDirectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        task: "continue with full context",
        contextMode: "fork_parent",
      }),
      expect.any(Object),
    );
  });

  it("rejects resumeSessionId without runtime=acp", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    const result = await tool.execute("call-guard", {
      task: "resume prior work",
      resumeSessionId: "7f4a78e0-f6be-43fe-855c-c1c4fd229bc4",
    });

    expect(JSON.stringify(result)).toContain("resumeSessionId is only supported for runtime=acp");
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
  });

  it("rejects conflicting contextMode and inheritParentTranscript values", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    const result = await tool.execute("call-conflict", {
      task: "resume prior work",
      contextMode: "fresh",
      inheritParentTranscript: true,
    });

    expect(JSON.stringify(result)).toContain("contextMode and inheritParentTranscript conflict");
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
  });

  it("rejects resumeSessionId together with fork_parent", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    const result = await tool.execute("call-fork-resume-conflict", {
      runtime: "acp",
      task: "resume prior work",
      contextMode: "fork_parent",
      resumeSessionId: "7f4a78e0-f6be-43fe-855c-c1c4fd229bc4",
    });

    expect(result.details).toMatchObject({
      status: "error",
      error: 'resumeSessionId is incompatible with contextMode="fork_parent".',
    });
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
  });

  it("rejects fork_parent without an active requester session", async () => {
    const tool = createSessionsSpawnTool();

    const result = await tool.execute("call-fork-no-requester", {
      task: "resume prior work",
      contextMode: "fork_parent",
    });

    expect(result.details).toMatchObject({
      status: "error",
      error: 'sessions_spawn contextMode="fork_parent" requires an active requester session.',
    });
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
  });

  it("rejects attachments for ACP runtime", async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
      agentChannel: "discord",
      agentAccountId: "default",
      agentTo: "channel:123",
      agentThreadId: "456",
    });

    const result = await tool.execute("call-3", {
      runtime: "acp",
      task: "analyze file",
      attachments: [{ name: "a.txt", content: "hello", encoding: "utf8" }],
    });

    expect(result.details).toMatchObject({
      status: "error",
    });
    const details = result.details as { error?: string };
    expect(details.error).toContain("attachments are currently unsupported for runtime=acp");
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
  });

  it('rejects streamTo when runtime is not "acp"', async () => {
    const tool = createSessionsSpawnTool({
      agentSessionKey: "agent:main:main",
    });

    const result = await tool.execute("call-3b", {
      runtime: "subagent",
      task: "analyze file",
      streamTo: "parent",
    });

    expect(result.details).toMatchObject({
      status: "error",
    });
    const details = result.details as { error?: string };
    expect(details.error).toContain("streamTo is only supported for runtime=acp");
    expect(hoisted.spawnAcpDirectMock).not.toHaveBeenCalled();
    expect(hoisted.spawnSubagentDirectMock).not.toHaveBeenCalled();
  });

  it("keeps attachment content schema unconstrained for llama.cpp grammar safety", () => {
    const tool = createSessionsSpawnTool();
    const schema = tool.parameters as {
      properties?: {
        attachments?: {
          items?: {
            properties?: {
              content?: {
                type?: string;
                maxLength?: number;
              };
            };
          };
        };
      };
    };

    const contentSchema = schema.properties?.attachments?.items?.properties?.content;
    expect(contentSchema?.type).toBe("string");
    expect(contentSchema?.maxLength).toBeUndefined();
  });
});
