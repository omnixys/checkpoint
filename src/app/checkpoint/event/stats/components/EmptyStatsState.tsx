"use client";

import { Box, Typography } from "@mui/material";
import { JSX } from "react";

export default function EmptyStatsState(): JSX.Element {
  return (
    <Box
      sx={{
        mt: 8,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="h6">Noch keine Statistiken</Typography>
      <Typography variant="body2">
        Die Statistiken werden sichtbar, sobald das Event gestartet ist.
      </Typography>
    </Box>
  );
}
