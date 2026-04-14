"use client";

import InvitationStatusChip from "@/checkpoint/components/invitation/InvitationStatusChip";
import { InvitationPayload } from "@/checkpoint/generated/graphql";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------------
 * Card View for Mobile & Tablet devices
 * VisionOS-inspired layout (soft depth, rounded corners, glassy surface)
 * ------------------------------------------------------------------------- */
export default function InvitationCardView({ logic }: { logic: InvitationLogic }) {
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
      {invitations.map((inv) => (
        <Paper
          //TODO optimieren!!!
          onClick={() => logic.openInvitation(inv as InvitationPayload)}
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
            <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: "-0.2px" }}>
              {inv.firstName} {inv.lastName}
            </Typography>

            <InvitationStatusChip status={inv.status} rsvp={inv.rsvpChoice ?? undefined} />

            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              {inv.phoneNumber ?? "Keine Nummer"}
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {inv.email ?? "Keine Email"}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
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
                        //TODO optimieren!!! seatId, seat und event name hinzufügen
                        variables: {
                          input: {
                            invitationId: inv.id,
                            approved: true,
                            eventName: "",
                            seat: "",
                            seatId: "",
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
