"use client";

import AppShellSupportChat from "@/checkpoint/components/support/chat/AppShellSupportChat";
import { Box } from "@mui/material";
import type React from "react";
import NavigationDesktop from "./navigation/Navigation.desktop";

export default function AppShellDesktop({ children }: { children: React.ReactNode }) {
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

          bgcolor: (t) => t.palette.background.paper,
        }}
      >
        <NavigationDesktop />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          minWidth: 0,
          overflowY: "auto",
          p: { lg: 4, xl: 5 },
        }}
      >
        {children}
      </Box>
      <AppShellSupportChat />
    </Box>
  );
}
