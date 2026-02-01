"use client";

import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

/**
 * InvalidInvitationDialog
 * - Desktop: small floating central dialog (VisionOS style)
 * - Mobile: fullscreen panel (iOS style)
 */
export default function InvalidInvitationDialog({ open }: { open: boolean }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open) return null;

  /** VisionOS floating bubble for desktop */
  const DesktopBubble = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        background: theme.palette.background.paper + "CC", // glassy
        borderRadius: "24px",
        padding: "32px 40px",
        boxShadow: theme.shadows[6],
        maxWidth: "420px",
        width: "90%",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" fontWeight={700} textAlign="center">
          Einladung nicht verfügbar
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          sx={{ opacity: 0.8, mt: 1 }}
        >
          Diese Einladung existiert nicht, ist abgelaufen oder wurde noch nicht
          freigegeben.
        </Typography>

        <Button
          variant="contained"
          onClick={() => (window.location.href = "/checkpoint/")}
          sx={{
            mt: 2,
            px: 4,
            py: 1,
            borderRadius: "14px",
          }}
        >
          OK
        </Button>
      </Stack>
    </motion.div>
  );

  /** Fullscreen panel for mobile devices */
  const MobilePanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        background: theme.palette.background.paper + "CC",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Einladung ungültig
        </Typography>

        <Typography variant="body1" textAlign="center" sx={{ opacity: 0.85 }}>
          Diese Einladung ist momentan nicht verfügbar. Bitte kontaktiere die
          Person, die dich eingeladen hat.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={() => (window.location.href = "/checkpoint/")}
          sx={{
            borderRadius: "16px",
            py: 1.6,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          OK
        </Button>
      </Stack>
    </motion.div>
  );

  return <>{isMobile ? <MobilePanel /> : <DesktopBubble />}</>;
}
