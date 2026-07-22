"use client";

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
import {
  ConversationsDocument,
  MessagesDocument,
  SendMessageDocument,
  MessageReceivedDocument,
  type Conversation,
  type Message,
} from "@/checkpoint/generated/graphql";

interface GqlConversation {
  id: string;
  channel: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  externalAddress: string | null;
  externalDisplayName: string | null;
  participants: Array<{ userId: string }>;
}

interface GqlMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  contentType: string;
  channel: string;
  deliveryStatus: string;
  createdAt: string;
}

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
    contactName: c.externalDisplayName ?? "Guest",
    phoneNumber: c.externalAddress ?? "",
    avatarColor: "#25D366",
    lastMessage: c.lastMessage ?? "",
    lastMessageAt: formatTime(c.lastMessageAt),
    unreadCount: c.unreadCount,
    isOnline: false,
    labels: [],
  };
}

function toEmailThread(c: GqlConversation): EmailThread {
  const [fromName, fromEmail] = c.externalAddress
    ? [c.externalDisplayName ?? "Guest", c.externalAddress]
    : [c.externalDisplayName ?? "Guest", `guest-${c.id.slice(0, 8)}@omnixys.events`];
  return {
    id: c.id,
    channel: NotificationChannel.EMAIL,
    chatId: c.id,
    subject: "Support Conversation",
    fromName,
    fromEmail,
    preview: c.lastMessage ?? "",
    updatedAt: formatTime(c.lastMessageAt),
    unreadCount: c.unreadCount,
    hasAttachment: false,
    category: "Primary",
  };
}

function toWhatsAppMessage(m: GqlMessage): WhatsAppMessage {
  return {
    id: m.id,
    channel: NotificationChannel.WHATSAPP,
    direction: "INBOUND" as const,
    body: m.body,
    timestamp: formatTime(m.createdAt),
    delivered: m.deliveryStatus !== "FAILED",
    seen: m.deliveryStatus === "READ",
  };
}

function toEmailMessage(m: GqlMessage): EmailMessage {
  return {
    id: m.id,
    channel: NotificationChannel.EMAIL,
    fromName: "Guest",
    fromEmail: "",
    toName: "Support",
    toEmail: "",
    body: m.body,
    timestamp: formatTime(m.createdAt),
    subject: "Re: Support Conversation",
  };
}

export function useNotificationItems(channel: NotificationChannel, _eventId?: string) {
  const queryResult = useQuery<{ conversations: GqlConversation[] }>(
    ConversationsDocument,
    {
      skip: channel === NotificationChannel.IN_APP,
    },
  );

  const items = useMemo((): NotificationListItem[] => {
    if (channel === NotificationChannel.IN_APP) {
      return getNotificationItems(channel) as NotificationListItem[];
    }
    const conversations = queryResult.data?.conversations ?? [];
    const filtered = conversations.filter((c) => c.channel === channel);
    if (channel === NotificationChannel.WHATSAPP) {
      return filtered.map(toWhatsAppChat);
    }
    return filtered.map(toEmailThread);
  }, [channel, queryResult.data]);

  return { items, loading: queryResult.loading };
}

export function useNotificationMessages(channel: NotificationChannel, chatId: string | null) {
  const queryResult = useQuery<{ messages: GqlMessage[] }>(
    MessagesDocument,
    {
      variables: { conversationId: chatId ?? "", limit: 100 },
      skip: !chatId || channel === NotificationChannel.IN_APP,
    },
  );

  const { data: subscriptionData } = useSubscription<{
    messageReceived: GqlMessage;
  }>(MessageReceivedDocument, {
    variables: { conversationId: chatId ?? "" },
    skip: !chatId || channel === NotificationChannel.IN_APP,
  });

  const messages = useMemo((): NotificationMessage[] => {
    if (channel === NotificationChannel.IN_APP) {
      return getNotificationMessages(channel, chatId) as NotificationMessage[];
    }

    const msgs = queryResult.data?.messages ?? [];
    const subMsg = subscriptionData?.messageReceived;

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
  const [sendMessageMutation] = useMutation<{ sendMessage: Message }>(
    SendMessageDocument,
  );

  return async (conversationId: string, body: string) => {
    if (!conversationId || !body.trim()) return null;
    const result = await sendMessageMutation({
      variables: { conversationId, body: body.trim() },
    });
    return result.data?.sendMessage ?? null;
  };
}
