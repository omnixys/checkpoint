"use client";

import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { JSX, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createNavigation } from "../navigation.config";
import { getRoleColor, isActiveNavItem } from "./navigation.util";
import ColorBubbleSwitcher from "@/checkpoint/components/ColorBubbleSwitcher";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import UserMenu from "@/checkpoint/components/UserMenu";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { env } from "@/checkpoint/lib/env";
import EventSelector from "@/checkpoint/components/Selectors/EventSelector";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useTourAnchor } from "@/checkpoint/hooks/core/useTourAnchor";
import { useTour } from "@/checkpoint/providers/TourProvider";
import NavigationItem from "@/checkpoint/components/layout/navigation/NavigationItem";

export default function NavigationDesktop(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
    const t = useTypedTranslations("layout");


  const { isAuthenticated } = useAuth();
  const { activeEvent } = useActiveEvent();

  const selectorRef = useTourAnchor("event.selector"); 
  const colorRef = useTourAnchor("ui.colorSwitcher");
  const toggleRef = useTourAnchor("ui.themeToggle");
  const userMenuRef = useTourAnchor("ui.userMenu");
    const languageRef = useTourAnchor("ui.language");



  const role = activeEvent?.myRole ?? "GUEST";
  const items = createNavigation(role, t, activeEvent?.id);

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 260,
        transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        borderRight: (t) => `1px solid ${t.palette.apple.separator}`,
        backgroundColor: (t) => t.palette.apple.systemBackground,
        p: collapsed ? 1.5 : 3,
      }}
    >
      <Stack
        direction={"row"}
        spacing={0.5}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          color={theme.palette.primary.main}
          variant="h5"
          component={Link}
          href={env.CHECKPOINT_BASE_PATH}
          sx={{
            mb: 2,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            "&:hover": {
              opacity: 0.85,
              transform: "translateY(-1px)",
            },
          }}
        >
          Checkpoint
        </Typography>

        <Box ref={languageRef} sx={{ display: "contents" }}>
          <LanguageSwitcher />
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {isAuthenticated && (
        <>
          <Box ref={selectorRef} sx={{ display: "contents" }}>
            <EventSelector />
          </Box>

          <Divider sx={{ my: 2 }} />
          <List sx={{ flexGrow: 1 }}>
            {items.map((item) => (
              <NavigationItem
                key={item.path}
                item={item}
                items={items}
                role={role}
              />
            ))}
          </List>
        </>
      )}

      <Box
        sx={{
          mt: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 2,
        }}
      >
        {/* <IconButton
          size="small"
          onClick={() => setCollapsed((v) => !v)}
          sx={{
            transition: "transform 0.25s ease",
            transform: collapsed ? "rotate(180deg)" : "none",
          }}
        >
          <ChevronLeftIcon />
        </IconButton> */}
        <Box ref={colorRef} sx={{ display: "contents" }}>
          <ColorBubbleSwitcher />
        </Box>

        <Box ref={toggleRef} sx={{ display: "contents" }}>
          <ThemeToggleButton />
        </Box>

        <Box ref={userMenuRef} sx={{ display: "contents" }}>
          <UserMenu />
        </Box>
      </Box>
    </Box>
  );
}
