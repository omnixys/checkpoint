"use client";

import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { NotificationChannel } from "../types/notification-channel.enum";
import { useChannelSend } from "../hooks/useChannelSend";

type Props = {
  chatId: string;
  channel: NotificationChannel;
};

export function MessageInput({ chatId, channel }: Props) {
  const [value, setValue] = useState("");
  const { send, loading } = useChannelSend(channel);

  async function handleSend() {
    if (!value.trim()) return;

    await send(chatId, value);
    setValue("");
  }

  return (
    <Box sx={{ display: "flex", gap: 1, p: 1 }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
      />
      <Button variant="contained" onClick={handleSend} disabled={loading}>
        Send
      </Button>
    </Box>
  );
}
