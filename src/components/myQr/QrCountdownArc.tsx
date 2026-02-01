"use client";

import { motion } from "framer-motion";
import { Box, useTheme } from "@mui/material";
import React, { useMemo } from "react";

type Props = {
  /** Lifetime in seconds */
  rotationSeconds: number;
  /** Diameter of the arc container (should be >= QR size + padding) */
  size: number;
  /** Stroke width of the arc */
  stroke?: number;
  /** Optional key to restart animation (e.g., on rotate) */
  cycleKey?: string | number;
};

export default function QrCountdownArc({
  rotationSeconds,
  size,
  stroke = 6,
  cycleKey,
}: Props) {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const radius = useMemo(() => (size - stroke) / 2, [size, stroke]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  // We animate strokeDashoffset from 0 → circumference (counting down)
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }} // start at top
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={apple.separator}
          strokeOpacity={0.35}
          strokeWidth={stroke}
        />

        {/* Progress */}
        <motion.circle
          key={cycleKey} // restart animation on rotate
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={omni.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference }}
          transition={{
            duration: Math.max(rotationSeconds, 1),
            ease: "linear",
          }}
        />
      </svg>
    </Box>
  );
}
