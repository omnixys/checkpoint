import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChannelType, type Conversation, ConversationType } from "@/checkpoint/generated/graphql";
import { useSupportChat } from "./useSupportChat";

const apollo = vi.hoisted(() => ({
  conversations: [] as Conversation[],
  subscriptionOptions: undefined as
    | { variables?: { conversationId?: string }; skip?: boolean }
    | undefined,
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const operationName = document.definitions?.[0]?.name?.value;
    if (operationName === "Conversations") {
      return { data: { conversations: apollo.conversations }, loading: false };
    }
    return {
      data: { messages: [] },
      loading: false,
      error: undefined,
      fetchMore: vi.fn(),
    };
  },
  useMutation: () => [vi.fn(), { loading: false }],
  useSubscription: (_document: unknown, options: typeof apollo.subscriptionOptions) => {
    apollo.subscriptionOptions = options;
    return { data: undefined };
  },
}));

function conversation(id: string, type: ConversationType): Conversation {
  return {
    __typename: "Conversation",
    id,
    type,
    channel: ChannelType.IN_APP,
    participants: [
      { __typename: "Participant", userId: "caleb" },
      { __typename: "Participant", userId: "admin" },
    ],
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
    externalAddress: null,
    externalDisplayName: null,
  };
}

describe("useSupportChat conversation isolation", () => {
  beforeEach(() => {
    apollo.subscriptionOptions = undefined;
  });

  it("does not auto-select or subscribe to a DIRECT notification conversation", () => {
    apollo.conversations = [conversation("notification", ConversationType.DIRECT)];

    const hook = renderHook(() => useSupportChat({ conversationId: "notification" }));

    expect(hook.result.current.conversationId).toBeNull();
    expect(hook.result.current.myConversations).toEqual([]);
    expect(apollo.subscriptionOptions?.skip).toBe(true);
  });

  it("subscribes only when an explicit SUPPORT conversation exists", async () => {
    apollo.conversations = [
      conversation("notification", ConversationType.DIRECT),
      conversation("support", ConversationType.SUPPORT),
    ];

    const hook = renderHook(() => useSupportChat({ conversationId: "support" }));

    await waitFor(() => expect(hook.result.current.conversationId).toBe("support"));
    expect(hook.result.current.myConversations.map(({ id }) => id)).toEqual(["support"]);
    expect(apollo.subscriptionOptions).toMatchObject({
      variables: { conversationId: "support" },
      skip: false,
    });
  });
});
