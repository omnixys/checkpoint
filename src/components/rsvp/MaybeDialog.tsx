"use client";

import { REPLY_INVITATION } from "@/graphql/invitation/invitation.mutation";
import { RsvpChoice } from "@/types/invitation/invitation-enum.type";
import {
  ReplyInvitationRequest,
  ReplyInvitationResult,
} from "@/types/invitation/invitation-mutation.graphql.type";
import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

/**
 * MaybeDialog
 * - When guest chooses "MAYBE"
 * - Stores RSVP choice, no user or phone number is created
 * - Allows going back to initial choices
 */
export default function MaybeDialog({
  invitation,
  onBack,
}: {
  invitation: any;
  onBack: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [replyInvitation, { loading }] = useMutation<
    ReplyInvitationResult,
    ReplyInvitationRequest
  >(REPLY_INVITATION);

  const handleMaybe = async () => {
    await replyInvitation({
      variables: {
        input: {
          invitationId: invitation.id,
          choice: RsvpChoice.MAYBE,
        },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <Box
        sx={{
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          background: theme.palette.background.paper + "BB",
          borderRadius: "24px",
          p: isMobile ? 3 : 4,
          boxShadow: theme.shadows[3],
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={700}
            textAlign="center"
          >
            Entscheidung gespeichert
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ opacity: 0.8, mt: 1 }}
          >
            Alles klar! Deine Auswahl „Vielleicht“ wurde gespeichert. Du kannst
            deine Entscheidung später jederzeit ändern.
          </Typography>

          <Button
            variant="contained"
            onClick={async () => {
              await handleMaybe();
              onBack();
            }}
            disabled={loading}
            sx={{
              mt: 3,
              px: 4,
              py: 1.6,
              borderRadius: "14px",
              fontSize: "1.05rem",
              fontWeight: 600,
            }}
          >
            OK
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
}
