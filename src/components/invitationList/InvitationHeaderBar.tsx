"use client";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { useDevice } from "@/providers/DeviceProvider";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import InvitationActionsMobile from "./InvitationActionsMobile";
import InvitationFilters from "./InvitationFilters";
import PullToRefresh from "./PullToRefresh";
import RefreshArcButton from "./RefreshArcButton";
import BackToEventDetail from "./button/BackToEventDetail";
import UserCreationInbox from "./button/UserCreationInbox";

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------------------
 * VisionOS Premium Header:
 * - Animated collapse
 * - Glass-opacity gradient
 * - Bounce easing (iOS-like)
 * - Safari-style scroll progress bar
 * ------------------------------------------------------------------------- */
export default function InvitationHeaderBar({ logic, scroll, scrollRef }) {
  const theme = useTheme();
  const { activeEventId } = useActiveEvent();
  const { isMobile, isTablet } = useDevice();

  const [copied, setCopied] = React.useState(false);

  const handleCopyRsvpLink = async () => {
    if (!activeEventId) return;

    const url = `${window.location.origin}/checkpoint/rsvp?eventId=${activeEventId}`;
    const ok = await copyToClipboard(url);

    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const compact = scroll.collapsed;
  const visible = scroll.visible;

  return (
    <motion.div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}
      animate={{
        y: visible ? 0 : compact ? -72 : 0,
        transition: {
          type: "spring",
          stiffness: 140,
          damping: 18, // bounce feeling
        },
      }}
    >
      {/* Back Button */}
      <BackToEventDetail />
      {/* Progress Bar */}
      <motion.div
        style={{
          height: 3,
          background: theme.palette.primary.main,
          transformOrigin: "left",
        }}
        animate={{
          scaleX: scroll.progress,
        }}
        transition={{ duration: 0.15 }}
      />

      <Box
        sx={{
          px: { xs: 2, md: 6 },
          pt: compact ? 1 : 3,
          pb: compact ? 1 : 2,
          background: `
            linear-gradient(
              to bottom,
              rgba(255,255,255, ${0.4 * scroll.glassOpacity}) 0%,
              rgba(255,255,255, ${0.8 * scroll.glassOpacity}) 100%
            )
          `,
          backdropFilter: `blur(${scroll.glassOpacity * 20}px)`,
          boxShadow: compact ? theme.shadows[3] : "none",
          transition: "background 0.3s ease, padding 0.3s ease",
        }}
      >
        {/* HEADER TOP ROW */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          {/* Title Area */}
          <Stack sx={{ opacity: compact ? 0.9 : 1 }}>
            <Typography variant={compact ? "h6" : "h4"} fontWeight={700}>
              Einladungen
            </Typography>

            {!compact && (
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.2 }}>
                Verwalte deine Gäste, Status, Einladungslinks und Importe
              </Typography>
            )}
          </Stack>

          {/* Desktop Actions */}
          {!isMobile && !isTablet && (
            <Stack direction="row" spacing={2}>
              <UserCreationInbox logic={logic} />
              {/* <RefreshOrbButton onReload={logic.refetch} /> */}
              <RefreshArcButton onReload={logic.refetch} />

              <Button
                variant="outlined"
                onClick={() => logic.setImportOpen(true)}
              >
                Importieren
              </Button>

              <Button
                variant="contained"
                onClick={() => logic.setCreateOpen(true)}
              >
                + Neue Einladung
              </Button>

              <Button
                variant="outlined"
                onClick={handleCopyRsvpLink}
                disabled={!activeEventId}
              >
                RSVP-Link kopieren
              </Button>
            </Stack>
          )}

          {copied && (
            <Box
              sx={{
                position: "fixed",
                top: 80,
                right: 24,
                zIndex: 2000,
                backgroundColor: theme.palette.success.main,
                color: "#fff",
                px: 2,
                py: 1,
                borderRadius: 2,
                boxShadow: theme.shadows[4],
              }}
            >
              <Typography variant="body2">RSVP-Link kopiert</Typography>
            </Box>
          )}

          {/* Mobile Actions */}
          {(isMobile || isTablet) && (
            <PullToRefresh onReload={logic.refetch}>
              <InvitationActionsMobile logic={logic} />
            </PullToRefresh>
          )}
        </Stack>

        {/* Filters inside header */}
        <Box sx={{ mt: compact ? 1 : 2 }}>
          <InvitationFilters logic={logic} />
        </Box>
      </Box>
    </motion.div>
  );
}
