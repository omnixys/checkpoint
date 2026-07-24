"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { emptyStateEntry } from "../workspaceAnimation";

const MotionBox = motion.create(Box);

interface Props {
  title?: string;
  subtitle?: string;
}

export function WorkspaceEmptyState({
  title = "Select a conversation",
  subtitle = "Choose a conversation from the sidebar to open the detail view.",
}: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, display: "grid", placeItems: "center", p: 4 }}>
      <MotionBox
        {...emptyStateEntry}
        sx={{
          maxWidth: 560,
          width: "100%",
          p: 4,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            letterSpacing: 0,
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 1.25,
            color: alpha(theme.palette.text.primary, 0.64),
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </Typography>
      </MotionBox>
    </Box>
  );
}
