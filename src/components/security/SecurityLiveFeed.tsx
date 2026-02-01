"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
 * SecurityLiveFeed
 * - Realtime feed of ticket scan results
 * - Animated "pop in" effect + VisionOS depth shadow
 * --------------------------------------------------------------------- */
export default function SecurityLiveFeed({
  feed,
}: {
  feed: {
    id: string;
    name: string;
    seat: string;
    gate: string;
    verdict: "OK" | "WARNING" | "DENIED";
    time: string;
  }[];
}) {
  return (
    <Stack spacing={1.2}>
      {feed.map((f) => (
        <FeedItem key={f.id} f={f} />
      ))}
    </Stack>
  );
}

function FeedItem({
  f,
}: {
  f: {
    id: string;
    name: string;
    seat: string;
    gate: string;
    verdict: "OK" | "WARNING" | "DENIED";
    time: string;
  };
}) {
  const color =
    f.verdict === "OK"
      ? "#34c759"
      : f.verdict === "WARNING"
      ? "#ffcc00"
      : "#ff3b30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.8,
          borderRadius: "20px",
          background: "rgba(255,255,255,0.20)",
          backdropFilter: "blur(16px)",
          borderLeft: `6px solid ${color}`,
          boxShadow: `0 6px 22px ${color}33`,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
              {f.name}
            </Typography>
            <Typography sx={{ opacity: 0.65, fontSize: "0.82rem" }}>
              Seat {f.seat} — {f.gate}
            </Typography>
          </Stack>

          <Stack alignItems="flex-end">
            <Typography
              sx={{
                fontWeight: 600,
                color,
                letterSpacing: 0.5,
              }}
            >
              {f.verdict}
            </Typography>

            <Typography sx={{ opacity: 0.55, fontSize: "0.75rem" }}>
              {f.time}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  );
}
