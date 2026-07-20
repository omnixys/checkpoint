"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useState } from "react";

export interface SupportMessage {
  id: string;
  conversationId: string;
  direction: "INBOUND" | "OUTBOUND";
  channel: string;
  fromUserId: string | null;
  fromGuest: boolean;
  body: string | null;
  mediaUrl: string | null;
  mimeType: string | null;
  status: string;
  createdAt: string;
}

interface SupportConversation {
  id: string;
  eventId: string;
  invitationId: string | null;
  guestName: string;
  status: string;
  priority: string;
  channel: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UseSupportChatOptions {
  conversationId?: string | null;
  invitationId?: string | null;
  eventId?: string;
  guestName?: string;
}

const SUPPORT_MESSAGES_QUERY = gql`
  query SupportMessages($conversationId: String!, $limit: Int) {
    supportMessages(conversationId: $conversationId, limit: $limit) {
      id
      conversationId
      direction
      channel
      fromUserId
      fromGuest
      body
      mediaUrl
      mimeType
      status
      createdAt
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendSupportMessage($conversationId: String!, $body: String) {
    sendSupportMessage(conversationId: $conversationId, body: $body) {
      id
      conversationId
      direction
      channel
      fromUserId
      fromGuest
      body
      mediaUrl
      mimeType
      status
      createdAt
    }
  }
`;

const CREATE_CONVERSATION_MUTATION = gql`
  mutation CreateSupportConversation(
    $eventId: String!
    $guestName: String!
    $firstMessage: String!
    $channel: String!
    $invitationId: String
  ) {
    createSupportConversation(
      eventId: $eventId
      guestName: $guestName
      firstMessage: $firstMessage
      channel: $channel
      invitationId: $invitationId
    ) {
      id
      eventId
      invitationId
      guestName
      status
      priority
      channel
      createdAt
      updatedAt
    }
  }
`;

const MY_CONVERSATIONS_QUERY = gql`
  query MySupportConversations {
    mySupportConversations {
      id
      eventId
      invitationId
      guestName
      status
      priority
      channel
      lastMessageAt
      lastMessagePreview
      createdAt
      updatedAt
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription SupportMessageReceived($conversationId: String!) {
    supportMessageReceived(conversationId: $conversationId) {
      id
      conversationId
      direction
      channel
      fromUserId
      fromGuest
      body
      mediaUrl
      mimeType
      status
      createdAt
    }
  }
`;

export function useSupportChat({
  conversationId: initialConversationId,
  invitationId,
  eventId,
  guestName,
}: UseSupportChatOptions = {}) {
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    fetchMore: fetchMoreMessages,
  } = useQuery<{ supportMessages: SupportMessage[] }>(
    SUPPORT_MESSAGES_QUERY,
    {
      variables: { conversationId, limit: 50 },
      skip: !conversationId,
    },
  );

  const {
    data: myConversationsData,
    loading: conversationsLoading,
  } = useQuery<{ mySupportConversations: SupportConversation[] }>(
    MY_CONVERSATIONS_QUERY,
    { skip: !!conversationId },
  );

  useEffect(() => {
    if (conversationId) return;
    const convs = myConversationsData?.mySupportConversations;
    if (!convs || convs.length === 0) return;
    const active = convs.find(
      (c) => c.status === "OPEN" || c.status === "ASSIGNED",
    );
    if (active) {
      setConversationId(active.id);
    }
  }, [myConversationsData, conversationId]);

  const [sendMessageMutation, { loading: sending }] = useMutation<{
    sendSupportMessage: SupportMessage;
  }>(SEND_MESSAGE_MUTATION);

  const [createConversation] = useMutation<{
    createSupportConversation: SupportConversation;
  }>(CREATE_CONVERSATION_MUTATION);

  const { data: subscriptionData } = useSubscription<{
    supportMessageReceived: SupportMessage;
  }>(SUBSCRIPTION, {
    variables: { conversationId },
    skip: !conversationId,
  });

  const messages = messagesData?.supportMessages ?? [];

  const sendMessage = useCallback(
    async (body: string) => {
      if (!conversationId || !body.trim()) return;
      await sendMessageMutation({
        variables: { conversationId, body: body.trim() },
      });
    },
    [conversationId, sendMessageMutation],
  );

  const initializeConversation = useCallback(
    async (opts: {
      eventId: string;
      guestName: string;
      firstMessage?: string;
      invitationId?: string;
    }) => {
      setIsCreating(true);
      setCreationError(null);
      try {
        const result = await createConversation({
          variables: {
            eventId: opts.eventId,
            guestName: opts.guestName,
            firstMessage: opts.firstMessage ?? "",
            channel: "WEBCHAT",
            invitationId: opts.invitationId ?? null,
          },
        });
        const conv = result.data?.createSupportConversation;
        if (conv) {
          setConversationId(conv.id);
        }
      } catch (err) {
        setCreationError(
          err instanceof Error ? err.message : "Failed to create conversation",
        );
      } finally {
        setIsCreating(false);
      }
    },
    [createConversation],
  );

  const latestMessage =
    subscriptionData?.supportMessageReceived ?? null;

  const loadMore = useCallback(() => {
    if (!conversationId) return;
    fetchMoreMessages({
      variables: { conversationId, limit: 50, offset: messages.length },
    });
  }, [conversationId, fetchMoreMessages, messages.length]);

  return {
    conversationId,
    messages,
    latestMessage,
    sendMessage,
    sending,
    initializeConversation,
    isCreating,
    creationError,
    messagesLoading,
    messagesError,
    conversationsLoading,
    myConversations: myConversationsData?.mySupportConversations ?? [],
    loadMore,
  };
}
