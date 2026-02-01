"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";

/* ----------------------------------------------------------------------
 * VisionOS Premium Sticky Header (Desktop Only)
 * ---------------------------------------------------------------------- */
export default function VisionOSStickyHeader({
  connectivity,
}: {
  connectivity: { ws: boolean; kafka: boolean; api: boolean };
}) {
  // Scroll progress for animation
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [1, 0.75]);
  const scale = useTransform(scrollY, [0, 120], [1, 0.98]);

  return (
    <motion.div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 120,
        opacity,
        scale,
      }}
    >
      <Box
        sx={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(22px)",
          borderRadius: "24px",
          px: 3,
          py: 1.8,
          mb: 2,
          boxShadow:
            "inset 0 0 0 0.6px rgba(255,255,255,0.35), 0 8px 30px rgba(0,0,0,0.18)",
          border: "1px solid rgba(255,255,255,0.22)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          {/* ---------- Title ---------- */}
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              background: "linear-gradient(90deg,#000,#555)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Security Dashboard
          </Typography>

          {/* ---------- Connectivity Status ---------- */}
          <Stack direction="row" spacing={2}>
            <StatusDot label="WS" active={connectivity.ws} />
            <StatusDot label="Kafka" active={connectivity.kafka} />
            <StatusDot label="API" active={connectivity.api} />
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------
 * Helper: Status Dot
 * ---------------------------------------------------------------------- */
function StatusDot({ label, active }: { label: string; active: boolean }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1.6,
        py: 0.6,
        borderRadius: "14px",
        background: active ? "rgba(52,199,89,0.25)" : "rgba(255,69,58,0.25)",
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: active ? "#34C759" : "#FF453A",
        }}
      />
      <Typography
        fontSize={"0.75rem"}
        fontWeight={500}
        sx={{ color: active ? "#34C759" : "#FF453A" }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
