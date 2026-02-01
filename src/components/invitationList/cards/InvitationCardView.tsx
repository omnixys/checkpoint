"use client";

import { Invitation } from "@/components/../types/invitation/invitation.type";
import { UseInvitationLogicReturn } from "@/components/invitationList/hooks/useInvitationLogic";
import InvitationStatusChip from "@/components/invitationList/InvitationStatusChip";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------------
 * Card View for Mobile & Tablet devices
 * VisionOS-inspired layout (soft depth, rounded corners, glassy surface)
 * ------------------------------------------------------------------------- */
export default function InvitationCardView({
  logic,
}: {
  logic: UseInvitationLogicReturn;
}) {
  const theme = useTheme();
  const { invitations } = logic;

  return (
    <Stack
      spacing={3}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr", // Tablet: 2 columns
          md: "1fr 1fr",
          lg: "1fr", // Desktop: we don't use CardView
        },
        gap: 3,
      }}
    >
      {invitations.map((inv: Invitation) => (
        <Paper
          onClick={() => logic.openInvitation(inv)}
          key={inv.id}
          elevation={0}
          sx={{
            borderRadius: "22px",
            padding: 2.4,
            cursor: "pointer",
            backdropFilter: "blur(18px)",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: theme.shadows[8],
              transform: "translateY(-3px)",
            },
          }}
        >
          <Stack spacing={1.3}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ letterSpacing: "-0.2px" }}
            >
              {inv.firstName} {inv.lastName}
            </Typography>

            <InvitationStatusChip status={inv.status} rsvp={inv.rsvpChoice} />

            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              {inv.phoneNumbers?.length
                ? inv.phoneNumbers.join(", ")
                : "Keine Nummer"}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.7,
                  maxWidth: 150,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                /rsvp/{inv.id}
              </Typography>

              <motion.div
                whileTap={{
                  scale: 0.7,
                  backgroundColor: theme.palette.success.light,
                }}
                transition={{ duration: 0.25 }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/checkpoint/rsvp/${inv.id}`,
                    )
                  }
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </motion.div>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <motion.div
                whileTap={{
                  scale: 0.7,
                  backgroundColor: theme.palette.success.light,
                }}
                transition={{ duration: 0.25 }}
              >
                <IconButton
                  color="success"
                  onClick={() =>
                    logic
                      .approveInvitation({
                        variables: {
                          input: {
                            invitationId: inv.id,
                            approved: true,
                          },
                        },
                      })
                      .then(() => logic.refetch())
                  }
                >
                  <CheckCircleRoundedIcon />
                </IconButton>
              </motion.div>

              <motion.div
                whileTap={{
                  scale: 0.7,
                  backgroundColor: theme.palette.success.light,
                }}
                transition={{ duration: 0.25 }}
              >
                <IconButton
                  color="error"
                  onClick={() =>
                    logic
                      .deleteInvitation({
                        variables: { id: inv.id },
                      })
                      .then(() => logic.refetch())
                  }
                >
                  <DeleteForeverRoundedIcon />
                </IconButton>
              </motion.div>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
