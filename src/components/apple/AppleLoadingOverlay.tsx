"use client";

import React, { JSX } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export function AppleLoadingOverlay({ show }: { show: boolean }): JSX.Element {
  if (!show) return <></>;

  return (
    <Box
      sx={{
        position: "fixed",
        zIndex: 2000,
        inset: 0,
        bgcolor: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={42} thickness={4} />
      <Typography
        sx={{ mt: 2 }}
        fontSize={16}
        fontWeight={500}
        color="rgba(0,0,0,0.7)"
      >
        Bitte warten…
      </Typography>
    </Box>
  );
}
