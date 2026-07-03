"use client";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { type JSX, useState } from "react";
import ColorBubbleSwitcher from "@/checkpoint/components/ColorBubbleSwitcher";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import EventSelector from "@/checkpoint/components/Selectors/EventSelector";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import UserMenu from "@/checkpoint/components/UserMenu";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { createNavigation } from "../navigation.config";
import { getRoleColor, isActiveNavItem } from "./navigation.util";

export default function NavigationTablet(): JSX.Element {
  const theme = useTheme();
  const t = useTypedTranslations("layout");

  const [collapsed, _setCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { activeEvent } = useActiveEvent();
  const role = activeEvent?.myRole ?? "GUEST";

  const items = createNavigation(role, t, activeEvent?.id);

  return (
    <Box
      sx={{
        width: 220,
        backgroundColor: (t) => t.palette.apple.secondarySystemBackground,
        borderRight: (t) => `1px solid ${t.palette.apple.separator}`,
        height: "100dvh",
        overflowY: "auto",
        p: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={0.0001}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          color={theme.palette.primary.main}
          variant="h5"
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
        <LanguageSwitcher />
      </Stack>

      <Stack
        sx={{
          justifyContent: "space-between",
          height: "97%",
        }}
      >
        {isAuthenticated && (
          <>
            <Divider sx={{ my: 2 }} />

            <EventSelector />

            <Divider sx={{ my: 2 }} />

            <List sx={{ flexGrow: 1 }}>
              {items.map((item) => (
                <ListItemButton
                  title={collapsed ? item.label : undefined}
                  key={item.path}
                  disabled={item.disabled}
                  selected={isActiveNavItem(
                    pathname,
                    item.path,
                    items.map((i) => i.path),
                  )}
                  onClick={() => router.push(item.path)}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    pl: 2.5,

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 6,
                      top: "50%",
                      // transform: "translateY(-50%)",
                      width: 4,
                      height: "60%",
                      borderRadius: 999,
                      backgroundColor: isActiveNavItem(
                        pathname,
                        item.path,
                        items.map((i) => i.path),
                      )
                        ? "primary.main"
                        : "transparent",
                      // transition:
                      //   "background-color 0.25s ease, height 0.25s ease",

                      transition: "transform 260ms cubic-bezier(.4,0,.2,1)",
                      transformOrigin: "center",
                      transform: isActiveNavItem(
                        pathname,
                        item.path,
                        items.map((i) => i.path),
                      )
                        ? "translateY(-50%) scaleY(1)"
                        : "translateY(-50%) scaleY(0)",
                    },

                    "&.Mui-selected": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },

                    "&:hover": {
                      "@media (hover: hover)": {
                        backgroundColor: "rgba(255,255,255,0.06)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActiveNavItem(
                        pathname,
                        item.path,
                        items.map((i) => i.path),
                      )
                        ? getRoleColor(role)
                        : "text.secondary",
                      transition: "color 0.25s ease",
                    }}
                  >
                    <motion.div
                      key={
                        isActiveNavItem(
                          pathname,
                          item.path,
                          items.map((i) => i.path),
                        )
                          ? "active"
                          : "inactive"
                      }
                      initial={{ scale: 1 }}
                      animate={
                        isActiveNavItem(
                          pathname,
                          item.path,
                          items.map((i) => i.path),
                        )
                          ? { scale: [1, 1.15, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {item.icon}
                    </motion.div>
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: collapsed ? 0 : 1,
                      transition: "opacity 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                  />
                </ListItemButton>
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

          <ColorBubbleSwitcher />
          <ThemeToggleButton />
          <UserMenu />
        </Box>
      </Stack>
    </Box>
  );
}
