"use client";

import { useEffect } from "react";
import { useConversationUnreadSubscription } from "@/checkpoint/hooks/support/useConversationUnread";

export function ConversationUnreadWatcher({
  conversationId,
  onUpdate,
}: {
  conversationId: string | null;
  onUpdate: (conversationId: string, unreadCount: number) => void;
}) {
  const { unreadUpdate } = useConversationUnreadSubscription(conversationId);
  useEffect(() => {
    if (unreadUpdate) onUpdate(unreadUpdate.conversationId, unreadUpdate.unreadCount);
  }, [unreadUpdate, onUpdate]);
  return null;
}
