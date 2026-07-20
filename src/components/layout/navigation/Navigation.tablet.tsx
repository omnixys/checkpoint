"use client";

import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  alpha,
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
import { type JSX, useCallback, useEffect, useState } from "react";
import ColorBubbleSwitcher from "@/checkpoint/components/ColorBubbleSwitcher";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import EventSelector from "@/checkpoint/components/Selectors/EventSelector";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import UserMenu from "@/checkpoint/components/UserMenu";
import { NAVIGATION_GROUPS } from "@/checkpoint/lib/experience/groups";
import { buildGroupedNavigation } from "@/checkpoint/lib/experience/navigation-builder";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { getRoleColor, isActiveNavItem } from "./navigation.util";

export default function NavigationTablet(): JSX.Element {
  const theme = useTheme();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("checkpoint.sidebar-collapsed");
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of Object.values(NAVIGATION_GROUPS)) {
      initial[group.id] = !group.defaultExpanded;
    }
    return initial;
  });
  const toggleGroup = useCallback((groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { activeEvent, myRoles, myPermissions, activeRole } = useActiveEvent();

  const roleIds = myRoles.map((r) => r.key);
  const experience = resolveExperience(roleIds, myPermissions, "tablet");
  const groups = buildGroupedNavigation(experience, activeEvent?.id);
  const flatItems = groups.flatMap((g) => g.items);
  const itemPaths = flatItems.map((item) => item.path);
  const activeColor = activeRole ? getRoleColor(activeRole, theme) : theme.palette.primary.main;

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

            <Box sx={{ flexGrow: 1 }}>
              {groups.map((group) => {
                const groupDef = NAVIGATION_GROUPS[group.groupId];
                const isCollapsed = collapsedGroups[group.groupId] ?? false;
                const canCollapse = groupDef?.collapsible ?? false;

                return (
                  <Box key={group.groupId} sx={{ mb: group.groupLabel ? 0.5 : 0 }}>
                    {group.groupLabel && (
                      <Stack
                        direction="row"
                        onClick={() => canCollapse && toggleGroup(group.groupId)}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          alignItems: "center",
                          cursor: canCollapse ? "pointer" : "default",
                          "&:hover": canCollapse ? { opacity: 0.7 } : undefined,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontWeight: 600,
                            color: "text.secondary",
                            flexGrow: 1,
                          }}
                        >
                          {group.groupLabel}
                        </Typography>
                        {canCollapse && (
                          <ExpandMoreIcon
                            sx={{
                              fontSize: 16,
                              color: "text.disabled",
                              transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                            }}
                          />
                        )}
                      </Stack>
                    )}
                    {!isCollapsed && (
                      <List disablePadding>
                        {group.items.map((item) => {
                          const active = isActiveNavItem(pathname, item.path, itemPaths);

                          return (
                            <ListItemButton
                              title={collapsed ? item.label : undefined}
                              key={item.path}
                              disabled={item.disabled}
                              selected={active}
                              onClick={() => router.push(item.path)}
                              sx={{
                                position: "relative",
                                borderRadius: 2,
                                pl: 2.5,
                                transition: "background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease",

                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  left: 6,
                                  top: "50%",
                                  width: 4,
                                  height: "60%",
                                  borderRadius: 999,
                                  backgroundColor: active ? activeColor : "transparent",
                                  transition: "transform 260ms cubic-bezier(.4,0,.2,1)",
                                  transformOrigin: "center",
                                  transform: active
                                    ? "translateY(-50%) scaleY(1)"
                                    : "translateY(-50%) scaleY(0)",
                                },

                                "&.Mui-selected": {
                                  backgroundColor: alpha(activeColor, 0.08),
                                  backdropFilter: "blur(12px)",
                                  border: `1px solid ${alpha(activeColor, 0.15)}`,
                                },

                                "&.Mui-selected:hover": {
                                  backgroundColor: alpha(activeColor, 0.14),
                                },

                                "&:hover": {
                                  "@media (hover: hover)": {
                                    backgroundColor: alpha(activeColor, 0.06),
                                  },
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 36,
                                  color: active ? activeColor : "text.secondary",
                                  transition: "color 0.25s ease",
                                }}
                              >
                                <motion.div
                                  key={active ? "active" : "inactive"}
                                  initial={{ scale: 1 }}
                                  animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
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
                                  "& .MuiListItemText-primary": {
                                    color: active ? activeColor : "text.primary",
                                    fontWeight: active ? 700 : 400,
                                  },
                                }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    )}
                  </Box>
                );
              })}
            </Box>
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
