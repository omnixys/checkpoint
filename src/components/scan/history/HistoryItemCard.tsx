"use client";

import React from "react";
import { Box, Typography, Chip, Stack, useTheme } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------- */
export interface HistoryEntry {
  guestName: string;
  ticketId: string;
  timestamp: string;
  gate: string;
  state: "INSIDE" | "OUTSIDE";
  verdict: "SUCCESS" | "REVOKED" | "WARNING";
}

/* ---------------------------------------------------------------------
 * VisionOS History Item Card
 * ------------------------------------------------------------------- */
export default function HistoryItemCard({ entry }: { entry: HistoryEntry }) {
  const theme = useTheme();

  const color =
    entry.verdict === "SUCCESS"
      ? theme.palette.success.main
      : entry.verdict === "REVOKED"
      ? theme.palette.error.main
      : theme.palette.warning.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(28px)",
          bgcolor: theme.palette.background.paper + "BB",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 12px 48px ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={1.2}>
          <Chip
            label={entry.verdict}
            sx={{
              bgcolor: color + "22",
              color,
              width: "fit-content",
              fontWeight: 600,
            }}
          />

          <Typography>
            <b>Gast:</b> {entry.guestName}
          </Typography>

          <Typography>
            <b>Ticket:</b> {entry.ticketId}
          </Typography>

          <Typography>
            <b>Zeit:</b> {new Date(entry.timestamp).toLocaleString()}
          </Typography>

          <Typography>
            <b>Gate:</b> {entry.gate} / {entry.state}
          </Typography>
        </Stack>
      </Box>
    </motion.div>
  );
}
