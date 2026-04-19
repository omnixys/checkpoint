"use client";

import { NotificationChannel } from "../types/notification-channel.enum";
import { useMessages as useWhatsAppMessages } from "./useMessages";

/**
 * Unified message model across all channels
 */
export type ChatMessage = {
  id: string;
  chatId: string;
  direction: "INBOUND" | "OUTBOUND";
  body: string;
  createdAt?: string;
};

/**
 * Placeholder implementations for other channels.
 * Replace with real GraphQL queries.
 */
function useInAppMessages(chatId: string | null) {
  return { messages: [] as ChatMessage[], loading: false };
}

function useEmailMessages(chatId: string | null) {
  return { messages: [] as ChatMessage[], loading: false };
}

/**
 * Channel-aware message selector.
 */
export function useChannelMessages(
  channel: NotificationChannel,
  chatId: string | null,
) {
  const whatsapp = useWhatsAppMessages(chatId);
  const inApp = useInAppMessages(chatId);
  const email = useEmailMessages(chatId);

  switch (channel) {
    case NotificationChannel.WHATSAPP:
      return {
        messages: whatsapp.messages,
        loading: whatsapp.loading,
      };

    case NotificationChannel.IN_APP:
      return inApp;

    case NotificationChannel.EMAIL:
      return email;

    default:
      return { messages: [], loading: false };
  }
}
