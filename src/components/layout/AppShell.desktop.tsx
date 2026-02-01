"use client";

import React from "react";
import { Box } from "@mui/material";
import NavigationDesktop from "./navigation/Navigation.desktop";

export default function AppShellDesktop({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: 260,
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          maxHeight: "100vh",
          overflowY: "auto",
          bgcolor: (t) => t.palette.background.paper,
        }}
      >
        <NavigationDesktop />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          overflowY: "auto",
          p: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
