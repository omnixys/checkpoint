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
import { MotionDialogTransition } from "@/checkpoint/components/motion/MotionDialogTransition";
import { rsvpLinkForInvitationId, copyToClipboard } from "@/checkpoint/utils/invitation/link";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import {
  AssignSeatMutation,
  AssignSeatMutationVariables,
  AssignSeatDocument,
  SeatsQuery,
  SeatsQueryVariables,
  SeatsDocument,
  GetSeatByGuestAndEventQuery,
  GetSeatByGuestAndEventQueryVariables,
  GetSeatByGuestAndEventDocument,
} from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function InvitationDetailDialog({ logic }: { logic: InvitationLogic }) {
  const inv = logic.activeInvitation;
  
    const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");
  

  const [copied, setCopied] = useState(false);
  const [approveSeatOpen, setApproveSeatOpen] = useState(false);
  const [approveSeatId, setApproveSeatId] = useState<string>();
  const [seatQuery, setSeatQuery] = useState("");

  const [assignSeat] = useMutation<AssignSeatMutation, AssignSeatMutationVariables>(
    AssignSeatDocument,
  );

  const [loadSeats, { data: seatsData, loading: seatsLoading }] = useLazyQuery<
    SeatsQuery,
    SeatsQueryVariables
  >(SeatsDocument);

  const [loadGuestSeat, { data: seatData, loading: seatLoading }] = useLazyQuery<
    GetSeatByGuestAndEventQuery,
    GetSeatByGuestAndEventQueryVariables
  >(GetSeatByGuestAndEventDocument);

  useEffect(() => {
    if (!inv) return;

    loadSeats({ variables: { id: inv.eventId } });

    if (inv.guestProfileId) {
      loadGuestSeat({
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

  const freeSeats = seatsData?.seats?.filter((s) => !s.guestId && !s.note) ?? [];

  const filteredSeats = freeSeats.filter((s) => {
    const q = seatQuery.toLowerCase();
    return (
      s.section?.name?.toLowerCase().includes(q) ||
      s.table?.name?.toLowerCase().includes(q) ||
      s.number?.toString().includes(q)
    );
  });

  const seatsBySection = filteredSeats.reduce<Record<string, typeof filteredSeats>>((acc, seat) => {
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
        slots={{
          transition: MotionDialogTransition,
        }}
        sx={{
          pt: 15,
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent tabIndex={-1}>
          <Stack spacing={3}>
            {/* ACTIONS */}
            <Box>
              <Typography variant="h5" gutterBottom sx={{
                pb: 2
              }}>
                {tInvitation("detail.title", { firstName: inv.firstName })}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                <Button
                  autoFocus
                  variant="contained"
                  onClick={() =>
                    logic
                      .approveInvitationMutation({
                        variables: {
                          input: {
                            //TODO optimieren!!!
                            eventName: "",
                            seat: "",
                            seatId: "",
                            invitationId: inv.id,
                            approved: true,
                          },
                        },
                      })
                      .then(() => logic.reload())
                      .then(() => logic.closeInvitation())
                  }
                >
                  {tInvitation("approve")}
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  disabled={!freeSeats.length}
                  onClick={() => setApproveSeatOpen(true)}
                >
                  {tInvitation("approveAndSeat")}
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() =>
                    logic
                      .approveInvitationMutation({
                        //TODO optimieren!!!!
                        variables: {
                          input: {
                            invitationId: inv.id,
                            approved: false,
                            eventName: "",
                            seat: "",
                            seatId: "",
                          },
                        },
                      })
                      .then(() => logic.reload())
                      .then(() => logic.closeInvitation())
                  }
                >
                  {tInvitation("decline")}
                </Button>
              </Stack>
            </Box>

            <Divider />

            {/* SHARE */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {tInvitation("detail.shareAndContact")}
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  startIcon={<WhatsAppIcon />}
                  onClick={() =>
                    openWhatsapp(
                      tInvitation("detail.whatsappMessage", {
                        firstname: inv.firstName,
                      }),
                      inv.phoneNumber ?? null,
                    )
                  }
                >
                  {tInvitation("detail.sendWhatsappMessage")}
                </Button>

                <Button
                  startIcon={<WhatsAppIcon />}
                  onClick={() =>
                    openWhatsapp(whatsappInviteText, inv.phoneNumber ?? null)
                  }
                >
                  {tInvitation("detail.whatsappInvitation")}
                </Button>

                <Tooltip
                  title={copied ? tCommon("copy") : tInvitation("copyRsvp")}
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
                    {tInvitation('copyRsvp')}
                  </Button>
                </Tooltip>
              </Stack>
            </Box>

            <Divider />

            {/* SYSTEM */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
               {tCommon('management')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    logic
                      .deleteInvitationMutation({ variables: { id: inv.id } })
                      .then(() => logic.reload())
                      .then(() => logic.closeInvitation())
                  }
                >
                 {tCommon('delete')}
                </Button>
              </Stack>
            </Box>

            {(seatLoading || seatsLoading) && (
              <Stack direction="row" spacing={2}>
                <CircularProgress size={18} />
                <Typography>{tInvitation("detail.loadingSeats")}</Typography>
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
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              onClick={() => setApproveSeatOpen(false)}
              sx={{ textTransform: "none" }}
            >
              {tInvitation("detail.back")}
            </Button>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {tCommon('chooseSeat')}
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
                placeholder={tInvitation("detail.searchSeatPlaceholder")}
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
                    spacing={1}
                    sx={{
                      mb: 1,
                      alignItems: "center",
                    }}
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
                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              {s.table?.name ?? tInvitation("detail.table")} ·{" "}
                              {tInvitation("detail.seat")} {s.number}
                            </Typography>

                            {selected && (
                              <Typography
                                variant="caption"
                                sx={{ color: "#7ecbff" }}
                              >
                                {tCommon('chosen')}
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
            ></Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
