"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { isGuestSupportChatRoute } from "./support-route";

const SupportChatWidget = dynamic(
  () => import("@/checkpoint/components/support/chat/SupportChatWidget"),
  { ssr: false },
);

export default function AppShellSupportChat() {
  const pathname = usePathname();
  const { isAuthenticated, currentUser } = useAuth();

  const guestName = currentUser?.personalInfo?.firstName
    ? `${currentUser.personalInfo.firstName}${currentUser.personalInfo.lastName ? ` ${currentUser.personalInfo.lastName}` : ""}`
    : (currentUser?.username ?? "Guest");

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

  if (!isAuthenticated) return null;
  if (isGuestSupportChatRoute(pathname)) return null;

  return (
    <SupportChatWidget
      guestName={guestName}
      latestMessage={latestMessage}
      messages={messages}
      pendingMessages={pendingMessages}
      sending={sending}
      isCreating={isCreating}
      currentUserId={currentUser?.id}
      onSend={sendMessage}
      onRetry={retryMessage}
      messagesLoading={messagesLoading}
    />
  );
}
