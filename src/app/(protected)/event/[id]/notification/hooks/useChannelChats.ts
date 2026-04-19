"use client";

import { NotificationChannel } from "../types/notification-channel.enum";
import { useChats as useWhatsAppChats } from "./useChats";

/**
 * Generic chat model to unify all channels
 */
export type ChatListItem = {
  id: string;
  chatId: string;
  name: string;
  isGroup?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Placeholder hooks for other channels.
 * These must be replaced with real GraphQL queries.
 */
function useInAppChats(): { chats: ChatListItem[]; loading: boolean } {
  return { chats: [], loading: false };
}

function useEmailThreads(): { chats: ChatListItem[]; loading: boolean } {
  return { chats: [], loading: false };
}

/**
 * Channel-aware chat selector.
 * This ensures strict separation of data sources per channel.
 */
export function useChannelChats(channel: NotificationChannel) {
  const whatsapp = useWhatsAppChats();
  const inApp = useInAppChats();
  const email = useEmailThreads();

  switch (channel) {
    case NotificationChannel.WHATSAPP:
      return {
        chats: whatsapp.chats,
        loading: whatsapp.loading,
      };

    case NotificationChannel.IN_APP:
      return inApp;

    case NotificationChannel.EMAIL:
      return email;

    default:
      return { chats: [], loading: false };
  }
}
