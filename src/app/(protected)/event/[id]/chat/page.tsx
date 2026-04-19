"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";

export default function ChatPage() {
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: 300, borderRight: "1px solid #eee" }}>
        <ChatList selectedChatId={chatId} onSelect={setChatId} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <ChatWindow chatId={chatId} />
      </Box>
    </Box>
  );
}
