"use client";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

interface ChatHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface Props {
  displayName: string;
  channelLabel: string;
  channelColor: string;
  status?: string;
  actions?: ChatHeaderAction[];
  accent?: string;
}

export function WorkspaceChatHeader({
  displayName,
  channelLabel,
  channelColor,
  status = "Online",
  actions,
  accent,
}: Props) {
  const theme = useTheme();
  const headerAccent = accent ?? channelColor;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box
      sx={{
        alignItems: "center",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        display: "flex",
        gap: 1.5,
        px: { xs: 2, md: 3 },
        py: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Avatar
        sx={{
          bgcolor: alpha(headerAccent, 0.14),
          color: headerAccent,
          width: 42,
          height: 42,
          fontSize: "0.95rem",
          fontWeight: 700,
        }}
      >
        {displayName.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>{displayName}</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.25 }}>
          <Chip
            label={channelLabel}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.65rem",
              fontWeight: 600,
              bgcolor: alpha(channelColor, 0.12),
              color: channelColor,
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
          <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>{status}</Typography>
        </Stack>
      </Box>

      {actions && actions.length > 0 && (
        <>
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {actions.map((action) => (
              <MenuItem
                key={action.label}
                onClick={() => {
                  action.onClick();
                  setAnchorEl(null);
                }}
              >
                {action.icon && (
                  <Box component="span" sx={{ mr: 1, display: "flex", fontSize: 16 }}>
                    {action.icon}
                  </Box>
                )}
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}
