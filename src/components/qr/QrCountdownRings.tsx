"use client";

import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  nonceSeconds: number;
  signatureSeconds: number;
  size: number;
  outerStroke?: number;
  innerStroke?: number;
  cycleKey?: string | number;
  criticalThresholdSeconds?: number;
}

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
  const outerRadius = useMemo(() => (size - outerStroke) / 2, [size, outerStroke]);
  const innerRadius = useMemo(() => outerRadius - outerStroke - 6, [outerRadius, outerStroke]);
  const outerCirc = useMemo(() => 2 * Math.PI * outerRadius, [outerRadius]);
  const innerCirc = useMemo(() => 2 * Math.PI * innerRadius, [innerRadius]);
  const nonceDuration = Math.max(nonceSeconds, 1);
  const signatureDuration = Math.max(signatureSeconds, 1);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: 999,
        backgroundColor: alpha(theme.palette.background.paper, 0.72),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 ${theme.spacing(1.5)} ${theme.spacing(4)} ${alpha(
          theme.palette.common.black,
          theme.palette.mode === "dark" ? 0.32 : 0.14,
        )}`,
        pointerEvents: "none",
      }}
    >
      <svg
        aria-hidden={true}
        focusable="false"
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={alpha(theme.palette.divider, 0.72)}
          strokeWidth={outerStroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke={alpha(theme.palette.divider, 0.52)}
          strokeWidth={innerStroke}
        />

        <motion.circle
          key={`nonce-${cycleKey}`}
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={outerStroke}
          strokeLinecap="round"
          strokeDasharray={outerCirc}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: outerCirc }}
          transition={{ duration: nonceDuration, ease: "linear" }}
        />

        <motion.circle
          key={`signature-${cycleKey}`}
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="none"
          stroke={theme.palette.secondary.main}
          strokeWidth={innerStroke}
          strokeLinecap="round"
          strokeDasharray={innerCirc}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: innerCirc }}
          transition={{ duration: signatureDuration, ease: "linear" }}
        />
      </svg>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.32, 0.72, 0.32] }}
        transition={{
          delay: Math.max(nonceDuration - criticalThresholdSeconds, 0),
          duration: 0.9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          filter: "blur(10px)",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.error.main,
            0.24,
          )} 0%, ${alpha(theme.palette.background.default, 0)} 70%)`,
        }}
      />
    </Box>
  );
}
