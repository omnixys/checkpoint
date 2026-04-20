"use client";

import { Drawer, Stack, Typography, Button, Divider, Box, Tooltip } from "@mui/material";

import { AssignSeatDocument, AssignSeatMutation, AssignSeatMutationVariables, GetSeatByGuestAndEventDocument, GetSeatByGuestAndEventQuery, GetSeatByGuestAndEventQueryVariables, InvitationPayload, SeatsDocument, SeatsQuery, SeatsQueryVariables } from "@/checkpoint/generated/graphql";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useEffect, useState } from "react";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { copyToClipboard, rsvpLinkForInvitationId } from "@/checkpoint/utils/invitation/link";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";


export default function InvitationDetailMobileDialog({
  logic,
}: {
  logic: InvitationLogic;
  }) {
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
    <Drawer
      anchor="bottom"
      open
      onClose={logic.closeInvitation}
      slotProps={{
        paper: {
          sx: {
            height: "70%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            p: 2,
          },
        },
      }}
    >
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
          <Button
            autoFocus
            variant="contained"
            onClick={() =>
              logic
                .approveInvitation({
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
                .approveInvitation({
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

        <Divider />

        {/* SHARE */}
        <Stack spacing={1}>
          <Typography variant="subtitle2">
            {tInvitation("detail.shareAndContact")}
          </Typography>

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
              {tInvitation("copyRsvp")}
            </Button>
          </Tooltip>
        </Stack>

        <Divider />

        {/* DELETE */}
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
          {tCommon("delete")}
        </Button>
      </Stack>
    </Drawer>
  );
}
