"use client";

import { Box, Stack } from "@mui/material";
import { ReactNode } from "react";

export default function MeLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 4,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          backdropFilter: "blur(20px)",
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
