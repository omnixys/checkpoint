"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ChannelType,
  ChannelType as ChannelTypeValue,
  type ConversationChannel,
  ConversationChannel as ConversationChannelValue,
  CreateSupportConversationDocument,
  type DeliveryStatus,
  MarkConversationAsReadDocument,
  type Message,
  type MessageContentType,
  MySupportConversationsDocument,
  RsvpMarkConversationAsReadDocument,
  RsvpSendSupportMessageDocument,
  RsvpSupportConversationDocument,
  SendSupportMessageDocument,
  type SupportConversation,
  type SupportMessageFieldsFragment,
  type SupportMessageStatus,
  SupportMessagesDocument,
} from "@/checkpoint/generated/graphql";
import { appendMessageById, mergeMessagesById } from "@/checkpoint/hooks/internal/message-stream";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export type { SupportConversation, SupportMessageFieldsFragment as SupportMessage };

export type PendingMessage = {
  id: string;
  body: string;
  status: "sending" | "sent" | "failed";
  createdAt: string;
};

export type SupportChatMessage = Message;

/**
 * Map the notification support-domain `WEBCHAT` channel to the legacy in-app
 * channel used by the chat widget so guest chats render as in-app bubbles.
 */
function toDisplayChannel(channel: ConversationChannel): ChannelType {
  if (channel === ConversationChannelValue.WEBCHAT) {
    return ChannelTypeValue.IN_APP;
  }
  return channel as unknown as ChannelType;
}

function toDisplayDeliveryStatus(status: SupportMessageStatus): DeliveryStatus {
  return status as unknown as DeliveryStatus;
}

/**
 * Render the support message using the legacy `Message` shape the widget expects.
 * Guest-sent messages expose the current user id in `senderId` so they align right.
 */
export function toChatMessage(
  message: SupportMessageFieldsFragment,
  currentUserId: string | null,
): SupportChatMessage {
  const senderId = message.fromUserId ?? (message.fromGuest ? (currentUserId ?? "guest") : "agent");
  return {
    __typename: "Message",
    id: message.id,
    conversationId: message.conversationId,
    senderId,
    body: message.body ?? "",
    contentType: "TEXT" as MessageContentType,
    channel: toDisplayChannel(message.channel),
    deliveryStatus: toDisplayDeliveryStatus(message.status),
    createdAt: message.createdAt,
    editedAt: null,
    deletedAt: null,
  };
}

export const SUPPORT_CHANNEL: ConversationChannel = ConversationChannelValue.WEBCHAT;

interface UseSupportChatOptions {
  conversationId?: string | null;
  /** When provided, uses the public RSVP support flow instead of the authenticated one. */
  invitationId?: string | null;
  eventId?: string;
  guestName?: string;
}

export function useSupportChat({
  conversationId: initialConversationId,
  invitationId,
  eventId: explicitEventId,
  guestName: explicitGuestName,
}: UseSupportChatOptions = {}) {
  const { currentUser } = useAuth();
  const { activeEventId } = useActiveEvent();
  const currentUserId = currentUser?.id ?? null;
  const currentUserName = useMemo(
    () =>
      currentUser?.personalInfo?.firstName
        ? `${currentUser.personalInfo.firstName}${currentUser.personalInfo.lastName ? ` ${currentUser.personalInfo.lastName}` : ""}`
        : (currentUser?.username ?? null),
    [currentUser],
  );

  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [realtimeByConversation, setRealtimeByConversation] = useState<
    Record<string, SupportMessageFieldsFragment[]>
  >({});
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const creatingRef = useRef(false);

  const guestName = explicitGuestName ?? currentUserName ?? "Guest";

  const isRsvp = Boolean(invitationId);

  // ------------------------------------------------------------------
  // Authenticated guest flow
  // ------------------------------------------------------------------
  const { data: myConversationsData, loading: conversationsLoading } = useQuery(
    MySupportConversationsDocument,
    { skip: isRsvp, fetchPolicy: "cache-and-network" },
  );

  const activeConversations = useMemo(
    () => (myConversationsData?.mySupportConversations ?? []) as SupportConversation[],
    [myConversationsData],
  );

  const messagesQuery = useQuery(SupportMessagesDocument, {
    variables: { conversationId: conversationId ?? "", limit: 100 },
    skip: isRsvp || !conversationId,
  });

  // ------------------------------------------------------------------
  // RSVP flow
  // ------------------------------------------------------------------
  const rsvpConversationQuery = useQuery(RsvpSupportConversationDocument, {
    variables: {
      invitationId: invitationId ?? "",
      firstMessage: "",
      channel: SUPPORT_CHANNEL,
    },
    skip: !isRsvp,
  });
  const rsvpMessages = useMemo(
    () =>
      (rsvpConversationQuery.data?.rsvpSupportConversation.messages ??
        []) as SupportMessageFieldsFragment[],
    [rsvpConversationQuery.data],
  );
  const rsvpConversation = useMemo(
    () => rsvpConversationQuery.data?.rsvpSupportConversation.conversation ?? null,
    [rsvpConversationQuery.data],
  );

  useEffect(() => {
    if (!isRsvp || !rsvpConversation) return;
    setConversationId(rsvpConversation.id);
  }, [isRsvp, rsvpConversation]);

  // ------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------
  const [sendSupportMessageMutation, { loading: sending }] = useMutation(
    SendSupportMessageDocument,
  );
  const rsvpSendMutation = useMutation(RsvpSendSupportMessageDocument);
  const [createSupportConversationMutation] = useMutation(CreateSupportConversationDocument);
  const [markAsReadMutation] = useMutation(MarkConversationAsReadDocument);
  const rsvpMarkMutation = useMutation(RsvpMarkConversationAsReadDocument);

  const markAsRead = useCallback(
    (conversationIdToMark: string) => {
      if (isRsvp) {
        void rsvpMarkMutation[0]({ variables: { invitationId: conversationIdToMark } });
      } else {
        void markAsReadMutation({ variables: { conversationId: conversationIdToMark } });
      }
    },
    [isRsvp, rsvpMarkMutation, markAsReadMutation],
  );

  const sendMessage = useCallback(
    async (body: string) => {
      if (!body.trim()) return;

      const pendingId = `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const pending: PendingMessage = {
        id: pendingId,
        body: body.trim(),
        status: "sending",
        createdAt: new Date().toISOString(),
      };
      setPendingMessages((prev) => [...prev, pending]);

      const markFailed = () => {
        setPendingMessages((prev) =>
          prev.map((m) => (m.id === pendingId ? { ...m, status: "failed" as const } : m)),
        );
      };
      const markSent = () => {
        setPendingMessages((prev) => prev.filter((m) => m.id !== pendingId));
      };

      try {
        if (isRsvp) {
          const result = await rsvpSendMutation[0]({
            variables: {
              invitationId: invitationId ?? "",
              body: body.trim(),
              mediaUrl: undefined,
            },
          });
          const message = result.data?.rsvpSendSupportMessage;
          if (!message) {
            markFailed();
            return;
          }
          markSent();
          setRealtimeByConversation((current) => ({
            ...current,
            [message.conversationId]: appendMessageById<SupportMessageFieldsFragment>(
              current[message.conversationId] ?? [],
              message,
            ),
          }));
          return;
        }

        let activeConversationId = conversationId;
        // When we had to create the conversation, the server already persisted the
        // first message via `firstMessage`; do not send it again.
        let creationPersistedFirstMessage = false;

        if (!activeConversationId) {
          const eventScope = explicitEventId ?? activeEventId;
          if (!eventScope) {
            markFailed();
            return;
          }

          // Reuse the existing open WEBCHAT conversation for (guest, event) if present.
          const existing = activeConversations.find(
            (c) =>
              c.eventId === eventScope && c.status !== "CLOSED" && c.channel === SUPPORT_CHANNEL,
          );
          if (existing) {
            activeConversationId = existing.id;
            setConversationId(existing.id);
            setCreationError(null);
          } else {
            if (creatingRef.current) {
              markFailed();
              return;
            }
            creatingRef.current = true;
            setIsCreating(true);
            setCreationError(null);
            try {
              const result = await createSupportConversationMutation({
                variables: {
                  eventId: eventScope,
                  guestName,
                  firstMessage: body.trim(),
                  channel: SUPPORT_CHANNEL,
                  invitationId: null,
                  guestContact: undefined,
                  subject: undefined,
                },
              });
              const conv = result.data?.createSupportConversation;
              if (!conv) {
                throw new Error("Failed to create conversation");
              }
              activeConversationId = conv.id;
              setConversationId(conv.id);
              creationPersistedFirstMessage = true;
            } catch (err) {
              setCreationError(
                err instanceof Error ? err.message : "Failed to create conversation",
              );
              markFailed();
              return;
            } finally {
              creatingRef.current = false;
              setIsCreating(false);
            }
          }
        }

        if (creationPersistedFirstMessage) {
          markSent();
          return;
        }

        const result = await sendSupportMessageMutation({
          variables: {
            conversationId: activeConversationId,
            body: body.trim(),
            mediaUrl: undefined,
          },
        });
        const message = result.data?.sendSupportMessage;
        if (!message) {
          markFailed();
          return;
        }
        markSent();
        setRealtimeByConversation((current) => ({
          ...current,
          [message.conversationId]: appendMessageById<SupportMessageFieldsFragment>(
            current[message.conversationId] ?? [],
            message,
          ),
        }));
      } catch {
        markFailed();
      }
    },
    [
      isRsvp,
      rsvpSendMutation,
      invitationId,
      conversationId,
      explicitEventId,
      activeEventId,
      activeConversations,
      guestName,
      createSupportConversationMutation,
      sendSupportMessageMutation,
    ],
  );

  const retryMessage = useCallback(
    async (pending: PendingMessage) => {
      setPendingMessages((prev) => prev.filter((m) => m.id !== pending.id));
      await sendMessage(pending.body);
    },
    [sendMessage],
  );

  // ------------------------------------------------------------------
  // Message assembly (RSVP or authenticated)
  // ------------------------------------------------------------------
  const loadedMessages = isRsvp
    ? rsvpMessages
    : ((messagesQuery.data?.supportMessages ?? []) as SupportMessageFieldsFragment[]);

  const messages = useMemo(() => {
    if (!conversationId) return [] as SupportChatMessage[];
    const merged = mergeMessagesById(loadedMessages, realtimeByConversation[conversationId] ?? []);
    return merged.map((m) => toChatMessage(m, currentUserId));
  }, [conversationId, loadedMessages, realtimeByConversation, currentUserId]);

  // Mark conversation as read once messages are shown.
  const markedReadRef = useRef<string | null>(null);
  useEffect(() => {
    if (!conversationId || markedReadRef.current === conversationId) return;
    markedReadRef.current = conversationId;
    markAsRead(conversationId);
  }, [conversationId, markAsRead]);

  return {
    conversationId,
    messages,
    pendingMessages,
    latestMessage: messages[messages.length - 1] ?? null,
    sendMessage,
    retryMessage,
    sending,
    isCreating,
    creationError,
    messagesLoading: isRsvp ? rsvpConversationQuery.loading : messagesQuery.loading,
    messagesError: isRsvp ? rsvpConversationQuery.error : messagesQuery.error,
    conversationsLoading,
    myConversations: activeConversations,
    loadMore: () => {},
  };
}
