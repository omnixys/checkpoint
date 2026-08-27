"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";

const SupportChatWidget = dynamic(
  () => import("@/checkpoint/components/support/chat/SupportChatWidget"),
  { ssr: false },
);

interface RsvpSupportChatProps {
  eventId: string;
  guestName: string;
  invitationId: string;
}

export default function RsvpSupportChat({ guestName, invitationId }: RsvpSupportChatProps) {
  const [initialized, setInitialized] = useState(false);

  const {
    messages,
    pendingMessages,
    latestMessage,
    sendMessage,
    retryMessage,
    sending,
    isCreating,
    messagesLoading,
  } = useSupportChat({ invitationId });

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
  }, [initialized]);

  return (
    <SupportChatWidget
      guestName={guestName}
      latestMessage={latestMessage}
      messages={messages}
      pendingMessages={pendingMessages}
      sending={sending}
      isCreating={isCreating}
      currentUserId="guest"
      onSend={sendMessage}
      onRetry={retryMessage}
      messagesLoading={messagesLoading}
    />
  );
}
