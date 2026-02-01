"use client";

import { APPROVE_INVITATION_AND_CREATE_TICKET } from "@/components/../graphql/invitation/invitation.mutation";
import { ASSIGN_SEAT } from "@/components/../graphql/seat/seat-mutation.graphql";
import {
  GET_GUEST_SEAT_BY_EVENT,
  GET_SEATS_BY_EVENT,
} from "@/components/../graphql/seat/seat-query.graphql";
import { CREATE_TICKET } from "@/components/../graphql/ticket/ticket.mutation";
import {
  AssignSeatsRequest,
  AssignSeatsResult,
  GetGuestEventSeatRequest,
  GetGuestEventSeatResult,
} from "@/components/../types/seat/seat-mutation-graphql.type";
import {
  GetSeatsByEventRequest,
  GetSeatsByEventResult,
} from "@/components/../types/seat/seat-query-graphql.type";
import {
  CreateTicketRequest,
  CreateTicketResult,
} from "@/components/../types/ticket/ticket-graphql-mutation.type";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { UseInvitationLogicReturn } from "../../hooks/useInvitationLogic";
import { copyToClipboard, rsvpLinkForInvitationId } from "./link";
import { MotionDialogTransition } from "./MotionDialogTransition";

export default function InvitationDetailDialog({
  logic,
}: {
  logic: UseInvitationLogicReturn;
}) {
  /* -------------------------------------------------
   * Mutations / Queries
   * ------------------------------------------------- */
  const [createTicket] = useMutation<CreateTicketResult, CreateTicketRequest>(
    CREATE_TICKET
  );

  const [approveWithSeat] = useMutation(APPROVE_INVITATION_AND_CREATE_TICKET);

  const [loadSeats, { data: seatsData, loading: seatsLoading }] = useLazyQuery<
    GetSeatsByEventResult,
    GetSeatsByEventRequest
  >(GET_SEATS_BY_EVENT);

  const [assignSeat] = useMutation<AssignSeatsResult, AssignSeatsRequest>(
    ASSIGN_SEAT
  );

  const [loadSeat, { data: seatData, loading: seatLoading }] = useLazyQuery<
    GetGuestEventSeatResult,
    GetGuestEventSeatRequest
  >(GET_GUEST_SEAT_BY_EVENT);

  const inv = logic.activeInvitation;

  const [copied, setCopied] = useState(false);
  const [approveSeatOpen, setApproveSeatOpen] = useState(false);
  const [approveSeatId, setApproveSeatId] = useState<string | undefined>();

  useEffect(() => {
    if (!inv) return;

    loadSeats({ variables: { eventId: inv.eventId } });

    if (inv.guestProfileId) {
      loadSeat({
        variables: {
          input: {
            guestId: inv.guestProfileId,
            eventId: inv.eventId,
          },
        },
      });
    }
  }, [inv]);

  if (!inv) return null;

  const currentSeat = seatData?.getSeatByGuestAndEvent ?? null;
  const freeSeats =
    seatsData?.seats?.filter((s) => !s.guestId && !s.note) ?? [];

  const rsvpUrl = rsvpLinkForInvitationId(inv.id);

  const whatsappInviteText =
    `Hallo ${inv.firstName} ${inv.lastName},\n\n` +
    `du bist herzlich eingeladen. Bitte bestätige deine Teilnahme:\n\n` +
    `${rsvpUrl}\n\n` +
    `Vielen Dank!`;

  const openWhatsapp = (text: string, phone?: string | null) => {
    const base = phone
      ? `https://wa.me/${phone.replace(/\D/g, "")}`
      : "https://wa.me/";
    window.open(
      `${base}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <Dialog
      open
      onClose={logic.closeInvitation}
      TransitionComponent={MotionDialogTransition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.75)",
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {inv.firstName} {inv.lastName}
            </Typography>
            <Chip size="small" label={inv.status} sx={{ mt: 0.5 }} />
          </Box>
          <IconButton onClick={logic.closeInvitation}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* ACTIONS */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Einladung
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={() =>
                  logic
                    .approveInvitation({
                      variables: {
                        input: { invitationId: inv.id, approved: true },
                      },
                    })
                    .then(() => logic.reload())
                    .then(() => logic.closeInvitation())
                }
              >
                Approve
              </Button>

              <Button
                variant="contained"
                color="success"
                disabled={!freeSeats.length}
                onClick={() => setApproveSeatOpen(true)}
              >
                Approve + Seat
              </Button>

              <Button
                variant="outlined"
                color="warning"
                onClick={() =>
                  logic
                    .approveInvitation({
                      variables: {
                        input: { invitationId: inv.id, approved: false },
                      },
                    })
                    .then(() => logic.reload())
                    .then(() => logic.closeInvitation())
                }
              >
                Decline
              </Button>
            </Stack>
          </Box>

          <Divider />

          {/* SHARE */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Teilen & Kontakt
            </Typography>
            <Stack spacing={1.5}>
              <Button
                startIcon={<WhatsAppIcon />}
                onClick={() =>
                  openWhatsapp(
                    `Hallo ${inv.firstName}, ich melde mich wegen deiner Einladung.`,
                    inv.phoneNumber ?? null
                  )
                }
              >
                WhatsApp Nachricht senden
              </Button>

              <Button
                startIcon={<WhatsAppIcon />}
                onClick={() =>
                  openWhatsapp(whatsappInviteText, inv.phoneNumber ?? null)
                }
              >
                WhatsApp Einladung senden
              </Button>

              <Tooltip
                title={copied ? "Kopiert!" : "RSVP-Link kopieren"}
                open={copied}
              >
                <Button
                  startIcon={<ContentCopyRoundedIcon />}
                  onClick={async () => {
                    await copyToClipboard(rsvpUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 900);
                  }}
                >
                  RSVP-Link kopieren
                </Button>
              </Tooltip>
            </Stack>
          </Box>

          <Divider />

          {/* SYSTEM */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Verwaltung
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() =>
                  createTicket({
                    variables: {
                      input: {
                        eventId: logic.eventId,
                        invitationId: inv.id,
                        seatId: currentSeat?.id,
                        guestProfileId: inv.guestProfileId ?? "no-id",
                      },
                    },
                  })
                    .then(() => logic.reload())
                    .then(() => logic.closeInvitation())
                }
              >
                Create Ticket
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  logic
                    .deleteInvitation({ variables: { id: inv.id } })
                    .then(() => logic.reload())
                    .then(() => logic.closeInvitation())
                }
              >
                Delete
              </Button>
            </Stack>
          </Box>

          {(seatLoading || seatsLoading) && (
            <Stack direction="row" spacing={2}>
              <CircularProgress size={18} />
              <Typography>Lade Sitzplätze…</Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      {/* Approve with Seat Dialog */}
      <Dialog
        open={approveSeatOpen}
        onClose={() => setApproveSeatOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve & Sitzplatz zuweisen</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box
              component="select"
              value={approveSeatId ?? ""}
              onChange={(e) => setApproveSeatId(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.2)",
              }}
            >
              <option value="" disabled>
                Sitzplatz auswählen…
              </option>
              {freeSeats.map((s) => (
                <option key={s.id} value={s.id}>
                  {`Bereich ${s.section} – Tisch ${s.table} – Platz ${s.number}`}
                </option>
              ))}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={() => setApproveSeatOpen(false)}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={!approveSeatId}
                onClick={() =>
                  approveWithSeat({
                    variables: {
                      input: {
                        invitationId: inv.id,
                        approved: true,
                        seatId: approveSeatId,
                      },
                    },
                  })
                    .then(() => logic.reload())
                    .then(() => {
                      setApproveSeatOpen(false);
                      setApproveSeatId(undefined);
                      logic.closeInvitation();
                    })
                }
              >
                Approve & zuweisen
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
