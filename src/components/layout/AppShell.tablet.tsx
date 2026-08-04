"use client";

import { Box } from "@mui/material";
import type React from "react";
import AppShellSupportChat from "@/checkpoint/components/support/chat/AppShellSupportChat";
import NavigationTablet from "./navigation/Navigation.tablet";

export default function AppShellTablet({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Sticky Sidebar */}
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          height: "100dvh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
        }}
      >
        <NavigationTablet />
      </Box>
      {/* Rechter Content – eigener Scrollbereich */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* inhalt scrollt unabhängig */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflowY: "auto",
            p: { sm: 2.5, md: 3 },
          }}
        >
          {children}
        </Box>
        <AppShellSupportChat />
      </Box>
    </Box>
  );
}
