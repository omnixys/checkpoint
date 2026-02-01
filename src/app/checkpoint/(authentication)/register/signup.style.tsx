"use client";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { JSX } from "react";

// iOS-like Glassmorphism Card
export const AppleCardGlass = styled(Box)(() => ({
  padding: "20px",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.35)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  backdropFilter: "blur(16px)",
}));

// Animated Step Progress Bar
export function AppleProgress({
  step,
  total,
}: {
  step: number;
  total: number;
}): JSX.Element {
  const width = (step / total) * 100;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 6,
        borderRadius: 3,
        background: "rgba(255,255,255,0.4)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg, #007aff, #0a84ff)",
          transition: "width 0.35s ease",
        }}
      />
    </Box>
  );
}
