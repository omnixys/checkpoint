"use client";

import { useLazyQuery, useMutation } from "@apollo/client/react";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

import { APPROVE_INVITATION_AND_CREATE_TICKET } from "@/components/../graphql/invitation/invitation.mutation";
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

import { ASSIGN_SEAT } from "@/components/../graphql/seat/seat-mutation.graphql";
import { UseInvitationLogicReturn } from "../../hooks/useInvitationLogic";
import { copyToClipboard, rsvpLinkForInvitationId } from "./link";
import { MotionDialogTransition } from "./MotionDialogTransition";

export default function InvitationDetailDialog({
  logic,
}: {
  logic: UseInvitationLogicReturn;
}) {
  const inv = logic.activeInvitation;

  const [copied, setCopied] = useState(false);
  const [approveSeatOpen, setApproveSeatOpen] = useState(false);
  const [approveSeatId, setApproveSeatId] = useState<string>();
  const [seatQuery, setSeatQuery] = useState("");

  const [createTicket] = useMutation<CreateTicketResult, CreateTicketRequest>(
    CREATE_TICKET
  );

  const [assignSeat] = useMutation<AssignSeatsResult, AssignSeatsRequest>(
    ASSIGN_SEAT
  );
  const [approveWithSeat] = useMutation(APPROVE_INVITATION_AND_CREATE_TICKET);

  const [loadSeats, { data: seatsData, loading: seatsLoading }] = useLazyQuery<
    GetSeatsByEventResult,
    GetSeatsByEventRequest
  >(GET_SEATS_BY_EVENT);

  const [loadSeat, { data: seatData, loading: seatLoading }] = useLazyQuery<
    GetGuestEventSeatResult,
    GetGuestEventSeatRequest
  >(GET_GUEST_SEAT_BY_EVENT);

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

  const filteredSeats = freeSeats.filter((s) => {
    const q = seatQuery.toLowerCase();
    return (
      s.section?.name?.toLowerCase().includes(q) ||
      s.table?.name?.toLowerCase().includes(q) ||
      s.number?.toString().includes(q)
    );
  });

  const seatsBySection = filteredSeats.reduce<
    Record<string, typeof filteredSeats>
  >((acc, seat) => {
    const key = seat.section?.name ?? "Andere";
    acc[key] ??= [];
    acc[key].push(seat);
    return acc;
  }, {});

  const rsvpUrl = rsvpLinkForInvitationId(inv.id);

  const whatsappInviteText = [
    `Hallo ${inv.firstName} ${inv.lastName}`,
    "du bist herzlich eingeladen.",
    "Bitte bestätige deine Teilnahme über diesen Link:",
    rsvpUrl,
  ].join(" ");

  const openWhatsapp = (text: string, phone?: string | null) => {
    const params = new URLSearchParams();
    params.set("text", text);
    if (phone) params.set("phone", phone.replace(/\D/g, ""));

    const url = `https://api.whatsapp.com/send?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* MAIN DIALOG */}
      <Dialog
        open
        onClose={logic.closeInvitation}
        TransitionComponent={MotionDialogTransition}
        maxWidth="sm"
        fullWidth
      >
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
      </Dialog>

      {/* SEAT DIALOG */}
      <Dialog
        open={approveSeatOpen}
        onClose={() => setApproveSeatOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              size="small"
              onClick={() => setApproveSeatOpen(false)}
              sx={{ textTransform: "none" }}
            >
              ← Zurück
            </Button>

            <Typography fontWeight={700} fontSize={16}>
              Sitzplatz auswählen
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} sx={{ maxHeight: "65vh" }}>
            {/* SEARCH */}
            <Box
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
              }}
            >
              <input
                value={seatQuery}
                onChange={(e) => setSeatQuery(e.target.value)}
                placeholder="Bereich, Tisch oder Platz suchen"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "white",
                  fontSize: 14,
                }}
              />
            </Box>

            {/* LIST */}
            <Box sx={{ overflowY: "auto", pr: 0.5 }}>
              {Object.entries(seatsBySection).map(([section, seats]) => (
                <Box key={section} sx={{ mb: 3 }}>
                  {/* SECTION HEADER */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <Divider sx={{ flex: 1 }} />
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.6, letterSpacing: 1 }}
                    >
                      {section.toUpperCase()}
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Stack>

                  {/* SEATS */}
                  <Stack spacing={1}>
                    {seats.map((s) => {
                      const selected = approveSeatId === s.id;

                      return (
                        <Box
                          key={s.id}
                          onClick={() => setApproveSeatId(s.id)}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            background: selected
                              ? "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))"
                              : "rgba(255,255,255,0.05)",
                            border: selected
                              ? "1px solid rgba(120,200,255,0.6)"
                              : "1px solid rgba(255,255,255,0.12)",
                            boxShadow: selected
                              ? "0 0 0 1px rgba(120,200,255,0.6), 0 8px 24px rgba(0,0,0,0.35)"
                              : "none",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: "rgba(255,255,255,0.1)",
                            },
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={600}>
                              {s.table?.name ?? "Tisch"} · Platz {s.number}
                            </Typography>

                            {selected && (
                              <Typography
                                variant="caption"
                                sx={{ color: "#7ecbff" }}
                              >
                                Ausgewählt
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              ))}
            </Box>

            {/* FOOTER */}
            <Box
              sx={{
                pt: 1.5,
                position: "sticky",
                bottom: 0,
              }}
            >
              <Button
                fullWidth
                size="large"
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
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(180deg, #7ecbff, #5aa8ff)",
                  color: "#00111f",
                  "&:hover": {
                    background: "linear-gradient(180deg, #8fd6ff, #6bb4ff)",
                  },
                }}
              >
                Sitzplatz zuweisen
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
