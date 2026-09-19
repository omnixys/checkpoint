import { beforeEach, describe, expect, it, vi } from "vitest";

const websocket = vi.hoisted(() => ({
  options: undefined as
    | {
        connectionParams: () => Record<string, string>;
        on: {
          connecting: () => void;
          opened: (socket: { close: (code: number, reason: string) => void }) => void;
          connected: () => void;
          closed: (event: { code: number; reason: string }) => void;
          error: (error: unknown) => void;
        };
      }
    | undefined,
}));

vi.mock("graphql-ws", () => ({
  createClient: vi.fn((options) => {
    websocket.options = options;
    return {};
  }),
}));

vi.mock("@apollo/client/link/subscriptions", () => ({
  GraphQLWsLink: class GraphQLWsLink {
    constructor(readonly client: unknown) {}
  },
}));

describe("central GraphQL websocket transport", () => {
  beforeEach(() => {
    vi.resetModules();
    websocket.options = undefined;
  });

  it("reports lifecycle state and restarts active subscriptions with the current cookie", async () => {
    const transport = await import("./ws-link");
    expect(transport.createWsLinkWithAuth()).not.toBeNull();

    const on = websocket.options?.on;
    expect(on).toBeDefined();
    const close = vi.fn();
    on?.connecting();
    expect(transport.getRealtimeStatus()).toBe("connecting");
    on?.opened({ close });
    on?.connected();
    expect(transport.getRealtimeStatus()).toBe("connected");

    transport.restartWebSocketTransport();
    expect(close).toHaveBeenCalledWith(4205, "Client Restart");

    on?.closed({ code: 4205, reason: "Client Restart" });
    expect(transport.getRealtimeStatus()).toBe("reconnecting");
    on?.connecting();
    on?.connected();
    expect(transport.getRealtimeStatus()).toBe("connected");
  });

  it("exposes an authentication failure instead of showing the socket as offline", async () => {
    const transport = await import("./ws-link");
    transport.createWsLinkWithAuth();

    websocket.options?.on.closed({ code: 4401, reason: "Unauthorized" });

    expect(transport.getRealtimeStatus()).toBe("authentication_failed");
  });

  it("sends only the requested tenant in WebSocket connection parameters", async () => {
    const transport = await import("./ws-link");
    transport.createWsLinkWithAuth();

    expect(websocket.options?.connectionParams()).toEqual({
      "x-tenant-id": expect.any(String),
    });
  });
});
