"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function VisionOSCompactHeader({
  connectivity,
}: {
  connectivity: { ws: boolean; kafka: boolean; api: boolean };
}) {
  const [mode, setMode] = React.useState<"title" | "status">("title");

  /* ---- Automatic switching every 2.8s ---- */
  React.useEffect(() => {
    const int = setInterval(() => {
      setMode((m) => (m === "title" ? "status" : "title"));
    }, 2800);
    return () => clearInterval(int);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        px: 2,
           py: 1.8,
        pt: 1,
      }}
    >
      <Box
        sx={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(22px)",
          borderRadius: "18px",
          px: 2,
          py: 1,
          boxShadow:
            "inset 0 0 0 0.6px rgba(255,255,255,0.4), 0 6px 22px rgba(0,0,0,0.16)",
          border: "1px solid rgba(255,255,255,0.22)",
        }}
      >
        <Box
          sx={{
            height: 32, // fixed height for animation consistency
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            {mode === "title" && (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    letterSpacing: "-0.4px",
                    background: "linear-gradient(90deg,#000,#555)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    whiteSpace: "nowrap",
                  }}
                >
                  Security Dashboard
                </Typography>
              </motion.div>
            )}

            {mode === "status" && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <CompactIndicators connectivity={connectivity} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}

/* ----------------------------------------------------------------------
 * Compact Connectivity Indicators (one-row, never wraps)
 * ---------------------------------------------------------------------- */
function CompactIndicators({
  connectivity,
}: {
  connectivity: { ws: boolean; kafka: boolean; api: boolean };
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Dot label="WS" active={connectivity.ws} />
      <Dot label="Kafka" active={connectivity.kafka} />
      <Dot label="API" active={connectivity.api} />
    </Stack>
  );
}

function Dot({ label, active }: { label: string; active: boolean }) {
  return (
    <Stack direction="row" spacing={0.6} alignItems="center">
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: active ? "#34C759" : "#FF453A",
        }}
      />
      <Typography
        fontSize={"0.72rem"}
        fontWeight={600}
        sx={{
          color: active ? "#34C759" : "#FF453A",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
