"use client";

import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Box } from "@mui/material";
import React from "react";
import UserMenu from "@/components/ui/UserMenu";
import NavigationTablet from "./navigation/Navigation.tablet";
import ColorBubbleSwitcher from "../ui/ColorBubbleSwitcher";

export default function AppShellTablet({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100dvh", // eigener Viewport
        overflow: "hidden", // body wird ignoriert
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
          overflow: "hidden",
        }}
      >
        {/* Topbar bleibt sticky */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            p: 2,
            gap: 1,
            bgcolor: (t) => t.palette.background.default,
          }}
        >
          <ThemeToggleButton />
                <ColorBubbleSwitcher />
          <UserMenu />
        </Box>

        {/* inhalt scrollt unabhängig */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
