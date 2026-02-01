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
import ParallaxBanner from "./ParallaxBanner";

/**
 * InitialView
 * - Shown when the guest has not made any decision (YES / MAYBE / NO)
 * - Displays banner (if exists)
 * - Shows guest's name + event info
 * - VisionOS glass card w/ call-to-action
 */
export default function InitialView({
  invitation,
  onAccept,
  onMaybe,
  onDecline,
}: {
  invitation: any;
  onAccept: () => void;
  onMaybe: () => void;
  onDecline: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const firstName = invitation?.firstName ?? "";
  const lastName = invitation?.lastName ?? "";

  const eventTitle = invitation?.event?.title ?? "Event";
  const bannerUrl = invitation?.event?.bannerUrl ?? null;

  return (
    <Stack spacing={3}>
      {/* Banner (with parallax for desktop) */}
      {bannerUrl && (
        <ParallaxBanner
          src={bannerUrl}
          height={isMobile ? 180 : 260}
          intensity={isMobile ? 0 : 18} // parallax only on desktop
        />
      )}

      {/* VisionOS glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <Box
          sx={{
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            background: theme.palette.background.paper + "BB",
            borderRadius: "24px",
            boxShadow: theme.shadows[4],
            px: 4,
            py: 4,
          }}
        >
          <Stack spacing={2}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight={700}
              textAlign="center"
            >
              Hallo {firstName} {lastName},
            </Typography>

            <Typography
              variant="body1"
              textAlign="center"
              sx={{ opacity: 0.85 }}
            >
              {eventTitle} wartet auf deine Antwort.
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ opacity: 0.65, mt: 1 }}
            >
              Deine Entscheidung ist endgültig – außer „Vielleicht“.
            </Typography>

            {/* Buttons */}
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={onAccept}
                sx={{
                  py: 1.6,
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                }}
              >
                Zusagen
              </Button>

              <Button
                variant="outlined"
                onClick={onMaybe}
                sx={{
                  py: 1.4,
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                }}
              >
                Vielleicht
              </Button>

              <Button
                variant="text"
                onClick={onDecline}
                sx={{
                  py: 1.2,
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  opacity: 0.7,
                }}
              >
                Ablehnen
              </Button>
            </Stack>
          </Stack>
        </Box>
      </motion.div>
    </Stack>
  );
}
