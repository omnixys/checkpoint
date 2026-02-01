"use client";

import React from "react";
import { Box, Stack, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------
 * GuestsInsideList
 * - Shows a clean list of all guests currently inside the event
 * - VisionOS glass panel layout
 * ------------------------------------------------------------------- */
export default function GuestsInsideList({
  guests,
}: {
  guests: {
    id: string;
    name: string;
    seat?: string;
    timeIn: string;
  }[];
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
        Guests Inside
      </Typography>

      <Stack spacing={1.5}>
        {guests.map((g) => (
          <GuestRow key={g.id} g={g} />
        ))}
      </Stack>
    </Box>
  );
}

function GuestRow({
  g,
}: {
  g: { id: string; name: string; seat?: string; timeIn: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ width: 36, height: 36 }}>{g.name.substring(0, 1)}</Avatar>

        <Stack>
          <Typography fontWeight={600}>{g.name}</Typography>
          <Typography sx={{ opacity: 0.6, fontSize: "0.8rem" }}>
            Seat {g.seat ?? "-"} · In: {g.timeIn}
          </Typography>
        </Stack>
      </Stack>
    </motion.div>
  );
}
