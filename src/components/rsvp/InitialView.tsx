"use client";

import React from "react";
import { Box, Stack, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import ParallaxBanner from "@/checkpoint/components/ParallaxBanner";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { GetInvitationQuery } from "@/checkpoint/generated/graphql";
import useEventQuery from "@/checkpoint/hooks/events/useEventQuery";

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
  invitation: GetInvitationQuery['invitation'];
  onAccept: () => void;
  onMaybe: () => void;
  onDecline: () => void;
  }) {
  const { eventMetaInfo } = useEventQuery({
    eventId: invitation.eventId,
    loadEventMeta: true,
  });
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const firstName = invitation?.firstName ?? "";
  const lastName = invitation?.lastName ?? "";

  const eventTitle = eventMetaInfo?.name ?? t("eventFallback");
  const bannerUrl = eventMetaInfo?.coverMedia?.url?? null;

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
              sx={{
                fontWeight: 700,
                fontSize: 12,
                alignItems: "center",
              }}
            >
              {t("initial.greeting", { firstName, lastName })}
            </Typography>

            <Typography
              variant="body1"
              sx={{ opacity: 0.85, textAlign: "center" }}
            >
              {t("initial.waitingForResponse", { eventTitle })}
            </Typography>

            <Typography
              variant="body2"
              sx={{ opacity: 0.65, mt: 1, textAlign: "center" }}
            >
              {t("initial.finalDecisionHint")}
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
                {t("initial.accept")}
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
                {t("initial.maybe")}
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
                {t("initial.decline")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </motion.div>
    </Stack>
  );
}
