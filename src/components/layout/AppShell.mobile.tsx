"use client";

import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { AppleNavBar } from "@/components/apple/AppleNavBar";
import EventSelectorActionSheet from "@/components/Selectors/EventSelectorActionSheet";
import EventSelectorMobileButton from "@/components/Selectors/EventSelectorMobileButton";
import UserMenu from "@/components/ui/UserMenu";
import NavigationMobile from "./navigation/Navigation.mobile";

export default function AppShellMobile({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const HEADER_HEIGHT = 56; // Apple-like

  return (
    <Box
      sx={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Sticky TopBar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 120,
        }}
      >
        <AppleNavBar
          title="Checkpoint"
          // leftActions={<></>}
          rightActions={
            <>
              {isAuthenticated && (
                <EventSelectorMobileButton onOpen={() => setOpen(true)} />
              )}
              <ThemeToggleButton />
              <UserMenu />
            </>
          }
        />
      </Box>

      {/* Content scrollt separat */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pt: `${HEADER_HEIGHT}px`,
          pb: "72px", // Platz für BottomNav!
          px: 2,
        }}
      >
        {children}
      </Box>

      {/* Sticky BottomBar */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 120,
        }}
      >
        <NavigationMobile />
      </Box>

      <EventSelectorActionSheet open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
