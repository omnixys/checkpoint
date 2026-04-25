"use client";

import React from "react";
import { Box, SxProps, Theme, useTheme, alpha } from "@mui/material";

export default function CreateWizardCard({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 5,
        p: { xs: 2, sm: 3 },
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.82)} 0%, ${alpha(theme.palette.background.default, 0.72)} 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.92)} 0%, ${alpha(theme.palette.background.default, 0.82)} 100%)`,
        border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        // boxShadow:
        //   theme.palette.mode === "dark"
        //     ? "0 24px 64px rgba(0,0,0,0.42)"
        //     : "0 24px 64px rgba(15,23,42,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
