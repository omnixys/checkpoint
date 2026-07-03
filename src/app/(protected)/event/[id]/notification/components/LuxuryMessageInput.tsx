"use client";

import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton, TextField } from "@mui/material";
import { useState } from "react";

export function LuxuryMessageInput() {
  const [value, setValue] = useState("");

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth={true}
          placeholder="Write a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              background: "rgba(255,255,255,0.05)",
              color: "white",
            },
          }}
        />
        <IconButton
          sx={{
            background: "linear-gradient(135deg, #5B8CFF, #7B61FF)",
            color: "white",
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
