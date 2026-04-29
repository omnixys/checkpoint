"use client";

import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import { useTourAnchor } from "@/checkpoint/hooks/core/useTourAnchor";
import { useRouter, usePathname } from "next/navigation";
import { NavItem } from "../navigation.config";
import { UserRoleType } from "@/checkpoint/generated/graphql";
import { useTour } from "@/checkpoint/providers/TourProvider";
import { getRoleColor, isActiveNavItem } from "@/checkpoint/components/layout/navigation/navigation.util";

type Props = {
  item: NavItem;
  items: NavItem[];
  role: UserRoleType;
};

export default function NavigationItem({ item, items, role }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ HOOK IST JETZT TOP-LEVEL → SAFE
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

  return (
    <ListItemButton
      ref={ref}
      disabled={item.disabled}
      onClick={() => router.push(item.path)}
      sx={{
        position: "relative",
        borderRadius: 2,
      }}
    >
      <ListItemIcon
        sx={{
          color: isActive ? getRoleColor(role) : "text.secondary",
        }}
      >
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {item.icon}
        </motion.div>
      </ListItemIcon>

      <Box sx={{ position: "relative", width: "100%" }}>
        <ListItemText primary={item.label} />

        {/* 🔥 TOUR EFFECT */}
        {isTarget && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
              }}
            />

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
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
    </ListItemButton>
  );
}
