"use client";

import { useMutation } from "@apollo/client/react";
import { Button, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import {
  ReplyInvitationDocument,
  type ReplyInvitationMutation,
  type ReplyInvitationMutationVariables,
  RsvpChoice,
} from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/**
 * DeclineDialog
 * - Confirms that the guest REALLY wants to decline
 * - Decline is final and cannot be undone
 * - After confirming, mutation = RSVP NO
 */
export default function DeclineDialog({
  invitation,
  onConfirm,
  onCancel,
}: {
  invitation: any;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [replyInvitation, { loading }] = useMutation<
    ReplyInvitationMutation,
    ReplyInvitationMutationVariables
  >(ReplyInvitationDocument);

  const firstName = invitation?.firstName ?? "";
  const lastName = invitation?.lastName ?? "";

  /**
   * Handle decline choice → FINAL
   */
  const handleDecline = async () => {
    await replyInvitation({
      variables: {
        input: {
          invitationId: invitation.id,
          choice: RsvpChoice.NO,
          replyInput: null,
        },
      },
    });

    onConfirm();
  };

  /** Desktop VisionOS Dialog */
  const DesktopDialog = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        background: `${theme.palette.background.paper}CC`,
        borderRadius: "24px",
        padding: "32px 40px",
        boxShadow: theme.shadows[6],
        maxWidth: "480px",
        width: "90%",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {t("decline.title")}
        </Typography>

        <Typography variant="body1" sx={{ opacity: 0.85, textAlign: "center" }}>
          {t("decline.descriptionDesktop", { firstName, lastName })}
        </Typography>

        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={handleDecline}
            sx={{
              py: 1.4,
              borderRadius: "14px",
              fontWeight: 600,
            }}
          >
            {t("decline.confirm")}
          </Button>

          <Button variant="text" onClick={onCancel} sx={{ opacity: 0.7 }}>
            {t("common.cancel")}
          </Button>
        </Stack>
      </Stack>
    </motion.div>
  );

  /** Mobile Fullscreen Sheet */
  const MobileSheet = () => (
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
        background: `${theme.palette.background.paper}DD`,
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
            textAlign: "center",
          }}
        >
          {t("decline.title")}
        </Typography>

        <Typography sx={{ opacity: 0.8, textAlign: "center" }}>
          {t("decline.descriptionMobile", { firstName, lastName })}
        </Typography>

        <Button
          fullWidth={true}
          variant="contained"
          color="error"
          disabled={loading}
          onClick={handleDecline}
          sx={{
            py: 1.6,
            borderRadius: "16px",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          {t("decline.confirmMobile")}
        </Button>

        <Button
          fullWidth={true}
          variant="text"
          onClick={onCancel}
          sx={{
            opacity: 0.7,
            borderRadius: "16px",
            py: 1.2,
          }}
        >
          {t("common.cancel")}
        </Button>
      </Stack>
    </motion.div>
  );

  return <>{isMobile ? <MobileSheet /> : <DesktopDialog />}</>;
}
