"use client";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const AppleCardGlass = styled(Box)(() => ({
  width: "100%",
  padding: "24px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.25)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
}));

export function AppleProgress({ step, total }) {
  const width = (step / total) * 100;

  return (
    <Box
      sx={{
        width: "100%",
        height: 6,
        borderRadius: 3,
        background: "rgba(255,255,255,0.35)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${width}%`,
          background: "linear-gradient(90deg,#007aff,#0a84ff)",
          transition: "width .35s ease",
        }}
      />
    </Box>
  );
}
