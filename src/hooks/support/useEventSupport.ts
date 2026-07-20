"use client";

import { gql } from "@apollo/client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useCallback } from "react";

export interface AgentConversation {
  id: string;
  eventId: string;
  invitationId: string | null;
  guestUserId: string | null;
  guestName: string;
  guestContact: string | null;
  subject: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  channel: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  direction: string;
  channel: string;
  fromUserId: string | null;
  fromGuest: boolean;
  body: string | null;
  mediaUrl: string | null;
  mimeType: string | null;
  status: string;
  createdAt: string;
}

const UNASSIGNED_QUERY = gql`
  query UnassignedConversations($eventId: String!) {
    unassignedConversations(eventId: $eventId) {
      id
      eventId
      invitationId
      guestUserId
      guestName
      guestContact
      subject
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

const ASSIGNED_TO_ME_QUERY = gql`
  query AssignedToMeConversations($eventId: String!) {
    assignedToMeConversations(eventId: $eventId) {
      id
      eventId
      invitationId
      guestUserId
      guestName
      guestContact
      subject
      status
      priority
      assignedTo
      channel
      lastMessageAt
      lastMessagePreview
      createdAt
      updatedAt
    }
  }
`;

const MESSAGES_QUERY = gql`
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

const ASSIGN_MUTATION = gql`
  mutation AssignSupportConversation($conversationId: String!, $userId: String!) {
    assignSupportConversation(conversationId: $conversationId, userId: $userId) {
      id
      status
      assignedTo
      updatedAt
    }
  }
`;

const UNASSIGN_MUTATION = gql`
  mutation UnassignSupportConversation($conversationId: String!) {
    unassignSupportConversation(conversationId: $conversationId) {
      id
      status
      assignedTo
      updatedAt
    }
  }
`;

const CLOSE_MUTATION = gql`
  mutation CloseSupportConversation($conversationId: String!) {
    closeSupportConversation(conversationId: $conversationId) {
      id
      status
      updatedAt
      closedAt
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
      guestName
      status
      priority
      channel
      createdAt
      updatedAt
    }
  }
`;

export function useEventSupport(eventId: string, currentUserId?: string) {
  const {
    data: unassignedData,
    loading: unassignedLoading,
    refetch: refetchUnassigned,
  } = useQuery<{ unassignedConversations: AgentConversation[] }>(
    UNASSIGNED_QUERY,
    { variables: { eventId } },
  );

  const {
    data: assignedData,
    loading: assignedLoading,
    refetch: refetchAssigned,
  } = useQuery<{ assignedToMeConversations: AgentConversation[] }>(
    ASSIGNED_TO_ME_QUERY,
    { variables: { eventId } },
  );

  const [loadMessages] = useLazyQuery<{ supportMessages: SupportMessage[] }>(MESSAGES_QUERY);

  const [sendMessageMutation] = useMutation<{
    sendSupportMessage: SupportMessage;
  }>(SEND_MESSAGE_MUTATION);

  const [assignMutation] = useMutation<{
    assignSupportConversation: AgentConversation;
  }>(ASSIGN_MUTATION);

  const [unassignMutation] = useMutation<{
    unassignSupportConversation: AgentConversation;
  }>(UNASSIGN_MUTATION);

  const [closeMutation] = useMutation<{
    closeSupportConversation: AgentConversation;
  }>(CLOSE_MUTATION);

  const [createConversationMutation] = useMutation<{
    createSupportConversation: AgentConversation;
  }>(CREATE_CONVERSATION_MUTATION);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const result = await loadMessages({
        variables: { conversationId, limit: 100 },
      });
      return result.data?.supportMessages ?? [];
    },
    [loadMessages],
  );

  const sendMessage = useCallback(
    async (conversationId: string, body: string) => {
      const result = await sendMessageMutation({
        variables: { conversationId, body },
      });
      return result.data?.sendSupportMessage ?? null;
    },
    [sendMessageMutation],
  );

  const assignToMe = useCallback(
    async (conversationId: string) => {
      if (!currentUserId) return null;
      const result = await assignMutation({
        variables: { conversationId, userId: currentUserId },
      });
      await Promise.all([refetchUnassigned(), refetchAssigned()]);
      return result.data?.assignSupportConversation ?? null;
    },
    [assignMutation, currentUserId, refetchUnassigned, refetchAssigned],
  );

  const unassign = useCallback(
    async (conversationId: string) => {
      const result = await unassignMutation({
        variables: { conversationId },
      });
      await Promise.all([refetchUnassigned(), refetchAssigned()]);
      return result.data?.unassignSupportConversation ?? null;
    },
    [unassignMutation, refetchUnassigned, refetchAssigned],
  );

  const close = useCallback(
    async (conversationId: string) => {
      const result = await closeMutation({
        variables: { conversationId },
      });
      await Promise.all([refetchUnassigned(), refetchAssigned()]);
      return result.data?.closeSupportConversation ?? null;
    },
    [closeMutation, refetchUnassigned, refetchAssigned],
  );

  const createConversation = useCallback(
    async (guestName: string, firstMessage: string, channel = "WHATSAPP") => {
      const result = await createConversationMutation({
        variables: {
          eventId,
          guestName,
          firstMessage,
          channel,
          invitationId: null,
        },
      });
      await Promise.all([refetchUnassigned(), refetchAssigned()]);
      return result.data?.createSupportConversation ?? null;
    },
    [createConversationMutation, eventId, refetchUnassigned, refetchAssigned],
  );

  return {
    unassigned: unassignedData?.unassignedConversations ?? [],
    unassignedLoading,
    assigned: assignedData?.assignedToMeConversations ?? [],
    assignedLoading,
    fetchMessages,
    sendMessage,
    assignToMe,
    unassign,
    close,
    createConversation,
    refetchAll: useCallback(() => {
      refetchUnassigned();
      refetchAssigned();
    }, [refetchUnassigned, refetchAssigned]),
  };
}
