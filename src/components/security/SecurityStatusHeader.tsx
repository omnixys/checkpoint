"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------
 * SecurityStatusHeader
 * - Shows INSIDE, OUTSIDE, SCANS, ALERTS
 * - Designed as a VisionOS glass panel
 * ------------------------------------------------------------------ */
export default function SecurityStatusHeader({
  inside,
  outside,
  scans,
  alerts,
}: {
  inside: number;
  outside: number;
  scans: number;
  alerts: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Box
        sx={{
          backdropFilter: "blur(18px)",
          background: "rgba(255,255,255,0.22)",
          borderRadius: "28px",
          px: 3,
          py: 2.5,
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <StatusItem label="Inside" value={inside} />
          <StatusItem label="Outside" value={outside} />
          <StatusItem label="Scans" value={scans} />
          <StatusItem label="Alerts" value={alerts} glow />
        </Stack>
      </Box>
    </motion.div>
  );
}

function StatusItem({
  label,
  value,
  glow = false,
}: {
  label: string;
  value: number;
  glow?: boolean;
}) {
  return (
    <Stack
      spacing={0.4}
      sx={{
        alignItems: "center",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.78rem",
          opacity: 0.7,
          letterSpacing: 0,
          textAlign: "center",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "1.8rem",
          fontWeight: 600,
          color: glow ? "#ff3b30" : "inherit",
          textShadow: glow
            ? "0 0 12px rgba(255,59,48,0.35), 0 0 28px rgba(255,59,48,0.25)"
            : undefined,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
