"use client";

import { useMemo } from "react";
import { getNotificationItems, getNotificationMessages } from "../mock/notification.mock";
import { NotificationChannel } from "../types/notification-channel.enum";

export function useNotificationItems(channel: NotificationChannel) {
  const items = useMemo(() => getNotificationItems(channel), [channel]);

  return {
    items,
    loading: false,
  };
}

export function useNotificationMessages(channel: NotificationChannel, chatId: string | null) {
  const messages = useMemo(() => getNotificationMessages(channel, chatId), [channel, chatId]);

  return {
    messages,
    loading: false,
  };
}
