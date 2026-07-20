"use client";

import { ChevronLeft as ChevronLeftIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { type JSX, useCallback, useEffect, useState } from "react";
import ColorBubbleSwitcher from "@/checkpoint/components/ColorBubbleSwitcher";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import NavigationItem from "@/checkpoint/components/layout/navigation/NavigationItem";
import EventSelector from "@/checkpoint/components/Selectors/EventSelector";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import UserMenu from "@/checkpoint/components/UserMenu";
import { useTourAnchor } from "@/checkpoint/hooks/core/useTourAnchor";
import { env } from "@/checkpoint/lib/env";
import { NAVIGATION_GROUPS } from "@/checkpoint/lib/experience/groups";
import { buildGroupedNavigation } from "@/checkpoint/lib/experience/navigation-builder";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export default function NavigationDesktop(): JSX.Element | null {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("checkpoint.sidebar-collapsed");
    if (stored === "true") {
      setCollapsed(true);
    }
    setMounted(true);
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("checkpoint.sidebar-collapsed", String(next));
      return next;
    });
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

  const theme = useTheme();

  const { isAuthenticated } = useAuth();
  const { activeEvent, myRoles, myPermissions, activeRole } = useActiveEvent();

  const selectorRef = useTourAnchor("event.selector");
  const colorRef = useTourAnchor("ui.colorSwitcher");
  const toggleRef = useTourAnchor("ui.themeToggle");
  const userMenuRef = useTourAnchor("ui.userMenu");
  const languageRef = useTourAnchor("ui.language");

  const roleIds = myRoles.map((r) => r.key);
  const experience = resolveExperience(roleIds, myPermissions, "desktop");
  const groups = buildGroupedNavigation(experience, activeEvent?.id);
  const flatItems = groups.flatMap((g) => g.items);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        width: collapsed ? 72 : 260,
        transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        minWidth: collapsed ? 72 : 260,
        borderRight: (t) => `1px solid ${t.palette.apple.separator}`,
        backgroundColor: (t) => t.palette.apple.systemBackground,
        p: collapsed ? 1.5 : 3,
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
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
            CP
          </Typography>
        )}

        {!collapsed && (
          <Box ref={languageRef} sx={{ display: "contents" }}>
            <LanguageSwitcher />
          </Box>
        )}
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {isAuthenticated && (
        <>
          {!collapsed && (
            <Box ref={selectorRef} sx={{ display: "contents" }}>
              <EventSelector />
            </Box>
          )}

          {!collapsed && <Divider sx={{ my: 2 }} />}
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {groups.map((group) => {
              const groupDef = NAVIGATION_GROUPS[group.groupId];
              const isCollapsed = collapsedGroups[group.groupId] ?? false;
              const canCollapse = groupDef?.collapsible ?? false;

              if (collapsed) {
                return (
                  <Box key={group.groupId} sx={{ mb: 0.5 }}>
                    <List disablePadding>
                      {group.items.map((item) => (
                        <NavigationItem key={item.path} item={item} items={flatItems} collapsed role={activeRole} />
                      ))}
                    </List>
                  </Box>
                );
              }

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
                      {group.items.map((item) => (
                        <NavigationItem key={item.path} item={item} items={flatItems} role={activeRole} />
                      ))}
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
          flexDirection: collapsed ? "column" : "row",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          pt: 2,
          gap: collapsed ? 1 : 0,
        }}
      >
        <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
          <IconButton
            size="small"
            onClick={toggleSidebar}
            sx={{
              transition: "transform 0.25s ease",
              transform: collapsed ? "rotate(180deg)" : "none",
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>

        {!collapsed && (
          <>
            <Box ref={colorRef} sx={{ display: "contents" }}>
              <ColorBubbleSwitcher />
            </Box>

            <Box ref={toggleRef} sx={{ display: "contents" }}>
              <ThemeToggleButton />
            </Box>
          </>
        )}

        <Box ref={userMenuRef} sx={{ display: "contents" }}>
          <UserMenu />
        </Box>
      </Box>
    </Box>
  );
}
