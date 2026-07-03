"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { alpha, IconButton, Paper, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import type { InvitationPayload } from "@/checkpoint/generated/graphql";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import InvitationStatusChip from "./InvitationStatusChip";

export default function InvitationCardView({ logic }: { logic: InvitationLogic }) {
  const theme = useTheme();
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${env.CHECKPOINT_BASE_PATH}rsvp/${id}`);

    setCopiedMap((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [id]: false }));
    }, 900);
  };

  return (
    <Stack spacing={2}>
      {logic.invitations.map((inv) => {
        const copied = copiedMap[inv.id] ?? false;

        return (
          <Paper
            key={inv.id}
            onClick={() => logic.openInvitation(inv as InvitationPayload)}
            sx={{
              p: 2,
              borderRadius: "20px",
              backdropFilter: "blur(16px)",
              background: alpha(theme.palette.background.paper, 0.8),
              boxShadow: theme.shadows[4],
            }}
          >
            <Stack spacing={1.5}>
              {/* HEADER */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                  }}
                >
                  {inv.firstName} {inv.lastName}
                </Typography>

                <InvitationStatusChip status={inv.status} rsvp={inv.rsvpChoice ?? undefined} />
              </Stack>

              {/* CONTACT */}
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {inv.phoneNumber || "-"}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                {inv.email || "-"}
              </Typography>

              {/* LINK */}
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                }}
                spacing={1}
              >
                <Typography
                  variant="caption"
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  /rsvp/{inv.id.slice(0, 8)}...
                </Typography>

                <Tooltip title={copied ? tCommon("copy") : tInvitation("copyRsvp")} open={copied}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(inv.id);
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {/* ACTIONS */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();

                    logic
                      .approveInvitationMutation({
                        variables: {
                          input: {
                            eventId: inv.eventId,
                            invitationId: inv.id,
                            approved: true,
                            seatId: "",
                          },
                        },
                      })
                      .then(() => logic.reload());
                  }}
                >
                  <CheckCircleRoundedIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    logic
                      .deleteInvitationMutation({
                        variables: { id: inv.id },
                      })
                      .then(() => logic.reload());
                  }}
                >
                  <DeleteForeverRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
