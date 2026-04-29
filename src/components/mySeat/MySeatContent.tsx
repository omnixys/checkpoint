"use client";

import {
  GetMyTicketsQuery,
  GetMyTicketsQueryVariables,
  GetMyTicketsDocument,
  TicketPayload,
  SeatQuery,
  SeatQueryVariables,
  SeatDocument,
} from "@/checkpoint/generated/graphql";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useMyTicketQuery from "@/checkpoint/hooks/ticket/useMyTicketQuery";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useQuery } from "@apollo/client/react";
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
  const { ticketEventIdMap, myTicketListLoading } = useMyTicketQuery({eventId: activeEvent?.id, loadMyTicketList: true});

  const ticket = activeEvent
    ? ticketEventIdMap.get(activeEvent.id)
    : undefined;

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
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Kein Ticket für dieses Event gefunden.</Typography>
      </Box>
    );
  }

  if (!fullSeatInfo) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Noch kein Sitzplatz zugewiesen.</Typography>
      </Box>
    );
  }

  if (fullSeatInfoLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Lade Sitzplatz…</Typography>
      </Box>
    );
  }

  if (fullSeatInfoError || !fullSeatInfo) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Sitzplatz konnte nicht geladen werden.</Typography>
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
