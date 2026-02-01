"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------
 * GateOverviewHeatmap
 * - Shows per-gate load, warnings, trend
 * - VisionOS style glowing heat gradient
 * --------------------------------------------------------------- */
export default function GateOverviewHeatmap({
  gates,
}: {
  gates: {
    id: string;
    name: string;
    scans: number;
    warnings: number;
    trend: "low" | "medium" | "high";
  }[];
}) {
  return (
    <Stack spacing={2}>
      {gates.map((g) => (
        <GateCard key={g.id} g={g} />
      ))}
    </Stack>
  );
}

function GateCard({
  g,
}: {
  g: {
    id: string;
    name: string;
    scans: number;
    warnings: number;
    trend: "low" | "medium" | "high";
  };
}) {
  const color =
    g.trend === "low"
      ? "rgba(52,199,89,0.45)"
      : g.trend === "medium"
      ? "rgba(255,204,0,0.45)"
      : "rgba(255,59,48,0.45)";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          borderRadius: "24px",
          backdropFilter: "blur(16px)",
          background: "rgba(255,255,255,0.22)",
          boxShadow: `0 0 22px ${color}`,
          borderLeft: `6px solid ${color}`,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
          {g.name}
        </Typography>

        <Typography sx={{ mt: 0.5, opacity: 0.75 }}>
          {g.scans} scans · {g.warnings} warnings
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "0.82rem",
            color: g.trend === "high" ? "#ff3b30" : "#555",
            fontWeight: 500,
          }}
        >
          Trend: {g.trend.toUpperCase()}
        </Typography>
      </Box>
    </motion.div>
  );
}
