"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------
 * EntryExitHistory
 * - Shows last 10 entries and exits
 * - Two-column or stacked depending on screen size
 * ------------------------------------------------------------------- */
export default function EntryExitHistory({
  entries,
  exits,
}: {
  entries: { id: string; name: string; seat?: string; time: string }[];
  exits: { id: string; name: string; seat?: string; time: string }[];
}) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2.5,
        borderRadius: "24px",
        backdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.18)",
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Entry / Exit History
      </Typography>

      <Stack spacing={3}>
        <HistoryGroup label="Last 10 Entries" items={entries} color="#34c759" />
        <HistoryGroup label="Last 10 Exits" items={exits} color="#ff3b30" />
      </Stack>
    </Box>
  );
}

function HistoryGroup({
  label,
  items,
  color,
}: {
  label: string;
  items: { id: string; name: string; seat?: string; time: string }[];
  color: string;
}) {
  return (
    <Box>
      <Typography
        fontWeight={600}
        sx={{ color, display: "block", mb: 1, fontSize: "0.95rem" }}
      >
        {label}
      </Typography>

      <Stack spacing={1.1}>
        {items.map((i) => (
          <motion.div
            key={i.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography sx={{ opacity: 0.75 }}>
              {i.time} – {i.name} {i.seat ? `· Seat ${i.seat}` : ""}
            </Typography>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
}
