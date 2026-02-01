"use client";

import { REPLY_INVITATION } from "@/graphql/invitation/invitation.mutation";
import { RsvpChoice } from "@/types/invitation/invitation-enum.type";
import {
  ReplyInvitationRequest,
  ReplyInvitationResult,
} from "@/types/invitation/invitation-mutation.graphql.type";
import { useMutation } from "@apollo/client/react";
import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [replyInvitation, { loading }] = useMutation<
    ReplyInvitationResult,
    ReplyInvitationRequest
  >(REPLY_INVITATION);

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
        background: theme.palette.background.paper + "CC",
        borderRadius: "24px",
        padding: "32px 40px",
        boxShadow: theme.shadows[6],
        maxWidth: "480px",
        width: "90%",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h6" fontWeight={700} textAlign="center">
          Einladung ablehnen?
        </Typography>

        <Typography variant="body1" textAlign="center" sx={{ opacity: 0.85 }}>
          {firstName} {lastName}, bist du sicher, dass du nicht teilnehmen
          möchtest? Diese Entscheidung ist endgültig.
        </Typography>

        <Stack spacing={2} width="100%">
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
            Ja, absagen
          </Button>

          <Button variant="text" onClick={onCancel} sx={{ opacity: 0.7 }}>
            Abbrechen
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
        background: theme.palette.background.paper + "DD",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Einladung ablehnen?
        </Typography>

        <Typography textAlign="center" sx={{ opacity: 0.8 }}>
          {firstName} {lastName}, möchtest du wirklich absagen? Diese
          Entscheidung kann nicht rückgängig gemacht werden.
        </Typography>

        <Button
          fullWidth
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
          Ja, ich sage ab
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={onCancel}
          sx={{
            opacity: 0.7,
            borderRadius: "16px",
            py: 1.2,
          }}
        >
          Abbrechen
        </Button>
      </Stack>
    </motion.div>
  );

  return <>{isMobile ? <MobileSheet /> : <DesktopDialog />}</>;
}
