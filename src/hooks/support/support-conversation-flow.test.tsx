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
import { useSupportChat } from "./useSupportChat";

const backend = vi.hoisted(() => ({
  actor: "guest" as "guest" | "support",
  realtime: undefined as SupportMessage | undefined,
  messages: [] as SupportMessage[],
  sequence: 0,
}));

const conversation: SupportConversation = {
  __typename: "SupportConversation",
  id: "conversation-1",
  channel: ConversationChannel.WEBCHAT,
  eventId: "event-1",
  guestName: "Test Guest",
  guestContact: null,
  guestUserId: "guest-1",
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
  createdAt: "2026-08-28T10:00:00.000Z",
  updatedAt: "2026-08-28T10:00:00.000Z",
};

function createMessage(body: string): SupportMessage {
  backend.sequence += 1;
  const fromGuest = backend.actor === "guest";
  return {
    __typename: "SupportMessage",
    id: `message-${backend.sequence}`,
    conversationId: conversation.id,
    fromGuest,
    fromUserId: fromGuest ? "guest-1" : "support-1",
    direction: fromGuest ? SupportMessageDirection.INBOUND : SupportMessageDirection.OUTBOUND,
    body,
    mediaUrl: null,
    mimeType: null,
    status: SupportMessageStatus.DELIVERED,
    channel: ConversationChannel.WEBCHAT,
    createdAt: `2026-08-28T10:00:0${backend.sequence}.000Z`,
    readAt: null,
    deliveredAt: null,
    externalId: null,
  };
}

vi.mock("@/checkpoint/providers/AuthProvider", () => ({
  useAuth: () => ({
    currentUser: { id: "guest-1", username: "test.guest" },
    isAuthenticated: true,
  }),
}));

vi.mock("@/checkpoint/providers/ActiveEventProvider", () => ({
  useActiveEvent: () => ({ activeEventId: "event-1" }),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const operation = document.definitions?.[0]?.name?.value;
    if (operation === "MySupportConversations") {
      return { data: { mySupportConversations: [conversation] }, loading: false };
    }
    if (operation === "SupportMessages") {
      return {
        data: { supportMessages: backend.messages },
        loading: false,
        error: undefined,
      };
    }
    if (operation === "SupportConversationsByEvent") {
      return {
        data: { supportConversationsByEvent: [conversation] },
        loading: false,
        refetch: vi
          .fn()
          .mockResolvedValue({ data: { supportConversationsByEvent: [conversation] } }),
      };
    }
    return { data: undefined, loading: false, error: undefined };
  },
  useLazyQuery: () => [
    vi.fn().mockImplementation(async () => ({ data: { supportMessages: backend.messages } })),
    { loading: false },
  ],
  useMutation: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const operation = document.definitions?.[0]?.name?.value;
    if (operation === "SendSupportMessage") {
      return [
        vi.fn().mockImplementation(async ({ variables }: { variables: { body: string } }) => {
          const message = createMessage(variables.body);
          backend.messages = [...backend.messages, message];
          backend.realtime = message;
          return { data: { sendSupportMessage: message } };
        }),
        { loading: false },
      ];
    }
    return [vi.fn().mockResolvedValue({ data: {} }), { loading: false }];
  },
  useSubscription: (
    document: { definitions?: Array<{ name?: { value?: string } }> },
    options?: { variables?: { conversationId?: string } },
  ) => {
    const operation = document.definitions?.[0]?.name?.value;
    if (
      operation === "SupportMessageReceived" &&
      backend.realtime?.conversationId === options?.variables?.conversationId
    ) {
      return { data: { supportMessageReceived: backend.realtime } };
    }
    return { data: undefined };
  },
}));

describe("IN_APP support conversation", () => {
  beforeEach(() => {
    backend.actor = "guest";
    backend.realtime = undefined;
    backend.messages = [];
    backend.sequence = 0;
  });

  it("delivers a complete guest/support conversation in realtime without duplicates", async () => {
    const guest = renderHook(() => useSupportChat({ conversationId: conversation.id }));
    const support = renderHook(() => useEventSupport(conversation.eventId));

    await act(async () => {
      await support.result.current.fetchMessages(conversation.id);
    });

    const sendGuestMessage = async (body: string) => {
      backend.actor = "guest";
      await act(async () => {
        await guest.result.current.sendMessage(body);
      });
      guest.rerender();
      support.rerender();
    };
    const sendSupportMessage = async (body: string) => {
      backend.actor = "support";
      await act(async () => {
        await support.result.current.sendMessage(conversation.id, body);
      });
      guest.rerender();
      support.rerender();
    };

    await sendGuestMessage("Hallo");
    await sendSupportMessage("Hallo, wie kann ich dir helfen?");
    await sendGuestMessage("Ich habe ein Problem mit der Anmeldung.");
    await sendSupportMessage("Bitte melde dich einmal ab und anschließend wieder an.");
    await sendGuestMessage("Danke, jetzt hat es geklappt.");
    await sendSupportMessage("Kein Problem, tschüss.");
    await sendGuestMessage("Ciao");

    const expectedBodies = [
      "Hallo",
      "Hallo, wie kann ich dir helfen?",
      "Ich habe ein Problem mit der Anmeldung.",
      "Bitte melde dich einmal ab und anschließend wieder an.",
      "Danke, jetzt hat es geklappt.",
      "Kein Problem, tschüss.",
      "Ciao",
    ];
    for (const view of [guest.result.current.messages, support.result.current.messages]) {
      expect(view).toHaveLength(7);
      expect(view.map((message) => message.body)).toEqual(expectedBodies);
      expect(view.map((message) => message.conversationId)).toEqual(
        Array.from({ length: 7 }, () => conversation.id),
      );
      expect(view.map((message) => message.senderId)).toEqual([
        "guest-1",
        "support-1",
        "guest-1",
        "support-1",
        "guest-1",
        "support-1",
        "guest-1",
      ]);
      expect(new Set(view.map((message) => message.id)).size).toBe(7);
    }

    backend.realtime = { ...createMessage("wrong conversation"), conversationId: "conversation-2" };
    guest.rerender();
    support.rerender();
    expect(guest.result.current.messages.map((message) => message.body)).toEqual(expectedBodies);
    expect(support.result.current.messages.map((message) => message.body)).toEqual(expectedBodies);

    guest.unmount();
    support.unmount();
    backend.realtime = undefined;

    const reloadedGuest = renderHook(() => useSupportChat({ conversationId: conversation.id }));
    const reloadedSupport = renderHook(() => useEventSupport(conversation.eventId));
    await act(async () => {
      await reloadedSupport.result.current.fetchMessages(conversation.id);
    });

    expect(reloadedGuest.result.current.messages.map((message) => message.body)).toEqual(
      expectedBodies,
    );
    expect(reloadedSupport.result.current.messages.map((message) => message.body)).toEqual(
      expectedBodies,
    );
  });
});
