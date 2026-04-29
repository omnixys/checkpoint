"use client";

import NoTicket from "@/checkpoint/components/utils/NoTicket";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useMyTicketQuery from "@/checkpoint/hooks/ticket/useMyTicketQuery";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { JSX } from "react";

/**
 * Displays seat information for the current guest
 * within the active event context.
 */
export default function MySeatContent(): JSX.Element {
  /* -------------------------------------------------------
   * Hooks (ALWAYS executed)
   * ----------------------------------------------------- */
  const { activeEvent } = useActiveEvent();
  const { ticketEventIdMap, myTicketListLoading } = useMyTicketQuery({
    eventId: activeEvent?.id,
    loadMyTicketList: true,
  });

  const ticket = activeEvent ? ticketEventIdMap.get(activeEvent.id) : undefined;

  const { fullSeatInfo, fullSeatInfoLoading, fullSeatInfoError } = useSeatQuery(
    { seatId: ticket?.seatId, loadFullSeatInfo: true },
  );

  // TODO implement i18N keys
  if (!activeEvent) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Kein aktives Event ausgewählt.</Typography>
      </Box>
    );
  }

  if (myTicketListLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Lade Ticket…</Typography>
      </Box>
    );
  }

  if (!ticket) {
    return <NoTicket eventId={activeEvent.id} eventName={activeEvent.name} />;
  }

  if (fullSeatInfoLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Lade Sitzplatz…</Typography>
      </Box>
    );
  }

  if (fullSeatInfoError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Sitzplatz konnte nicht geladen werden.</Typography>
      </Box>
    );
  }

  if (!ticket.seatId || !fullSeatInfo) {
    const canChooseSeat =
      activeEvent.settings?.allowGuestSeatSelection === true;
    const title = canChooseSeat
      ? "Noch keinen Sitzplatz ausgewählt"
      : "Dein Sitzplatz steht noch aus";
    const message = canChooseSeat
      ? "Bitte suche dir noch einen Platz für dieses Event aus."
      : "Bitte gedulde dich noch. Ein Platz wird dir noch zugewiesen.";

    return (
      <Box sx={{ p: 2, pt: 30 }}>
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: canChooseSeat ? "primary.light" : "divider",
            bgcolor: canChooseSeat
              ? "rgba(25, 118, 210, 0.08)"
              : "background.paper",
            backdropFilter: "blur(14px)",
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: canChooseSeat ? "primary.main" : "action.hover",
                  color: canChooseSeat
                    ? "primary.contrastText"
                    : "text.secondary",
                  flexShrink: 0,
                }}
              >
                <EventSeatIcon fontSize="large" />
              </Box>

              <Stack spacing={0.75}>
                <Typography variant="h6">{title}</Typography>
                <Typography color="text.secondary">{message}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  /* -------------------------------------------------------
   * UI
   * ----------------------------------------------------- */
  return (
    <Box sx={{ p: 2, pt: 30 }}>
      <Card
        sx={{
          borderRadius: 4,
          backdropFilter: "blur(14px)",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Dein Sitzplatz</Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <EventSeatIcon />
              <Typography>
                Bereich {fullSeatInfo?.section?.name} · Tisch{" "}
                {fullSeatInfo.table?.name} · Sitz {fullSeatInfo.number}
              </Typography>
            </Stack>

            {fullSeatInfo.label && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <LocationOnIcon />
                <Typography>{fullSeatInfo.label}</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
