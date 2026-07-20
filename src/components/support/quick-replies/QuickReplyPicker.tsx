"use client";

import QuickreplyIcon from "@mui/icons-material/Quickreply";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useQuickReplies } from "@/checkpoint/hooks/support/useQuickReplies";

interface QuickReplyPickerProps {
  onSelect: (body: string) => void;
}

export default function QuickReplyPicker({ onSelect }: QuickReplyPickerProps) {
  const theme = useTheme();
  const { quickReplies } = useQuickReplies();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  if (!quickReplies || quickReplies.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton size="small" onClick={handleClick} title="Quick replies">
        <QuickreplyIcon fontSize="small" />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} placement="top-end">
        <Paper
          sx={{
            maxHeight: 240,
            overflow: "auto",
            mt: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(12px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRadius: 2,
            minWidth: 280,
          }}
        >
          <List dense>
            {quickReplies.map((reply) => (
              <ListItemButton
                key={reply.id}
                onClick={() => {
                  onSelect(reply.body);
                  setAnchorEl(null);
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, fontFamily: "monospace" }}>
                      {reply.key}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                      }}
                    >
                      {reply.body}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
    </>
  );
}
