"use client";

import { useMutation } from "@apollo/client/react";
import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import {
  ReplyInvitationDocument,
  type ReplyInvitationMutation,
  type ReplyInvitationMutationVariables,
} from "@/checkpoint/generated/graphql";
import { RsvpChoice } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/**
 * MaybeDialog
 * - When guest chooses "MAYBE"
 * - Stores RSVP choice, no user or phone number is created
 * - Allows going back to initial choices
 */
export default function MaybeDialog({
  invitationId,
  onBack,
}: {
  invitationId: string;
  onBack: () => void;
}) {
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [replyInvitation, { loading }] = useMutation<
    ReplyInvitationMutation,
    ReplyInvitationMutationVariables
  >(ReplyInvitationDocument);

  const handleMaybe = async () => {
    await replyInvitation({
      variables: {
        input: {
          invitationId,
          choice: RsvpChoice.MAYBE,
          replyInput: null,
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
          background: `${theme.palette.background.paper}BB`,
          borderRadius: "24px",
          p: isMobile ? 3 : 4,
          boxShadow: theme.shadows[3],
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {t("maybe.title")}
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.8, mt: 1, textAlign: "center" }}>
            {t("maybe.description")}
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
            {t("common.ok")}
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
}
