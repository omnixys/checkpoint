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
  refetchConversations: vi.fn(),
  subscriptionMessage: undefined as SupportMessage | undefined,
  eventChange: undefined as { conversationId: string } | undefined,
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
    if (op === "MarkConversationAsRead") {
      return [vi.fn().mockResolvedValue({ data: { markConversationAsRead: undefined } })];
    }
    return [vi.fn()];
  },
  useSubscription: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "SupportMessageReceived") {
      return {
        data: apollo.subscriptionMessage
          ? { supportMessageReceived: apollo.subscriptionMessage }
          : undefined,
      };
    }
    if (op === "EventSupportConversationsChanged") {
      return {
        data: apollo.eventChange ? { eventConversationsChanged: apollo.eventChange } : undefined,
      };
    }
    return { data: undefined };
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
    guestUnreadCount: 0,
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

  it("opens WEBCHAT conversations in the IN_APP tab by default", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["webchat-1"]);
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
    apollo.subscriptionMessage = undefined;
    apollo.eventChange = undefined;
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

  it("adds an authorized realtime message without reloading", async () => {
    const { result, rerender } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    apollo.subscriptionMessage = supportMessage("realtime-1", "wa-1", "Live guest message");
    rerender();

    expect(result.current.messages.find((message) => message.id === "realtime-1")?.body).toBe(
      "Live guest message",
    );
  });

  it("refetches the event inbox after an event conversation change", async () => {
    apollo.eventChange = { conversationId: "new-conversation" };
    renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await Promise.resolve();
    });

    expect(apollo.refetchConversations).toHaveBeenCalled();
  });
});
