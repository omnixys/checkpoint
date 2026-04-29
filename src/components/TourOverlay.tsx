"use client";

import { useTour } from "@/checkpoint/providers/TourProvider";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TourOverlay() {
  const { anchors, steps, stepIndex, next, prev, stop, isActive } = useTour();

  const step = steps[stepIndex];
  if (!step) return null;

  const el = anchors[step.target];
  if (!el) return null;

  const rect = el.getBoundingClientRect();

  // 🚀 AUTO SCROLL
  useEffect(() => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [el]);

  return (
    <>
      {/* BLOCKING LAYER */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.65)",
          pointerEvents: step.allowInteraction ? "none" : "auto",
        }}
      />

      {/* CUTOUT */}
      <Box
        sx={{
          position: "fixed",
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          borderRadius: 3,
          zIndex: 9999,
          pointerEvents: "none",
          boxShadow: `0 0 0 9999px rgba(0,0,0,0.65), 0 0 0 2px white`,
        }}
      />

      {/* PULSE */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        style={{
          position: "fixed",
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          borderRadius: 12,
          border: "2px solid rgba(255,255,255,0.5)",
          zIndex: 10000,
        }}
      />

      {/* ARROW */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{
          position: "fixed",
          top: rect.top - 50,
          left: rect.left + rect.width / 2,
          transform: "translateX(-50%)",
          zIndex: 10001,
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderLeft: "2px solid white",
            borderBottom: "2px solid white",
            transform: "rotate(-45deg)",
          }}
        />
      </motion.div>

      {/* TOOLTIP */}
      <Box
        sx={{
          position: "fixed",
          top: rect.bottom + 16,
          left: rect.left,
          zIndex: 10002,
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: 20,
          maxWidth: 280,
        }}
      >
        <Typography variant="subtitle2">{step.title}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {step.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button size="small" onClick={prev}>
            Zurück
          </Button>
          <Button size="small" onClick={next}>
            Weiter
          </Button>
          <Button size="small" onClick={stop}>
            Beenden
          </Button>
        </Box>
      </Box>
    </>
  );
}
