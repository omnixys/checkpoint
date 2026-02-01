"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------
 * AlertsRow
 * - Horizontal scroll carousel for warnings + critical events
 * - Each alert uses a subtle VisionOS glowing card
 * --------------------------------------------------------------- */
export default function SecurityAlertsRow({
  alerts,
}: {
  alerts: { id: string; message: string; severity: "warn" | "critical" }[];
}) {
  if (!alerts.length) return null;

  return (
    <Box sx={{ overflowX: "auto", py: 1 }}>
      <Stack direction="row" spacing={2}>
        {alerts.map((a) => (
          <AlertCard key={a.id} a={a} />
        ))}
      </Stack>
    </Box>
  );
}

function AlertCard({
  a,
}: {
  a: { id: string; message: string; severity: "warn" | "critical" };
}) {
  const color = a.severity === "critical" ? "#ff3b30" : "#ffcc00";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Box
        sx={{
          px: 2.2,
          py: 1.4,
          borderRadius: "20px",
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(16px)",
          boxShadow: `0 0 18px ${color}55`,
          border: `1px solid ${color}55`,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 500,
            color,
          }}
        >
          {a.message}
        </Typography>
      </Box>
    </motion.div>
  );
}
