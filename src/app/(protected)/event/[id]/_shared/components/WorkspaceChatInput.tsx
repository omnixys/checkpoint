"use client";

import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
}

export function WorkspaceChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  sending = false,
  placeholder = "Type a message...",
}: Props) {
  const theme = useTheme();

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <Box
      sx={{
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        p: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.extended.surface.level2,
          borderRadius: 2,
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          border: `1px solid ${theme.palette.extended.border.subtle}`,
        }}
      >
        <InputBase
          disabled={disabled || sending}
          multiline
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxRows={4}
          value={value}
          sx={{ flex: 1, fontSize: "0.9rem", px: 1.5, py: 1 }}
        />
      </Box>
      <IconButton
        color="primary"
        disabled={!value.trim() || sending}
        onClick={onSend}
        size="medium"
        sx={{
          bgcolor: value.trim() ? "primary.main" : "transparent",
          color: value.trim() ? "primary.contrastText" : "text.disabled",
          width: 40,
          height: 40,
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: value.trim() ? "primary.dark" : "transparent",
          },
        }}
      >
        <SendIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
