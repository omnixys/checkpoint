"use client";

import { Box } from "@mui/material";
import { NotificationChannel } from "../types/notification-channel.enum";
import { useChannelMessages } from "../hooks/useChannelMessages";
import { useMessageSubscription } from "../hooks/useMessageSubscription";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

type Props = {
  chatId: string | null;
  channel: NotificationChannel;
};

export function ChatWindow({ chatId, channel }: Props) {
  const { messages } = useChannelMessages(channel, chatId);

  /**
   * Only WhatsApp currently supports realtime subscriptions
   */
  if (channel === NotificationChannel.WHATSAPP) {
    useMessageSubscription(chatId);
  }

  if (!chatId) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessageList messages={messages} />
      <MessageInput chatId={chatId} channel={channel} />
    </Box>
  );
}
