"use client";

import { alpha, Box, ListItemButton, ListItemIcon, ListItemText, Tooltip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { getRoleColor, isActiveNavItem } from "./navigation.util";
import type { UserRoleType } from "@/checkpoint/generated/graphql";
import { useTourAnchor } from "@/checkpoint/hooks/core/useTourAnchor";
import { useTour } from "@/checkpoint/providers/TourProvider";
import type { NavItem } from "@/checkpoint/lib/experience/navigation-builder";

interface Props {
  item: NavItem;
  items: NavItem[];
  collapsed?: boolean;
  role?: UserRoleType | undefined;
}

export default function NavigationItem({ item, items, collapsed = false, role }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const anchorId = item.tourId ?? item.path;
  const ref = useTourAnchor(anchorId);

  const { steps, stepIndex } = useTour();
  const currentStep = steps[stepIndex];

  const isTarget = currentStep?.target === anchorId;

  const isActive = isActiveNavItem(
    pathname,
    item.path,
    items.map((i) => i.path),
  );
  const activeColor = role ? getRoleColor(role) : theme.palette.primary.main;

  const button = (
    <ListItemButton
      ref={ref}
      disabled={item.disabled}
      selected={isActive}
      onClick={() => router.push(item.path)}
      sx={{
        position: "relative",
        borderRadius: collapsed ? 1.5 : 2,
        justifyContent: collapsed ? "center" : undefined,
        px: collapsed ? 1 : undefined,
        minHeight: collapsed ? 44 : undefined,
        color: isActive ? activeColor : "text.primary",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease, border 0.2s ease",
        "&.Mui-selected": {
          backgroundColor: alpha(activeColor, 0.08),
          backdropFilter: "blur(12px)",
          border: `1px solid ${alpha(activeColor, 0.15)}`,
          boxShadow: `inset 2px 0 0 ${activeColor}, 0 4px 12px ${alpha(activeColor, 0.12)}`,
        },
        "&.Mui-selected:hover": {
          backgroundColor: alpha(activeColor, 0.14),
        },
        "&:hover": {
          backgroundColor: alpha(activeColor, 0.06),
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: collapsed ? 0 : 40,
          color: isActive ? activeColor : "text.secondary",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {item.icon}
        </motion.div>
      </ListItemIcon>

      {!collapsed && (
        <Box sx={{ position: "relative", width: "100%" }}>
          <ListItemText
            primary={item.label}
            sx={{
              "& .MuiListItemText-primary": {
                color: isActive ? activeColor : "text.primary",
                fontWeight: isActive ? 700 : 400,
              },
            }}
          />

          {isTarget && (
            <>
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4 }}
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                }}
              />

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                style={{
                  position: "absolute",
                  right: -18,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRight: "2px solid",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    transform: "rotate(-45deg)",
                  }}
                />
              </motion.div>
            </>
          )}
        </Box>
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right" arrow>
        {button}
      </Tooltip>
    );
  }

  return button;
}
