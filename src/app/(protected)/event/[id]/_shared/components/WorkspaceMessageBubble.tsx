"use client";

import { Box, Paper, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

interface Props {
  body: string;
  createdAt: string;
  fromAgent: boolean;
  deliveryStatus?: string | null;
  index?: number;
}

const MotionBox = motion.create(Box);

export function WorkspaceMessageBubble({
  body,
  createdAt,
  fromAgent,
  deliveryStatus,
  index = 0,
}: Props) {
  const theme = useTheme();

  return (
    <MotionBox
      initial={{ opacity: 0, x: fromAgent ? 12 : -12, y: 4 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      sx={{
        alignSelf: fromAgent ? "flex-end" : "flex-start",
        maxWidth: "72%",
        px: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: fromAgent
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : theme.palette.mode === "dark"
              ? alpha("#FFFFFF", 0.06)
              : alpha("#FFFFFF", 0.9),
          border: "1px solid",
          borderColor: fromAgent
            ? alpha(theme.palette.primary.main, 0.2)
            : alpha(theme.palette.divider, 0.08),
          borderRadius: fromAgent ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
          px: 3,
          py: 2,
          boxShadow: fromAgent
            ? `0 1px 2px ${alpha(theme.palette.primary.main, 0.08)}`
            : `0 1px 3px ${alpha("#000000", 0.06)}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.9rem",
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {body}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: fromAgent ? alpha(theme.palette.primary.main, 0.5) : "text.disabled",
            display: "block",
            fontSize: "0.65rem",
            mt: 0.75,
            textAlign: fromAgent ? "right" : "left",
          }}
        >
          {new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {fromAgent && deliveryStatus && (
            <Box component="span" sx={{ ml: 0.5 }}>
              {deliveryStatus === "READ" || deliveryStatus === "DELIVERED"
                ? "\u2713\u2713"
                : deliveryStatus === "SENT"
                  ? "\u2713"
                  : ""}
            </Box>
          )}
        </Typography>
      </Paper>
    </MotionBox>
  );
}
