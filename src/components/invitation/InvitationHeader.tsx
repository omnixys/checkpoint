"use client";

import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import InvitationHeaderBar from "@/checkpoint/components/invitation/InvitationHeaderBar";
import { BackButtonBase } from "@/checkpoint/components/utils/back-button-base";
import { env } from "@/checkpoint/lib/env";
import { useParams } from "next/navigation";
import InvitationFilters from "@/checkpoint/components/invitation/InvitationFilters";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { BackToEventDetailButton } from "@/checkpoint/components/utils/back-to-event-detail-button";

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
export default function InvitationHeader({ logic, scroll }: InvitationHeaderProp) {
  const theme = useTheme();
  const { id } = useParams();

  return (
    <motion.div
      animate={{
        y: scroll?.visible ? 0 : -80,
      }}
      transition={{ duration: 0.25 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Box
        sx={{
          backdropFilter: "blur(20px)",
          background: alpha(theme.palette.background.paper, scroll.glassOpacity),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          px: 2,
          pt: 2,
          pb: scroll.collapsed ? 1 : 2,
          transition: "all 0.25s ease",
        }}
      >
        <Stack spacing={2}>
          {/* TOP BAR */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <BackToEventDetailButton />
            <InvitationHeaderBar logic={logic} />
          </Stack>

          {/* TITLE */}
          {!scroll.collapsed && (
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Einladungen
            </Typography>
          )}

          {/* FILTERS */}
          <InvitationFilters logic={logic} />
        </Stack>
      </Box>
    </motion.div>
  );
}
