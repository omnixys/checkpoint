"use client";

import { Button, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function InvitationAlreadyAcceptedDialog({ open }: { open: boolean }) {
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open) {
    return null;
  }

  /** Desktop VisionOS Bubble */
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
        background: `${theme.palette.background.paper}CC`,
        borderRadius: "24px",
        padding: "32px 40px",
        boxShadow: theme.shadows[6],
        maxWidth: "420px",
        width: "90%",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,

            alignItems: "center",
          }}
        >
          {t("alreadyAccepted.titleDesktop")}
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.8, textAlign: "center" }}>
          {t("alreadyAccepted.descriptionDesktop")}
        </Typography>

        <Button
          variant="contained"
          onClick={() => (window.location.href = "/checkpoint/")}
          sx={{ mt: 2, px: 4, py: 1, borderRadius: "14px" }}
        >
          {t("common.ok")}
        </Button>
      </Stack>
    </motion.div>
  );

  /** Mobile iOS Panel */
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
        background: `${theme.palette.background.paper}CC`,
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,

            alignItems: "center",
          }}
        >
          {t("alreadyAccepted.titleMobile")}
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.85, textAlign: "center" }}>
          {t("alreadyAccepted.descriptionMobile")}
        </Typography>

        <Button
          fullWidth={true}
          variant="contained"
          onClick={() => (window.location.href = "/checkpoint/")}
          sx={{
            borderRadius: "16px",
            py: 1.6,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          {t("common.ok")}
        </Button>
      </Stack>
    </motion.div>
  );

  return <>{isMobile ? <MobilePanel /> : <DesktopBubble />}</>;
}
