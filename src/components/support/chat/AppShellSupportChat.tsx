"use client";

import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";
import { useCallback } from "react";
import dynamic from "next/dynamic";

const SupportChatWidget = dynamic(
  () => import("@/checkpoint/components/support/chat/SupportChatWidget"),
  { ssr: false },
);

export default function AppShellSupportChat() {
  const { isAuthenticated, currentUser } = useAuth();
  const { activeEventId } = useActiveEvent();

  const guestName = currentUser?.personalInfo?.firstName
    ? `${currentUser.personalInfo.firstName}${currentUser.personalInfo.lastName ? ` ${currentUser.personalInfo.lastName}` : ""}`
    : currentUser?.username ?? "Guest";

  const {
    conversationId,
    messages,
    latestMessage,
    sendMessage,
    sending,
    conversationsLoading,
    initializeConversation,
    isCreating,
  } = useSupportChat({});

  const handleStartConversation = useCallback(async () => {
    if (!activeEventId) return;
    await initializeConversation({
      eventId: activeEventId,
      guestName,
      firstMessage: "Hello, I need help",
    });
  }, [activeEventId, guestName, initializeConversation]);

  if (!isAuthenticated) return null;

  return (
    <SupportChatWidget
      guestName={guestName}
      latestMessage={latestMessage}
      messages={messages}
      sending={sending || isCreating}
      onSend={sendMessage}
      {...(activeEventId ? { onStartConversation: handleStartConversation } : {})}
      conversationExists={!!conversationId}
      conversationLoading={conversationsLoading || isCreating}
    />
  );
}
