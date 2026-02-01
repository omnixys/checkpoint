"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";

/* --------------------------------------------------------------
 * ConnectivityBadge
 * - Shows connection health for WS, Kafka, API
 * - Uses glowing dot indicators (VisionOS subtle style)
 * -------------------------------------------------------------- */
export default function SecurityConnectivityBadge({
  ws,
  kafka,
  api,
}: {
  ws: boolean;
  kafka: boolean;
  api: boolean;
}) {
  return (
    <Box
      sx={{
        backdropFilter: "blur(14px)",
        background: "rgba(255,255,255,0.18)",
        borderRadius: "20px",
        px: 2,
        py: 1.4,
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Dot label="WS" active={ws} />
        <Dot label="Kafka" active={kafka} />
        <Dot label="API" active={api} />
      </Stack>
    </Box>
  );
}

function Dot({ label, active }: { label: string; active: boolean }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: active ? "#34c759" : "#ff3b30",
          boxShadow: active
            ? "0 0 12px rgba(52,199,89,0.45)"
            : "0 0 12px rgba(255,59,48,0.45)",
        }}
      />
      <Typography sx={{ fontSize: "0.75rem", opacity: 0.72 }}>
        {label}
      </Typography>
    </Stack>
  );
}
