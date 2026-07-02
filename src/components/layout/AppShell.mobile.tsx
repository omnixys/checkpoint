"use client";

import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import UserMenu from "@/checkpoint/components/UserMenu";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { Box } from "@mui/material";
import { useState } from "react";
import NavigationMobile from "./navigation/Navigation.mobile";
import EventSelectorMobileButton from "@/checkpoint/components/Selectors/EventSelectorMobileButton";
import { AppleNavBar } from "@/checkpoint/components/apple/AppleNavBar";
import EventSelectorActionSheet from "@/checkpoint/components/Selectors/EventSelectorActionSheet";

export default function AppShellMobile({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const HEADER_HEIGHT = 56;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
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
              {isAuthenticated && <EventSelectorMobileButton onOpen={() => setOpen(true)} />}
              <UserMenu />
            </>
          }
        />
      </Box>

      {/* Content scrollt separat */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflowY: "auto",
          pt: `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top))`,
          pb: "calc(76px + env(safe-area-inset-bottom))",
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {children}
      </Box>

      {/* Sticky BottomBar */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 12000000,
        }}
      >
        <NavigationMobile />
      </Box>

      <EventSelectorActionSheet open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
