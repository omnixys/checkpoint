"use client";

import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SupportChatWidget = dynamic(
  () => import("@/checkpoint/components/support/chat/SupportChatWidget"),
  { ssr: false },
);

interface RsvpSupportChatProps {
  eventId: string;
  guestName: string;
  invitationId: string;
}

export default function RsvpSupportChat({
  eventId,
  guestName,
  invitationId,
}: RsvpSupportChatProps) {
  const [initialized, setInitialized] = useState(false);

  const {
    conversationId,
    messages,
    latestMessage,
    sendMessage,
    sending,
    initializeConversation,
    isCreating,
  } = useSupportChat({ invitationId });

  useEffect(() => {
    if (initialized || isCreating || conversationId) return;
    setInitialized(true);
    initializeConversation({
      eventId,
      guestName,
      invitationId,
    });
  }, [
    initialized,
    isCreating,
    conversationId,
    eventId,
    guestName,
    invitationId,
    initializeConversation,
  ]);

  return (
    <SupportChatWidget
      guestName={guestName}
      latestMessage={latestMessage}
      messages={messages}
      sending={sending}
      onSend={sendMessage}
      conversationExists={!!conversationId}
      conversationLoading={isCreating}
    />
  );
}
