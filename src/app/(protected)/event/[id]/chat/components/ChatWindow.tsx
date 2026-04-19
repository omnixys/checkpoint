"use client";

import { Box } from "@mui/material";
import { useMessages } from "../hooks/useMessages";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useMessageSubscription } from "../hooks/useMessageSubscription";
import { createApolloClient } from "@/checkpoint/lib/apollo/client";

type Props = {
  chatId: string | null;
};

export function ChatWindow({ chatId }: Props) {
  const { messages } = useMessages(chatId);

  useMessageSubscription(chatId);

  if (!chatId) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessageList messages={messages} />
      <MessageInput chatId={chatId} />
    </Box>
  );
}
