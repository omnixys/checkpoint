import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  type InternalConversation,
  InternalConversationChannel,
  InternalConversationType,
  type InternalMessage,
  InternalMessagePriority,
} from "@/checkpoint/generated/graphql";
import { useEventInternalMessages } from "./useEventInternalMessages";

const apollo = vi.hoisted(() => ({
  conversations: [] as InternalConversation[],
  createConversation: vi.fn() as ReturnType<typeof vi.fn>,
  createConversationResult: undefined as InternalConversation | undefined,
  createConversationVariables: undefined as
    | {
        eventId: string;
        title: string;
        type: string;
        description: string | null;
        participantIds: string[];
      }
    | undefined,
  loadMessages: vi.fn(),
  markRead: vi.fn(),
  refetch: vi.fn(),
  sendMessage: vi.fn(),
  subscriptionOptions: undefined as
    | {
        onData?: (input: {
          data: { data?: { internalMessageReceived?: InternalMessage } };
        }) => void;
      }
    | undefined,
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: () => ({
    data: { internalConversations: apollo.conversations },
    loading: false,
    error: null,
    refetch: apollo.refetch,
  }),
  useLazyQuery: () => [apollo.loadMessages, { loading: false, error: null }],
  useMutation: (document: { definitions?: Array<{ name?: { value?: string } }> }) => {
    const operationName = document.definitions?.[0]?.name?.value;
    if (operationName === "CreateEventInternalConversation") {
      return [apollo.createConversation];
    }
    if (operationName === "SendEventInternalMessage") {
      return [apollo.sendMessage];
    }
    return [apollo.markRead];
  },
  useSubscription: (_document: unknown, options: typeof apollo.subscriptionOptions) => {
    apollo.subscriptionOptions = options;
    return { data: undefined };
  },
}));

function internalConversation(id: string, title: string): InternalConversation {
  return {
    __typename: "InternalConversation",
    id,
    eventId: "event-1",
    channel: InternalConversationChannel.IN_APP,
    title,
    description: null,
    type: InternalConversationType.DIRECT,
    roleId: null,
    createdBy: "user-1",
    isActive: true,
    archivedAt: null,
    createdAt: "2026-09-21T00:00:00.000Z",
    updatedAt: "2026-09-21T00:00:00.000Z",
    unreadCount: 0,
    participants: [
      {
        __typename: "InternalParticipant",
        id: "p-1",
        conversationId: id,
        userId: "user-1",
        joinedAt: "2026-09-21T00:00:00.000Z",
        lastReadAt: null,
        leftAt: null,
      },
      {
        __typename: "InternalParticipant",
        id: "p-2",
        conversationId: id,
        userId: "user-2",
        joinedAt: "2026-09-21T00:00:00.000Z",
        lastReadAt: null,
        leftAt: null,
      },
    ],
  };
}

function internalMessage(id: string, conversationId: string): InternalMessage {
  return {
    __typename: "InternalMessage",
    id,
    conversationId,
    senderId: "user-1",
    channel: InternalConversationChannel.IN_APP,
    body: id,
    priority: InternalMessagePriority.NORMAL,
    createdAt: "2026-09-21T00:00:00.000Z",
    editedAt: null,
  };
}

describe("useEventInternalMessages", () => {
  beforeEach(() => {
    apollo.conversations = [
      internalConversation("conv-existing", "Ops"),
      internalConversation("conv-team", "Team"),
    ];
    apollo.loadMessages.mockImplementation(async ({ variables }) => ({
      data: {
        internalMessages: [
          internalMessage(`initial-${variables.conversationId}`, variables.conversationId),
        ],
      },
    }));
    apollo.createConversationResult = internalConversation("conv-new", "Staff");
    apollo.createConversation.mockReset();
    apollo.createConversation.mockImplementation(
      async ({
        variables,
      }: {
        variables: {
          eventId: string;
          title: string;
          type: string;
          description: string | null;
          participantIds: string[];
        };
      }) => {
        apollo.createConversationVariables = variables;
        return { data: { createInternalConversation: apollo.createConversationResult } };
      },
    );
    apollo.createConversationVariables = undefined;
    apollo.sendMessage.mockReset();
    apollo.markRead.mockReset();
    apollo.refetch.mockReset();
    apollo.subscriptionOptions = undefined;
  });

  it("creates a direct conversation with participant ids and refreshes the inbox", async () => {
    const hook = renderHook(() => useEventInternalMessages("event-1"));

    await act(async () => {
      await hook.result.current.createConversation({
        title: "Admin, Safety",
        participantIds: ["user-2", "user-3"],
      });
    });

    expect(apollo.createConversationVariables).toEqual({
      eventId: "event-1",
      title: "Admin, Safety",
      type: "DIRECT",
      description: null,
      participantIds: ["user-2", "user-3"],
    });
    expect(apollo.refetch).toHaveBeenCalled();
    await waitFor(() => expect(hook.result.current.selectedId).toBe("conv-new"));
  });

  it("deduplicates participant ids and passes a description when provided", async () => {
    const hook = renderHook(() => useEventInternalMessages("event-1"));

    await act(async () => {
      await hook.result.current.createConversation({
        title: "Ops",
        description: " Night shift",
        participantIds: ["user-2", "user-2", "user-3"],
      });
    });

    expect(apollo.createConversationVariables).toEqual({
      eventId: "event-1",
      title: "Ops",
      type: "DIRECT",
      description: "Night shift",
      participantIds: ["user-2", "user-3"],
    });
  });

  it("returns null and skips the mutation without an event id", async () => {
    const hook = renderHook(() => useEventInternalMessages(undefined));

    let result: unknown;
    await act(async () => {
      result = await hook.result.current.createConversation({
        title: "Ops",
        participantIds: ["user-2"],
      });
    });

    expect(result).toBeNull();
    expect(apollo.createConversation).not.toHaveBeenCalled();
  });

  it("returns null without a title or participants", async () => {
    const hook = renderHook(() => useEventInternalMessages("event-1"));

    let result: unknown;
    await act(async () => {
      result = await hook.result.current.createConversation({ title: "", participantIds: [] });
    });

    expect(result).toBeNull();
    expect(apollo.createConversation).not.toHaveBeenCalled();
  });

  it("returns null when the mutation fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      apollo.createConversation.mockRejectedValueOnce(new Error("boom"));

      const hook = renderHook(() => useEventInternalMessages("event-1"));

      let result: unknown;
      await act(async () => {
        result = await hook.result.current.createConversation({
          title: "Ops",
          participantIds: ["user-2"],
        });
      });

      expect(result).toBeNull();
      expect(apollo.refetch).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });
});
