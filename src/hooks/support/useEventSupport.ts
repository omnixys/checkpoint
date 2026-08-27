"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  type ConversationChannel,
  ConversationChannel as ConversationChannelValue,
  CreateSupportConversationDocument,
  type Message,
  SendSupportMessageDocument,
  type SupportConversation,
  SupportConversationsByEventDocument,
  type SupportMessageFieldsFragment,
  SupportMessagesDocument,
} from "@/checkpoint/generated/graphql";
import { appendMessageById, mergeMessagesById } from "@/checkpoint/hooks/internal/message-stream";
import { toChatMessage } from "@/checkpoint/hooks/support/useSupportChat";

export type { Message, SupportConversation };

export type SupportChannel = "WHATSAPP" | "IN_APP" | "EMAIL";

export type ConversationView = {
  id: string;
  externalDisplayName: string;
  channel: SupportChannel;
  lastMessage: string | null;
  lastMessageAt: string | null;
  externalAddress: string | null;
  unreadCount: number | null;
  status: string;
};

/** Map a support-domain channel to the workspace channel tab (WEBCHAT => IN_APP). */
function toWorkspaceChannel(channel: ConversationChannel): SupportChannel {
  if (channel === ConversationChannelValue.WEBCHAT) return "IN_APP";
  return channel as SupportChannel;
}

function matchesTab(channel: ConversationChannel, tab: SupportChannel): boolean {
  if (tab === "IN_APP") return channel === ConversationChannelValue.WEBCHAT;
  return channel === tab;
}

/**
 * Event-scoped staff support workspace backed by the notification support domain:
 * supportConversationsByEvent + supportMessages + sendSupportMessage.
 */
export function useEventSupport(eventId?: string) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const [channel, setChannel] = useState<SupportChannel>("WHATSAPP");
  const [realtimeByConversation, setRealtimeByConversation] = useState<
    Record<string, SupportMessageFieldsFragment[]>
  >({});
  const [fetchedMessages, setFetchedMessages] = useState<
    Record<string, SupportMessageFieldsFragment[]>
  >({});

  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery(SupportConversationsByEventDocument, {
    variables: { eventId: eventId ?? "" },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });

  const allConversations = (conversationsData?.supportConversationsByEvent ??
    []) as SupportConversation[];

  const conversations = useMemo<ConversationView[]>(() => {
    return allConversations
      .filter((c) => matchesTab(c.channel, channel))
      .map((c) => ({
        id: c.id,
        externalDisplayName: c.guestName,
        channel: toWorkspaceChannel(c.channel),
        lastMessage: c.lastMessagePreview ?? null,
        lastMessageAt: c.lastMessageAt ?? null,
        externalAddress: c.guestContact ?? null,
        unreadCount: c.unreadCount ?? 0,
        status: c.status,
      }));
  }, [allConversations, channel]);

  const [loadMessages, { loading: messagesLoading }] = useLazyQuery(SupportMessagesDocument);

  const [sendMessageMutation] = useMutation(SendSupportMessageDocument);
  const [createSupportConversationMutation] = useMutation(CreateSupportConversationDocument);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setSelectedId(conversationId);
      const result = await loadMessages({
        variables: { conversationId, limit: 100 },
      });
      const msgs = (result.data?.supportMessages ?? []) as SupportMessageFieldsFragment[];
      setFetchedMessages((prev) => ({ ...prev, [conversationId]: msgs }));
      return msgs;
    },
    [loadMessages],
  );

  const messages = useMemo<Message[]>(() => {
    if (!selectedId) return [];
    return mergeMessagesById(
      fetchedMessages[selectedId] ?? [],
      realtimeByConversation[selectedId] ?? [],
    ).map((m) => toChatMessage(m, null));
  }, [selectedId, fetchedMessages, realtimeByConversation]);

  const sendMessage = useCallback(
    async (conversationId: string, body: string) => {
      const result = await sendMessageMutation({
        variables: { conversationId, body: body.trim(), mediaUrl: undefined },
      });
      const message = result.data?.sendSupportMessage;
      if (message) {
        setRealtimeByConversation((current) => ({
          ...current,
          [conversationId]: appendMessageById<SupportMessageFieldsFragment>(
            current[conversationId] ?? [],
            message,
          ),
        }));
      }
      return message ?? null;
    },
    [sendMessageMutation],
  );

  const createConversation = useCallback(
    async (
      guestName: string,
      firstMessage: string,
      createChannel = "WHATSAPP",
      phoneNumber?: string,
    ) => {
      if (createChannel !== "WHATSAPP") return null;
      const result = await createSupportConversationMutation({
        variables: {
          eventId: eventId ?? "",
          guestName,
          firstMessage,
          channel: ConversationChannelValue.WHATSAPP,
          invitationId: null,
          guestContact: phoneNumber ?? null,
          subject: undefined,
        },
      });
      const conv = result.data?.createSupportConversation;
      await refetchConversations();
      if (!conv) return null;
      return {
        id: conv.id,
        externalDisplayName: conv.guestName,
        channel: toWorkspaceChannel(conv.channel),
        lastMessage: conv.lastMessagePreview ?? null,
        lastMessageAt: conv.lastMessageAt ?? null,
        externalAddress: conv.guestContact ?? null,
        unreadCount: conv.unreadCount ?? 0,
        status: conv.status,
      } satisfies ConversationView;
    },
    [eventId, createSupportConversationMutation, refetchConversations],
  );

  return {
    conversations,
    conversationsLoading,
    selectedId,
    setSelectedId,
    channel,
    setChannel,
    messages,
    messagesLoading,
    fetchMessages,
    sendMessage,
    close: async () => null,
    createConversation,
    refetchAll: useCallback(() => {
      refetchConversations();
    }, [refetchConversations]),
  };
}
