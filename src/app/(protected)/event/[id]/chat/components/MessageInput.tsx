"use client";

import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";

type Props = {
  chatId: string;
};

export function MessageInput({ chatId }: Props) {
  const [value, setValue] = useState("");
  const { send } = useSendMessage();

  async function handleSend() {
    if (!value) return;

    await send('+4915111951223', value);
    setValue("");
  }

  return (
    <Box sx={{ display: "flex", gap: 1, p: 1 }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button variant="contained" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
}
