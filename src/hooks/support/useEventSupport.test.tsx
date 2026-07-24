import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ChannelType,
  type Conversation,
  ConversationType,
  DeliveryStatus,
  type Message,
  MessageContentType,
} from "@/checkpoint/generated/graphql";
import { useEventSupport } from "./useEventSupport";

const apollo = vi.hoisted(() => {
  let _subscriptionOnData: ((arg: unknown) => void) | undefined;

  return {
    conversations: [] as Conversation[],
    messages: [] as Message[],
    subscriptionOptions: undefined as
      | { variables?: { conversationId?: string }; skip?: boolean }
      | undefined,
    sendMessageResult: undefined as Message | undefined,
    createWhatsappResult: undefined as Conversation | undefined,
    refetchConversations: vi.fn(),

    triggerOnData(payload: unknown) {
      _subscriptionOnData?.(payload);
    },
    setOnDataHandler(fn: ((arg: unknown) => void) | undefined) {
      _subscriptionOnData = fn;
    },
  };
});

vi.mock("@apollo/client/react", () => ({
  useQuery: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "Conversations") {
      return {
        data: { conversations: apollo.conversations },
        loading: false,
        refetch: apollo.refetchConversations,
      };
    }
    return { data: undefined, loading: false };
  },
  useLazyQuery: () => {
    const trigger = vi.fn().mockResolvedValue({ data: { messages: apollo.messages } });
    return [trigger, { data: undefined, loading: false }];
  },
  useMutation: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const op = document.definitions?.[0]?.name?.value;
    if (op === "SendMessage") {
      return [vi.fn().mockResolvedValue({ data: { sendMessage: apollo.sendMessageResult } })];
    }
    if (op === "CreateWhatsappConversation") {
      return [
        vi.fn().mockResolvedValue({
          data: { createWhatsappConversation: apollo.createWhatsappResult },
        }),
      ];
    }
    return [vi.fn()];
  },
  useSubscription: (
    _document: unknown,
    options: {
      variables?: { conversationId?: string };
      skip?: boolean;
      onData?: (arg: unknown) => void;
    },
  ) => {
    apollo.subscriptionOptions = options;
    if (options.onData) {
      apollo.setOnDataHandler(options.onData as (arg: unknown) => void);
    }
    return { data: undefined };
  },
}));

function conversation(id: string, type: ConversationType, channel: ChannelType): Conversation {
  return {
    __typename: "Conversation",
    id,
    type,
    channel,
    participants: [
      { __typename: "Participant", userId: "admin" },
      { __typename: "Participant", userId: "guest" },
    ],
    lastMessage: "last",
    lastMessageAt: "2026-01-01T00:00:00Z",
    unreadCount: 0,
    externalAddress: null,
    externalDisplayName: null,
  };
}

function message(id: string, conversationId: string, body: string): Message {
  return {
    __typename: "Message",
    id,
    conversationId,
    senderId: "guest",
    body,
    contentType: MessageContentType.TEXT,
    channel: ChannelType.WHATSAPP,
    deliveryStatus: DeliveryStatus.DELIVERED,
    createdAt: "2026-01-01T00:00:00Z",
    editedAt: null,
    deletedAt: null,
  };
}

describe("useEventSupport – channel filtering", () => {
  beforeEach(() => {
    apollo.conversations = [
      conversation("wa-1", ConversationType.DIRECT, ChannelType.WHATSAPP),
      conversation("inapp-1", ConversationType.SUPPORT, ChannelType.IN_APP),
      conversation("inapp-direct", ConversationType.DIRECT, ChannelType.IN_APP),
      conversation("email-1", ConversationType.DIRECT, ChannelType.EMAIL),
    ];
    apollo.subscriptionOptions = undefined;
  });

  it("filters to WHATSAPP conversations when channel is WHATSAPP", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["wa-1"]);
  });

  it("filters to IN_APP + SUPPORT conversations when channel is IN_APP", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    act(() => result.current.setChannel("IN_APP"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["inapp-1"]);
  });

  it("filters to EMAIL conversations when channel is EMAIL", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    act(() => result.current.setChannel("EMAIL"));
    expect(result.current.conversations.map((c) => c.id)).toEqual(["email-1"]);
  });
});

describe("useEventSupport – subscription", () => {
  beforeEach(() => {
    apollo.conversations = [conversation("wa-1", ConversationType.DIRECT, ChannelType.WHATSAPP)];
    apollo.subscriptionOptions = undefined;
  });

  it("skips subscription when no conversation is selected", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    expect(result.current.selectedId).toBeNull();
    expect(apollo.subscriptionOptions?.skip).toBe(true);
  });

  it("subscribes with correct conversationId when fetchMessages is called", async () => {
    apollo.messages = [message("m1", "wa-1", "Hello")];
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    expect(result.current.selectedId).toBe("wa-1");
    expect(apollo.subscriptionOptions).toMatchObject({
      variables: { conversationId: "wa-1" },
      skip: false,
    });
  });

  it("updates selectedId when switching conversations", async () => {
    apollo.conversations = [
      conversation("wa-1", ConversationType.DIRECT, ChannelType.WHATSAPP),
      conversation("wa-2", ConversationType.DIRECT, ChannelType.WHATSAPP),
    ];
    apollo.messages = [];
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });
    expect(result.current.selectedId).toBe("wa-1");

    await act(async () => {
      await result.current.fetchMessages("wa-2");
    });
    expect(result.current.selectedId).toBe("wa-2");
    expect(apollo.subscriptionOptions?.variables?.conversationId).toBe("wa-2");
  });
});

describe("useEventSupport – message fetching and merging", () => {
  beforeEach(() => {
    apollo.conversations = [conversation("wa-1", ConversationType.DIRECT, ChannelType.WHATSAPP)];
    apollo.messages = [message("m1", "wa-1", "Fetched msg")];
  });

  it("loads messages via fetchMessages and displays them", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      const msgs = await result.current.fetchMessages("wa-1");
      expect(msgs).toHaveLength(1);
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]!.body).toBe("Fetched msg");
  });

  it("returns empty messages when no conversation is selected", () => {
    const { result } = renderHook(() => useEventSupport("evt"));
    expect(result.current.messages).toEqual([]);
  });
});

describe("useEventSupport – sendMessage with optimistic update", () => {
  beforeEach(() => {
    apollo.conversations = [conversation("wa-1", ConversationType.DIRECT, ChannelType.WHATSAPP)];
    apollo.messages = [];
    apollo.sendMessageResult = message("sent-1", "wa-1", "Sent from admin");
  });

  it("adds sent message to realtime messages immediately", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    expect(result.current.messages).toHaveLength(0);

    await act(async () => {
      const sent = await result.current.sendMessage("wa-1", "Sent from admin");
      expect(sent?.id).toBe("sent-1");
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]!.id).toBe("sent-1");
    expect(result.current.messages[0]!.body).toBe("Sent from admin");
  });

  it("deduplicates sent message when subscription also fires", async () => {
    apollo.sendMessageResult = message("m-dedup", "wa-1", "Hey");

    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    await act(async () => {
      await result.current.sendMessage("wa-1", "Hey");
    });

    expect(result.current.messages).toHaveLength(1);

    const incomingDuplicate = message("m-dedup", "wa-1", "Hey");

    act(() => {
      apollo.triggerOnData({
        data: { data: { messageReceived: incomingDuplicate } },
      });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]!.id).toBe("m-dedup");
  });
});

describe("useEventSupport – real-time incoming message via subscription", () => {
  beforeEach(() => {
    apollo.conversations = [conversation("wa-1", ConversationType.DIRECT, ChannelType.WHATSAPP)];
    apollo.messages = [message("m0", "wa-1", "Initial")];
  });

  it("appends incoming subscription message to realtime messages", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    expect(result.current.messages).toHaveLength(1);

    const incoming = message("rt-1", "wa-1", "Realtime from guest");

    act(() => {
      apollo.triggerOnData({
        data: { data: { messageReceived: incoming } },
      });
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1]!.body).toBe("Realtime from guest");
  });

  it("uses selectedIdRef so onData works after state change", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    const incoming = message("rt-ref", "wa-1", "Via ref");

    act(() => {
      apollo.triggerOnData({
        data: { data: { messageReceived: incoming } },
      });
    });

    expect(result.current.messages.find((m) => m.id === "rt-ref")).toBeDefined();
  });

  it("ignores messages for a different conversation", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      await result.current.fetchMessages("wa-1");
    });

    const wrongConversation = message("rt-other", "wa-other", "Not this one");

    act(() => {
      apollo.triggerOnData({
        data: { data: { messageReceived: wrongConversation } },
      });
    });

    expect(result.current.messages.find((m) => m.id === "rt-other")).toBeUndefined();
  });
});

describe("useEventSupport – createConversation", () => {
  beforeEach(() => {
    apollo.conversations = [];
    apollo.createWhatsappResult = conversation(
      "new-wa",
      ConversationType.DIRECT,
      ChannelType.WHATSAPP,
    );
    apollo.refetchConversations.mockResolvedValue(undefined);
  });

  it("creates a WhatsApp conversation and refetches list", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      const conv = await result.current.createConversation("John", "Hi", "WHATSAPP", "+1234");
      expect(conv?.id).toBe("new-wa");
    });

    expect(apollo.refetchConversations).toHaveBeenCalled();
  });

  it("returns null for non-WhatsApp channels", async () => {
    const { result } = renderHook(() => useEventSupport("evt"));

    await act(async () => {
      const conv = await result.current.createConversation("John", "Hi", "EMAIL");
      expect(conv).toBeNull();
    });
  });
});
