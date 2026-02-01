"use client";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { JSX, useState } from "react";

import { useAuth } from "@/providers/AuthProvider";
import EventSelector from "@/components/Selectors/EventSelector";
import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { usePathname, useRouter } from "next/navigation";
import { createNavigation } from "../navigation.config";
import { EventRole } from "@/types/event/event-enum.type";
import { motion } from "framer-motion";
import { getRoleColor, isActiveNavItem } from "./navigation.util";


export default function NavigationTablet(): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { activeEvent } = useActiveEvent();
  const role: EventRole = activeEvent?.myRole ?? EventRole.GUEST;

const items = createNavigation(role, activeEvent?.id);

  return (
    <Box
      sx={{
        width: 220,
        backgroundColor: (t) => t.palette.apple.secondarySystemBackground,
        borderRight: (t) => `1px solid ${t.palette.apple.separator}`,
        height: "100dvh",
        p: 2,
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={2}>
        Checkpoint
      </Typography>

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
                  items.map((i) => i.path)
                )}
                onClick={() => router.push("/checkpoint/" + item.path)}
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
                      items.map((i) => i.path)
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
                      items.map((i) => i.path)
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
                      items.map((i) => i.path)
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
                        items.map((i) => i.path)
                      )
                        ? "active"
                        : "inactive"
                    }
                    initial={{ scale: 1 }}
                    animate={
                      isActiveNavItem(
                        pathname,
                        item.path,
                        items.map((i) => i.path)
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
    </Box>
  );
}
