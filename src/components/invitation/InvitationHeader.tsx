"use client";

import { Box, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import InvitationFilters from "@/checkpoint/components/invitation/InvitationFilters";
import InvitationFiltersMobile from "@/checkpoint/components/invitation/InvitationFiltersMobile";
import { useHeaderCollapse } from "@/checkpoint/components/invitation/useHeaderCollapse";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import { InvitationHeaderBar } from "./InvitationHeaderBar";

/**
 * Smart Header
 *
 * - Collapsible
 * - Scroll aware
 * - Motion driven
 */
export interface InvitationHeaderProp {
  logic: InvitationLogic;
  scroll: {
    collapsed: boolean;
    visible: boolean;
    progress: number;
    glassOpacity: number;
  };
}
/* ---------------------------------------------------------------------------
 * Header Factory (scroll reactive)
 * ------------------------------------------------------------------------- */
export default function InvitationHeader({ logic }: InvitationHeaderProp) {
  const { isMobile } = useDevice();
  const theme = useTheme();
  const { collapsed, setCollapsed } = useHeaderCollapse();

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        borderRadius: "16px",
        overflow: "hidden",

        background: theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",

        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Top Bar (always visible) */}
      <InvitationHeaderBar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        logic={logic}
      />

      {/* Collapsible Filters */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: "hidden",
            }}
          >
            {isMobile ? (
              <InvitationFiltersMobile logic={logic} />
            ) : (
              <InvitationFilters logic={logic} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
