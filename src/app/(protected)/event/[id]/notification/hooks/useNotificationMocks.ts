"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useMemo } from "react";
import { getNotificationItems, getNotificationMessages } from "../mock/notification.mock";
import { NotificationChannel } from "../types/notification-channel.enum";
import type {
  EmailMessage,
  EmailThread,
  NotificationListItem,
  NotificationMessage,
  WhatsAppChat,
  WhatsAppMessage,
} from "../types/notification.models";

interface GqlConversation {
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

interface GqlMessage {
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

const SUPPORT_CONVERSATIONS_BY_EVENT = gql`
  query SupportConversationsByEvent($eventId: String!) {
    supportConversationsByEvent(eventId: $eventId) {
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
      closedAt
    }
  }
`;

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

const MESSAGE_SUBSCRIPTION = gql`
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

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toWhatsAppChat(c: GqlConversation): WhatsAppChat {
  return {
    id: c.id,
    channel: NotificationChannel.WHATSAPP,
    chatId: c.id,
    contactName: c.guestName,
    phoneNumber: c.guestContact ?? "",
    avatarColor: "#25D366",
    lastMessage: c.lastMessagePreview ?? "",
    lastMessageAt: formatTime(c.lastMessageAt),
    unreadCount: 0,
    isOnline: false,
    labels: [c.status, c.priority].filter(Boolean),
  };
}

function toEmailThread(c: GqlConversation): EmailThread {
  const [fromName, fromEmail] = c.guestContact
    ? [c.guestName, c.guestContact]
    : [c.guestName, `guest-${c.id.slice(0, 8)}@omnixys.events`];
  return {
    id: c.id,
    channel: NotificationChannel.EMAIL,
    chatId: c.id,
    subject: c.subject ?? "Support Conversation",
    fromName,
    fromEmail,
    preview: c.lastMessagePreview ?? "",
    updatedAt: formatTime(c.lastMessageAt),
    unreadCount: 0,
    hasAttachment: false,
    category: "Primary",
  };
}

function toWhatsAppMessage(m: GqlMessage): WhatsAppMessage {
  return {
    id: m.id,
    channel: NotificationChannel.WHATSAPP,
    direction: m.direction as "INBOUND" | "OUTBOUND",
    body: m.body ?? "",
    timestamp: formatTime(m.createdAt),
    delivered: m.status !== "FAILED",
    seen: m.status === "READ",
  };
}

function toEmailMessage(m: GqlMessage): EmailMessage {
  return {
    id: m.id,
    channel: NotificationChannel.EMAIL,
    fromName: m.fromGuest ? "Guest" : "Support Agent",
    fromEmail: "",
    toName: "Support",
    toEmail: "",
    body: m.body ?? "",
    timestamp: formatTime(m.createdAt),
    subject: "Re: Support Conversation",
  };
}

export function useNotificationItems(channel: NotificationChannel, eventId?: string) {
  const queryResult = useQuery<{ supportConversationsByEvent: GqlConversation[] }>(
    SUPPORT_CONVERSATIONS_BY_EVENT,
    {
      variables: { eventId },
      skip: !eventId || channel === NotificationChannel.IN_APP,
    },
  );

  const items = useMemo((): NotificationListItem[] => {
    if (channel === NotificationChannel.IN_APP) {
      return getNotificationItems(channel) as NotificationListItem[];
    }
    const conversations = queryResult.data?.supportConversationsByEvent ?? [];
    const filtered = conversations.filter((c) => c.channel === channel);
    if (channel === NotificationChannel.WHATSAPP) {
      return filtered.map(toWhatsAppChat);
    }
    return filtered.map(toEmailThread);
  }, [channel, queryResult.data]);

  return { items, loading: queryResult.loading };
}

export function useNotificationMessages(channel: NotificationChannel, chatId: string | null) {
  const queryResult = useQuery<{ supportMessages: GqlMessage[] }>(
    SUPPORT_MESSAGES_QUERY,
    {
      variables: { conversationId: chatId, limit: 100 },
      skip: !chatId || channel === NotificationChannel.IN_APP,
    },
  );

  const { data: subscriptionData } = useSubscription<{
    supportMessageReceived: GqlMessage;
  }>(MESSAGE_SUBSCRIPTION, {
    variables: { conversationId: chatId },
    skip: !chatId || channel === NotificationChannel.IN_APP,
  });

  const messages = useMemo((): NotificationMessage[] => {
    if (channel === NotificationChannel.IN_APP) {
      return getNotificationMessages(channel, chatId) as NotificationMessage[];
    }

    const msgs = queryResult.data?.supportMessages ?? [];
    const subMsg = subscriptionData?.supportMessageReceived;

    const allMsgs =
      subMsg && !msgs.some((m) => m.id === subMsg.id) ? [...msgs, subMsg] : msgs;

    if (channel === NotificationChannel.WHATSAPP) {
      return allMsgs.filter((m) => m.channel === channel).map(toWhatsAppMessage);
    }
    return allMsgs.filter((m) => m.channel === channel).map(toEmailMessage);
  }, [channel, chatId, queryResult.data, subscriptionData]);

  return { messages, loading: queryResult.loading };
}

export function useSendMessage() {
  const [sendMessageMutation] = useMutation<{ sendSupportMessage: GqlMessage }>(
    SEND_MESSAGE_MUTATION,
  );

  return async (conversationId: string, body: string) => {
    if (!conversationId || !body.trim()) return null;
    const result = await sendMessageMutation({
      variables: { conversationId, body: body.trim() },
    });
    return result.data?.sendSupportMessage ?? null;
  };
}
