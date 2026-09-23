"use client";

import { SupportChatPage } from "@/checkpoint/components/support/chat/SupportChatPage";
import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export default function SupportChatPageView() {
  const { currentUser } = useAuth();
  const {
    messages,
    pendingMessages,
    latestMessage,
    sendMessage,
    retryMessage,
    sending,
    isCreating,
    messagesLoading,
  } = useSupportChat({});

  return (
    <SupportChatPage
      currentUserId={currentUser?.id}
      latestMessage={latestMessage}
      messages={messages}
      pendingMessages={pendingMessages}
      sending={sending}
      isCreating={isCreating}
      onSend={sendMessage}
      onRetry={retryMessage}
      messagesLoading={messagesLoading}
    />
  );
}
