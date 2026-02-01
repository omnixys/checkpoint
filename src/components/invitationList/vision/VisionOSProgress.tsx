"use client";

import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

export function VisionOSProgress({ progress }: { progress: number }) {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const stroke = (progress / 100) * circumference;

  return (
    <Box
      sx={{
        width: 180,
        height: 180,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
        backdropFilter: "blur(25px)",
        boxShadow:
          "0 0 60px rgba(255,255,255,0.25), inset 0 0 40px rgba(255,255,255,0.25)",
      }}
    >
      <svg
        width="180"
        height="180"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - stroke }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          strokeLinecap="round"
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Typography
          fontSize={32}
          fontWeight={600}
          sx={{ color: "white", textShadow: "0 0 20px rgba(255,255,255,0.7)" }}
        >
          {progress}%
        </Typography>
      </motion.div>
    </Box>
  );
}
