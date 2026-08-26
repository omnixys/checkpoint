"use client";

import { useLazyQuery, useMutation } from "@apollo/client/react";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Chip, Divider, Drawer, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InvitationDeleteConfirmDialog from "@/checkpoint/components/invitation/dialogs/InvitationDeleteConfirmDialog";
import {
  AssignSeatDocument,
  type AssignSeatMutation,
  type AssignSeatMutationVariables,
  GetSeatByGuestAndEventDocument,
  type GetSeatByGuestAndEventQuery,
  type GetSeatByGuestAndEventQueryVariables,
  SeatsDocument,
  type SeatsQuery,
  type SeatsQueryVariables,
} from "@/checkpoint/generated/graphql";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { copyToClipboard, rsvpLinkForInvitationId } from "@/checkpoint/utils/invitation/link";

export default function InvitationDetailMobileDialog({ logic }: { logic: InvitationLogic }) {
  const inv = logic.activeInvitation;

  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const [copied, setCopied] = useState(false);
  const [approveSeatOpen, setApproveSeatOpen] = useState(false);
  const [approveSeatId, setApproveSeatId] = useState<string>();
  const [seatQuery, setSeatQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [_assignSeat] = useMutation<AssignSeatMutation, AssignSeatMutationVariables>(
    AssignSeatDocument,
  );

  const [loadSeats, { data: seatsData }] = useLazyQuery<SeatsQuery, SeatsQueryVariables>(
    SeatsDocument,
  );

  const [loadGuestSeat, { data: seatData }] = useLazyQuery<
    GetSeatByGuestAndEventQuery,
    GetSeatByGuestAndEventQueryVariables
  >(GetSeatByGuestAndEventDocument);

  useEffect(() => {
    if (!inv) {
      return;
    }

    loadSeats({ variables: { eventId: inv.eventId } });

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
  }, [inv, loadSeats, loadGuestSeat]);

  if (!inv) {
    return null;
  }

  const currentSeat = seatData?.getSeatByGuestAndEvent ?? null;

  const allSeats = seatsData?.seats ?? [];

  const freeSeats = allSeats.filter((s) => !s.guestId && !s.note) ?? [];

  const preselectedSeatId = currentSeat?.id ?? allSeats.find((s) => s.invitationId === inv.id)?.id;

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
  const selectedInvitedBy = inv.selectedInvitedBy ?? [];
  const plusOneAgeLabel =
    inv.plusOneAgeCategory === "OVER_SIX"
      ? tCommon("plusOne.overSix")
      : inv.plusOneAgeCategory === "UNDER_SIX"
        ? tCommon("plusOne.underSix")
        : null;
  const hasRsvpDetails =
    selectedInvitedBy.length > 0 || Boolean(plusOneAgeLabel) || Boolean(inv.guestNote?.trim());

  const approveInvitation = async (approved: boolean, seatId?: string) => {
    await logic.approveInvitationMutation({
      variables: {
        input: {
          seatId: seatId ?? "",
          eventId: inv.eventId,
          invitationId: inv.id,
          approved,
        },
      },
    });

    await logic.reload();
    logic.closeInvitation();
  };

  const whatsappInviteText = [
    `Hallo ${inv.firstName} ${inv.lastName}`,
    "du bist herzlich eingeladen.",
    "Bitte bestätige deine Teilnahme über diesen Link:",
    rsvpUrl,
  ].join(" ");

  const openWhatsapp = (text: string, phone?: string | null) => {
    const params = new URLSearchParams();
    params.set("text", text);
    if (phone) {
      params.set("phone", phone.replace(/\D/g, ""));
    }

    const url = `https://api.whatsapp.com/send?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={true}
        onClose={logic.closeInvitation}
        slotProps={{
          paper: {
            sx: {
              height: "70%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflowY: "auto",
              p: 2,
            },
          },
        }}
      >
        {approveSeatOpen ? (
          <Stack spacing={2}>
            <Button
              size="small"
              onClick={() => setApproveSeatOpen(false)}
              sx={{ alignSelf: "flex-start", textTransform: "none" }}
            >
              {tInvitation("detail.back")}
            </Button>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {tCommon("chooseSeat")}
            </Typography>

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

            <Box sx={{ overflowY: "auto" }}>
              {Object.entries(seatsBySection).map(([section, seats]) => (
                <Box key={section} sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography variant="caption" sx={{ opacity: 0.6, letterSpacing: 1 }}>
                      {section.toUpperCase()}
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Stack>

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
                            "&:hover": { background: "rgba(255,255,255,0.1)" },
                          }}
                        >
                          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {s.table?.name ?? tInvitation("detail.table")} ·{" "}
                              {tInvitation("detail.seat")} {s.number}
                            </Typography>
                            {selected && (
                              <Typography variant="caption" sx={{ color: "#7ecbff" }}>
                                {tCommon("chosen")}
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

            <Button
              fullWidth={true}
              variant="contained"
              disabled={!approveSeatId}
              onClick={() => approveInvitation(true, approveSeatId)}
            >
              {tInvitation("approveAndSeat")}
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3}>
            {/* TITLE */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              {logic.activeInvitation?.firstName} {logic.activeInvitation?.lastName}
            </Typography>

            {/* PRIMARY ACTIONS */}
            <Stack spacing={1}>
              <Button autoFocus={true} variant="contained" onClick={() => approveInvitation(true)}>
                {tInvitation("approve")}
              </Button>

              <Button
                variant="contained"
                color="success"
                disabled={freeSeats.length === 0}
                onClick={() => {
                  setApproveSeatId(preselectedSeatId);
                  setApproveSeatOpen(true);
                }}
              >
                {tInvitation("approveAndSeat")}
              </Button>

              <Button variant="outlined" color="warning" onClick={() => approveInvitation(false)}>
                {tInvitation("decline")}
              </Button>
            </Stack>

            {inv.guestNote?.trim() && (
              <>
                <Divider />

                <Stack spacing={1.25}>
                  <Typography variant="subtitle2">{tInvitation("detail.guestNote")}</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {inv.guestNote.trim()}
                  </Typography>
                </Stack>
              </>
            )}

            {hasRsvpDetails && (
              <>
                <Divider />

                <Stack spacing={1.25}>
                  <Typography variant="subtitle2">{tInvitation("detail.rsvpDetails")}</Typography>

                  {selectedInvitedBy.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                      {selectedInvitedBy.map((item) => (
                        <Chip
                          key={item}
                          label={`${tInvitation("detail.selectedInvitedBy")}: ${item}`}
                          size="small"
                        />
                      ))}
                    </Stack>
                  )}

                  {plusOneAgeLabel && (
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Typography variant="body2">
                        {tInvitation("detail.plusOneAgeCategory")}:
                      </Typography>
                      {inv.plusOneAgeCategory === "OVER_SIX" ? (
                        <Chip label={plusOneAgeLabel} size="small" color="default" />
                      ) : (
                        <Chip label={plusOneAgeLabel} size="small" color="info" />
                      )}
                    </Stack>
                  )}

                  {inv.guestNote?.trim() && (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {tInvitation("detail.guestNote")}: {inv.guestNote.trim()}
                    </Typography>
                  )}
                </Stack>
              </>
            )}

            <Divider />

            {/* SHARE */}
            <Stack spacing={1}>
              <Typography variant="subtitle2">{tInvitation("detail.shareAndContact")}</Typography>

              <Button
                startIcon={<WhatsAppIcon />}
                onClick={() =>
                  openWhatsapp(
                    tInvitation("detail.whatsappMessage", {
                      firstName: inv.firstName,
                    }),
                    inv.phoneNumber ?? null,
                  )
                }
              >
                {tInvitation("detail.sendWhatsappMessage")}
              </Button>

              <Button
                startIcon={<WhatsAppIcon />}
                onClick={() => openWhatsapp(whatsappInviteText, inv.phoneNumber ?? null)}
              >
                {tInvitation("detail.whatsappInvitation")}
              </Button>

              <Tooltip title={copied ? tCommon("copy") : tInvitation("copyRsvp")} open={copied}>
                <Button
                  startIcon={<ContentCopyRoundedIcon />}
                  onClick={async () => {
                    await copyToClipboard(rsvpUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 900);
                  }}
                >
                  {tInvitation("copyRsvp")}
                </Button>
              </Tooltip>
            </Stack>

            <Divider />

            {/* DELETE */}
            <Button variant="outlined" color="error" onClick={() => setDeleteConfirmOpen(true)}>
              {tCommon("delete")}
            </Button>
          </Stack>
        )}
      </Drawer>

      <InvitationDeleteConfirmDialog
        open={deleteConfirmOpen}
        name={`${inv.firstName ?? ""} ${inv.lastName ?? ""}`.trim()}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={() =>
          logic
            .deleteInvitationMutation({ variables: { id: inv.id } })
            .then(() => logic.reload())
            .then(() => logic.closeInvitation())
        }
      />
    </>
  );
}
