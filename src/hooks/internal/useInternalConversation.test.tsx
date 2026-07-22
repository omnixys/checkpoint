import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ChannelType,
  type Conversation,
  ConversationType,
  DeliveryStatus,
  type Message,
  MessageContentType,
} from "@/checkpoint/generated/graphql";
import { useInAppConversation } from "./useInternalConversation";

const apollo = vi.hoisted(() => ({
  conversations: [] as Conversation[],
  createConversation: vi.fn(),
  fetchMessages: vi.fn(),
  refetchConversations: vi.fn(),
  sendMessage: vi.fn(),
  subscriptionOptions: undefined as
    | {
        variables?: { conversationId?: string };
        onData?: (input: { data: { data?: { messageReceived?: Message } } }) => void;
      }
    | undefined,
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: () => ({
    data: { conversations: apollo.conversations },
    loading: false,
    refetch: apollo.refetchConversations,
  }),
  useLazyQuery: () => [apollo.fetchMessages],
  useMutation: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const operationName = document.definitions?.[0]?.name?.value;
    return operationName === "CreateInAppConversation"
      ? [apollo.createConversation]
      : [apollo.sendMessage];
  },
  useSubscription: (_document: unknown, options: typeof apollo.subscriptionOptions) => {
    apollo.subscriptionOptions = options;
    return { data: undefined };
  },
}));

function conversation(id: string, participantIds: string[]): Conversation {
  return {
    __typename: "Conversation",
    id,
    type: ConversationType.DIRECT,
    channel: ChannelType.IN_APP,
    participants: participantIds.map((userId) => ({ __typename: "Participant", userId })),
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
    externalAddress: null,
    externalDisplayName: null,
  };
}

function message(id: string, conversationId: string): Message {
  return {
    __typename: "Message",
    id,
    conversationId,
    senderId: "admin",
    body: id,
    contentType: MessageContentType.TEXT,
    channel: ChannelType.IN_APP,
    deliveryStatus: DeliveryStatus.SENT,
    createdAt: "2026-07-23T00:00:00.000Z",
    editedAt: null,
    deletedAt: null,
  };
}

describe("useInAppConversation", () => {
  beforeEach(() => {
    apollo.conversations = [
      conversation("admin-caleb", ["admin", "caleb"]),
      conversation("caleb-rachel", ["caleb", "rachel"]),
    ];
    apollo.fetchMessages.mockImplementation(async ({ variables }) => ({
      data: {
        messages: [message(`initial-${variables.conversationId}`, variables.conversationId)],
      },
    }));
    apollo.sendMessage.mockReset();
    apollo.createConversation.mockReset();
    apollo.refetchConversations.mockReset();
    apollo.subscriptionOptions = undefined;
  });

  it("accumulates events, deduplicates the mutation response, and switches subscriptions", async () => {
    const hook = renderHook(() => useInAppConversation("caleb"));

    await act(() => hook.result.current.findOrCreateDirectConversation("admin"));
    await waitFor(() => expect(hook.result.current.selectedConversationId).toBe("admin-caleb"));
    await waitFor(() => expect(hook.result.current.messages).toHaveLength(1));
    expect(apollo.subscriptionOptions?.variables?.conversationId).toBe("admin-caleb");

    const realtime = message("realtime", "admin-caleb");
    act(() => {
      apollo.subscriptionOptions?.onData?.({ data: { data: { messageReceived: realtime } } });
    });
    expect(hook.result.current.messages.map((item) => item.id)).toEqual([
      "initial-admin-caleb",
      "realtime",
    ]);

    apollo.sendMessage.mockResolvedValue({ data: { sendMessage: realtime } });
    await act(() => hook.result.current.sendMessage("Hallo"));
    expect(hook.result.current.messages.filter((item) => item.id === "realtime")).toHaveLength(1);

    act(() => {
      apollo.subscriptionOptions?.onData?.({
        data: { data: { messageReceived: message("second", "admin-caleb") } },
      });
    });
    expect(hook.result.current.messages.map((item) => item.id)).toContain("second");

    await act(() => hook.result.current.findOrCreateDirectConversation("rachel"));
    await waitFor(() => expect(hook.result.current.selectedConversationId).toBe("caleb-rachel"));
    await waitFor(() =>
      expect(hook.result.current.messages.map((item) => item.id)).toEqual(["initial-caleb-rachel"]),
    );
    expect(apollo.subscriptionOptions?.variables?.conversationId).toBe("caleb-rachel");
  });
});
