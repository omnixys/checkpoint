"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Box, useTheme } from "@mui/material";

type Props = {
  /** Lifetime of the nonce (seconds) */
  nonceSeconds: number;
  /** Lifetime of the signature validity (seconds) */
  signatureSeconds: number;
  /** Overall size (diameter) */
  size: number;
  /** Stroke widths */
  outerStroke?: number;
  innerStroke?: number;
  /** Restart animations when this key changes */
  cycleKey?: string | number;
  /** When remaining seconds <= this value → critical glow */
  criticalThresholdSeconds?: number;
};

export default function QrCountdownRings({
  nonceSeconds,
  signatureSeconds,
  size,
  outerStroke = 6,
  innerStroke = 4,
  cycleKey,
  criticalThresholdSeconds = 5,
}: Props) {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const outerRadius = useMemo(
    () => (size - outerStroke) / 2,
    [size, outerStroke]
  );
  const innerRadius = useMemo(
    () => outerRadius - outerStroke - 6,
    [outerRadius, outerStroke]
  );

  const outerCirc = useMemo(() => 2 * Math.PI * outerRadius, [outerRadius]);
  const innerCirc = useMemo(() => 2 * Math.PI * innerRadius, [innerRadius]);

  // Safety floors
  const nonceDur = Math.max(nonceSeconds, 1);
  const sigDur = Math.max(signatureSeconds, 1);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: 3,
        bgcolor:
          theme.palette.mode === "light" ? apple.systemBackground : apple.gray6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 12px 32px rgba(0,0,0,0.25)`,
        pointerEvents: "none",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* ---- Tracks ---- */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={apple.separator}
          strokeOpacity={0.35}
          strokeWidth={outerStroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke={apple.separator}
          strokeOpacity={0.25}
          strokeWidth={innerStroke}
        />

        {/* ---- Nonce Ring (outer) ---- */}
        <motion.circle
          key={`nonce-${cycleKey}`}
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={omni.primary}
          strokeWidth={outerStroke}
          strokeLinecap="round"
          strokeDasharray={outerCirc}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: outerCirc }}
          transition={{ duration: nonceDur, ease: "linear" }}
        />

        {/* ---- Signature Ring (inner) ---- */}
        <motion.circle
          key={`sig-${cycleKey}`}
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke={omni.secondary}
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeDasharray={innerCirc}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: innerCirc }}
          transition={{ duration: sigDur, ease: "linear" }}
        />
      </svg>

      {/* ---- Critical Phase Glow (last seconds) ---- */}
      <motion.div
        // starts pulsing near the end without timers:
        // we delay the glow animation so it begins at (nonceSeconds - threshold)
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          delay: Math.max(nonceDur - criticalThresholdSeconds, 0),
          duration: 0.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          filter: "blur(10px)",
          background: `radial-gradient(circle, ${omni.error}55 0%, transparent 70%)`,
        }}
      />
    </Box>
  );
}
