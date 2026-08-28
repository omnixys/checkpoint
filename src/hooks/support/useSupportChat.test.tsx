import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ChannelType,
  ConversationChannel,
  ConversationPriority,
  ConversationStatus,
  type SupportConversation,
  type SupportMessage,
  SupportMessageDirection,
  SupportMessageStatus,
} from "@/checkpoint/generated/graphql";
import { toChatMessage, useSupportChat } from "./useSupportChat";

const apollo = vi.hoisted(() => {
  const createFn = vi.fn();
  const sendFn = vi.fn();
  const rsvpSendFn = vi.fn();
  const markReadFn = vi.fn().mockResolvedValue({ data: {} });
  const rsvpMarkReadFn = vi.fn().mockResolvedValue({ data: {} });

  return {
    myConversations: [] as SupportConversation[],
    messages: [] as SupportMessage[],
    rsvpMessages: [] as SupportMessage[],
    authenticatedRealtime: undefined as SupportMessage | undefined,
    rsvpRealtime: undefined as SupportMessage | undefined,
    currentUser: null as { id: string; username?: string; personalInfo?: unknown } | null,
    activeEventId: undefined as string | undefined,

    createFn,
    sendFn,
    rsvpSendFn,
    markReadFn,
    rsvpMarkReadFn,
  };
});

vi.mock("@/checkpoint/providers/AuthProvider", () => ({
  useAuth: () => ({
    currentUser: apollo.currentUser,
    isAuthenticated: Boolean(apollo.currentUser),
  }),
}));

vi.mock("@/checkpoint/providers/ActiveEventProvider", () => ({
  useActiveEvent: () => ({ activeEventId: apollo.activeEventId }),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "MySupportConversations") {
      return { data: { mySupportConversations: apollo.myConversations }, loading: false };
    }
    if (op === "SupportMessages") {
      return { data: { supportMessages: apollo.messages }, loading: false, error: undefined };
    }
    if (op === "RsvpSupportMessages") {
      return {
        data: { rsvpSupportMessages: apollo.rsvpMessages },
        loading: false,
        error: undefined,
      };
    }
    return { data: undefined, loading: false, error: undefined };
  },
  useMutation: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "CreateSupportConversation") return [apollo.createFn, { loading: false }];
    if (op === "SendSupportMessage") return [apollo.sendFn, { loading: false }];
    if (op === "RsvpSendSupportMessage") return [apollo.rsvpSendFn, { loading: false }];
    if (op === "MarkConversationAsRead") return [apollo.markReadFn, { loading: false }];
    if (op === "RsvpMarkConversationAsRead") return [apollo.rsvpMarkReadFn, { loading: false }];
    return [vi.fn(), { loading: false }];
  },
  useSubscription: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "SupportMessageReceived") {
      return {
        data: apollo.authenticatedRealtime
          ? { supportMessageReceived: apollo.authenticatedRealtime }
          : undefined,
      };
    }
    if (op === "RsvpSupportMessageReceived") {
      return {
        data: apollo.rsvpRealtime ? { rsvpSupportMessageReceived: apollo.rsvpRealtime } : undefined,
      };
    }
    return { data: undefined };
  },
}));

function supportConversation(
  id: string,
  overrides: Partial<SupportConversation> = {},
): SupportConversation {
  return {
    __typename: "SupportConversation",
    id,
    channel: ConversationChannel.WEBCHAT,
    eventId: "evt-1",
    guestName: "Guest",
    guestContact: null,
    guestUserId: null,
    invitationId: null,
    lastMessageAt: null,
    lastMessagePreview: null,
    priority: ConversationPriority.NORMAL,
    status: ConversationStatus.OPEN,
    subject: null,
    unreadCount: 0,
    guestUnreadCount: 0,
    assignedTo: null,
    closedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function supportMessage(
  id: string,
  conversationId: string,
  overrides: Partial<SupportMessage> = {},
): SupportMessage {
  return {
    __typename: "SupportMessage",
    id,
    conversationId,
    fromGuest: false,
    fromUserId: "agent-1",
    direction: SupportMessageDirection.INBOUND,
    body: "hi",
    mediaUrl: null,
    mimeType: null,
    status: SupportMessageStatus.DELIVERED,
    channel: ConversationChannel.WEBCHAT,
    createdAt: "2026-01-01T00:00:00Z",
    readAt: null,
    deliveredAt: null,
    externalId: null,
    ...overrides,
  };
}

describe("toChatMessage mapping", () => {
  it("maps a WEBCHAT guest message to an IN_APP bubble owned by the current user", () => {
    const src = supportMessage("m1", "c1", {
      fromGuest: true,
      fromUserId: null,
      body: "Need help",
      channel: ConversationChannel.WEBCHAT,
      status: SupportMessageStatus.SENT,
    });

    const msg = toChatMessage(src, "me-1");

    expect(msg).toMatchObject({
      __typename: "Message",
      id: "m1",
      senderId: "me-1",
      body: "Need help",
      channel: ChannelType.IN_APP,
      deliveryStatus: SupportMessageStatus.SENT,
      contentType: "TEXT",
    });
  });

  it("marks agent messages with the agent sender id", () => {
    const src = supportMessage("m2", "c1", {
      fromGuest: false,
      fromUserId: "agent-9",
      body: "We got it",
      channel: ConversationChannel.WHATSAPP,
    });

    const msg = toChatMessage(src, "me-1");

    expect(msg.senderId).toBe("agent-9");
    expect(msg.channel).toBe(ChannelType.WHATSAPP);
  });

  it("falls back to a guest sentinel when no current user exists", () => {
    const src = supportMessage("m3", "c1", {
      fromGuest: true,
      fromUserId: null,
      body: "Anon",
      channel: ConversationChannel.WEBCHAT,
    });

    expect(toChatMessage(src, null).senderId).toBe("guest");
  });
});

describe("useSupportChat – authenticated guest flow", () => {
  beforeEach(() => {
    apollo.currentUser = { id: "me-1" };
    apollo.activeEventId = "evt-1";
    apollo.myConversations = [];
    apollo.messages = [];
    apollo.rsvpMessages = [];
    apollo.authenticatedRealtime = undefined;
    apollo.rsvpRealtime = undefined;
    apollo.createFn.mockReset();
    apollo.sendFn.mockReset();
    apollo.rsvpSendFn.mockReset();
    apollo.markReadFn.mockResolvedValue({ data: {} });
    apollo.rsvpMarkReadFn.mockResolvedValue({ data: {} });
  });

  it("reuses an existing open WEBCHAT conversation for the active event", async () => {
    apollo.myConversations = [supportConversation("open-1")];
    apollo.sendFn.mockResolvedValue({
      data: { sendSupportMessage: supportMessage("sm-1", "open-1", { fromGuest: true }) },
    });

    const { result } = renderHook(() => useSupportChat());

    expect(result.current.conversationId).toBe("open-1");

    await act(async () => {
      await result.current.sendMessage("afternoon");
    });

    expect(apollo.createFn).not.toHaveBeenCalled();
    expect(apollo.sendFn).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({ conversationId: "open-1", body: "afternoon" }),
      }),
    );
  });

  it("switches to the open conversation of the selected event", () => {
    apollo.myConversations = [
      supportConversation("event-1", { eventId: "evt-1" }),
      supportConversation("event-2", { eventId: "evt-2" }),
    ];

    const { result, rerender } = renderHook(() => useSupportChat());
    expect(result.current.conversationId).toBe("event-1");

    apollo.activeEventId = "evt-2";
    rerender();

    expect(result.current.conversationId).toBe("event-2");
  });

  it("creates a new conversation when no open one exists and does not duplicate the first message", async () => {
    apollo.createFn.mockResolvedValue({
      data: { createSupportConversation: supportConversation("new-1") },
    });

    const { result } = renderHook(() => useSupportChat());

    await act(async () => {
      await result.current.sendMessage("first hello");
    });

    expect(apollo.createFn).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          eventId: "evt-1",
          firstMessage: "first hello",
          channel: ConversationChannel.WEBCHAT,
        }),
      }),
    );
    expect(apollo.sendFn).not.toHaveBeenCalled();
  });

  it("refuses to send when no active event is available", async () => {
    apollo.activeEventId = undefined;
    const { result } = renderHook(() => useSupportChat());

    await act(async () => {
      await result.current.sendMessage("orphan");
    });

    expect(apollo.createFn).not.toHaveBeenCalled();
    expect(apollo.sendFn).not.toHaveBeenCalled();
    expect(
      result.current.pendingMessages.some((m) => m.body === "orphan" && m.status === "failed"),
    ).toBe(true);
  });

  it("exposes pending messages while a send is in progress", async () => {
    apollo.myConversations = [supportConversation("open-1")];
    apollo.sendFn.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ data: { sendSupportMessage: supportMessage("x", "open-1") } }),
            10,
          ),
        ),
    );

    const { result } = renderHook(() => useSupportChat());

    let sendPromise: Promise<void>;
    act(() => {
      sendPromise = result.current.sendMessage("in flight");
    });

    expect(result.current.pendingMessages).toHaveLength(1);
    expect(result.current.pendingMessages[0]!.status).toBe("sending");

    await act(async () => {
      await sendPromise!;
    });
  });

  it("shows a support reply from the subscription without reloading", async () => {
    const { result, rerender } = renderHook(() => useSupportChat({ conversationId: "open-1" }));

    apollo.authenticatedRealtime = supportMessage("live-1", "open-1", {
      fromGuest: false,
      body: "Live answer",
    });
    rerender();

    expect(result.current.messages.find((message) => message.id === "live-1")?.body).toBe(
      "Live answer",
    );
  });
});

describe("useSupportChat – RSVP flow", () => {
  beforeEach(() => {
    apollo.currentUser = null;
    apollo.activeEventId = undefined;
    apollo.myConversations = [];
    apollo.messages = [];
    apollo.rsvpMessages = [supportMessage("m0", "rsvp-1", { fromGuest: true, body: "howdy" })];
    apollo.rsvpSendFn.mockReset();
    apollo.rsvpSendFn.mockResolvedValue({
      data: { rsvpSendSupportMessage: supportMessage("m1", "rsvp-1", { fromGuest: true }) },
    });
    apollo.createFn.mockReset();
    apollo.sendFn.mockReset();
    apollo.rsvpMarkReadFn.mockResolvedValue({ data: {} });
  });

  it("selects the RSVP conversation and shows its messages", async () => {
    const { result } = renderHook(() => useSupportChat({ invitationId: "inv-1" }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.conversationId).toBe("rsvp-1");
    expect(result.current.messages.map((m) => m.body)).toEqual(["howdy"]);
  });

  it("sends via the rsvp mutation and maps guest messages to the guest sentinel", async () => {
    const { result } = renderHook(() => useSupportChat({ invitationId: "inv-1" }));

    await act(async () => {
      await result.current.sendMessage("reply");
    });

    expect(apollo.rsvpSendFn).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({ invitationId: "inv-1", body: "reply" }),
      }),
    );
    expect(apollo.createFn).not.toHaveBeenCalled();
    expect(apollo.sendFn).not.toHaveBeenCalled();
    expect(result.current.conversationId).toBe("rsvp-1");
  });

  it("marks RSVP messages with the invitation capability, never the conversation id", async () => {
    renderHook(() => useSupportChat({ invitationId: "inv-1" }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(apollo.rsvpMarkReadFn).toHaveBeenCalledWith({
      variables: { invitationId: "inv-1" },
    });
  });
});
