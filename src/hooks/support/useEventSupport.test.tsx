import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ConversationChannel,
  ConversationPriority,
  ConversationStatus,
  type SupportConversation,
  type SupportMessage,
  SupportMessageDirection,
  SupportMessageStatus,
} from "@/checkpoint/generated/graphql";
import { useEventSupport } from "./useEventSupport";

const apollo = vi.hoisted(() => ({
  conversations: [] as SupportConversation[],
  messages: [] as SupportMessage[],
  sendMessageResult: undefined as SupportMessage | undefined,
  createResult: undefined as SupportConversation | undefined,
  refetchConversations: vi.fn(),
  createdVariables: [] as unknown[],
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "SupportConversationsByEvent") {
      return {
        data: { supportConversationsByEvent: apollo.conversations },
        loading: false,
        refetch: apollo.refetchConversations,
      };
    }
    return { data: undefined, loading: false, refetch: vi.fn() };
  },
  useLazyQuery: () => {
    const load = vi.fn().mockResolvedValue({ data: { supportMessages: apollo.messages } });
    return [load, { loading: false }];
  },
  useMutation: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "SendSupportMessage") {
      return [
        vi.fn().mockResolvedValue({ data: { sendSupportMessage: apollo.sendMessageResult } }),
      ];
    }
    if (op === "CreateSupportConversation") {
      return [
        vi.fn().mockImplementation((options: unknown) => {
          apollo.createdVariables.push(options);
          return Promise.resolve({ data: { createSupportConversation: apollo.createResult } });
        }),
      ];
    }
    return [vi.fn()];
  },
}));

function supportConversation(id: string, channel: ConversationChannel): SupportConversation {
  return {
    __typename: "SupportConversation",
    id,
    channel,
    eventId: "evt",
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
    assignedTo: null,
    closedAt: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

function supportMessage(id: string, conversationId: string, body: string): SupportMessage {
  return {
    __typename: "SupportMessage",
    id,
    conversationId,
    fromGuest: true,
    fromUserId: null,
    direction: SupportMessageDirection.INBOUND,
    body,
    mediaUrl: null,
    mimeType: null,
    status: SupportMessageStatus.DELIVERED,
    channel: ConversationChannel.WEBCHAT,
    createdAt: "2026-01-01T00:00:00Z",
    readAt: null,
    deliveredAt: null,
    externalId: null,
  };
}

describe("useEventSupport – channel filtering from support domain", () => {
  beforeEach(() => {
    apollo.conversations = [
      supportConversation("wa-1", ConversationChannel.WHATSAPP),
      supportConversation("webchat-1", ConversationChannel.WEBCHAT),
      supportConversation("sms-1", ConversationChannel.SMS),
      supportConversation("email-1", ConversationChannel.EMAIL),
    ];
  });

  it("filters to WHATSAPP conversations by default", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["wa-1"]);
  });

  it("maps WEBCHAT conversations to the IN_APP tab", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    act(() => result.current.setChannel("IN_APP"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["webchat-1"]);
    expect(result.current.conversations[0]!.channel).toBe("IN_APP");
  });

  it("filters to EMAIL conversations", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    act(() => result.current.setChannel("EMAIL"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["email-1"]);
  });
});

describe("useEventSupport – message fetching and sending", () => {
  beforeEach(() => {
    apollo.conversations = [supportConversation("wa-1", ConversationChannel.WHATSAPP)];
    apollo.messages = [];
    apollo.sendMessageResult = undefined;
    apollo.refetchConversations.mockReset();
    apollo.refetchConversations.mockResolvedValue(undefined);
  });

  it("loads messages via supportMessages and displays them", async () => {
    apollo.messages = [supportMessage("m1", "wa-1", "Fetched msg")];
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    expect(result.current.selectedId).toBe("wa-1");
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]!.body).toBe("Fetched msg");
  });

  it("adds a sent message to the conversation immediately", async () => {
    apollo.sendMessageResult = supportMessage("sent-1", "wa-1", "From staff");
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    await act(async () => {
      await result.current.sendMessage("wa-1", "From staff");
    });

    expect(result.current.messages.find((m) => m.id === "sent-1")).toBeDefined();
  });
});

describe("useEventSupport – createConversation", () => {
  beforeEach(() => {
    apollo.conversations = [];
    apollo.createResult = supportConversation("new", ConversationChannel.WHATSAPP);
    apollo.createdVariables = [];
    apollo.refetchConversations.mockReset();
    apollo.refetchConversations.mockResolvedValue(undefined);
  });

  it("creates a WhatsApp support conversation and returns its view", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      const conv = await result.current.createConversation("John", "Hi", "WHATSAPP", "+1234");
      expect(conv?.id).toBe("new");
    });

    expect(apollo.createdVariables).toHaveLength(1);
    const vars = (apollo.createdVariables[0] as { variables?: Record<string, unknown> }).variables;
    expect(vars).toMatchObject({
      eventId: "evt",
      guestName: "John",
      firstMessage: "Hi",
      guestContact: "+1234",
    });
    expect(apollo.refetchConversations).toHaveBeenCalled();
  });

  it("returns null for non-WhatsApp channels", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      const conv = await result.current.createConversation("John", "Hi", "EMAIL");
      expect(conv).toBeNull();
    });

    expect(apollo.createdVariables).toHaveLength(0);
  });
});
