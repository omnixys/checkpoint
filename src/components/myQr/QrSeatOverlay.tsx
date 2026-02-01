// src/components/myQr/QrSeatOverlay.tsx
"use client";

import { Box, Typography, useTheme } from "@mui/material";

export default function QrSeatOverlay({ seat }: { seat: string }) {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: -14,
        left: "50%",
        transform: "translateX(-50%)",
        px: 1.8,
        py: 0.6,
        borderRadius: 999,
        bgcolor: apple.systemBackground,
        border: `1px solid ${apple.separator}`,
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
      }}
    >
      <Typography
        fontWeight={700}
        fontSize={13}
        sx={{ color: omni.textPrimary }}
      >
        Platz {seat}
      </Typography>
    </Box>
  );
}
