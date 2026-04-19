"use client";

import { NotificationChannel } from "../types/notification-channel.enum";
import { useSendMessage as useWhatsAppSend } from "./useSendMessage";

/**
 * Placeholder implementations for other channels
 */
function useSendInApp() {
  return {
    send: async (_chatId: string, _message: string) => {},
    loading: false,
  };
}

function useSendEmail() {
  return {
    send: async (_chatId: string, _message: string) => {},
    loading: false,
  };
}

/**
 * Channel-aware send abstraction
 */
export function useChannelSend(channel: NotificationChannel) {
  const whatsapp = useWhatsAppSend();
  const inApp = useSendInApp();
  const email = useSendEmail();

  switch (channel) {
    case NotificationChannel.WHATSAPP:
      return whatsapp;

    case NotificationChannel.IN_APP:
      return inApp;

    case NotificationChannel.EMAIL:
      return email;

    default:
      return {
        send: async () => {},
        loading: false,
      };
  }
}
