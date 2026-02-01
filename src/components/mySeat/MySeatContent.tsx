"use client";

import { useQuery } from "@apollo/client/react";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { JSX } from "react";

import { useActiveEvent } from "@/providers/ActiveEventProvider";

import { GET_SEAT_BY_ID } from "@/graphql/seat/seat-query.graphql";
import { GET_MY_TICKETS } from "@/graphql/ticket/ticket.query";

import { GetMyTicketsResult } from "@/types/ticket/ticket-graphql-query.type";

import {
  GetSeatByIdRequest,
  GetSeatByIdResult,
} from "@/types/seat/seat-query-graphql.type";
import { Ticket } from "@/types/ticket/ticket.type";

/**
 * Displays seat information for the current guest
 * within the active event context.
 */
export default function MySeatContent(): JSX.Element {
  /* -------------------------------------------------------
   * Hooks (ALWAYS executed)
   * ----------------------------------------------------- */
  const { activeEvent } = useActiveEvent();

  const { data: ticketData, loading: ticketLoading } =
    useQuery<GetMyTicketsResult>(GET_MY_TICKETS);

  const tickets: readonly Ticket[] = ticketData?.getMyTickets ?? [];

  const ticket: Ticket | undefined = activeEvent
    ? tickets.find((t) => t.eventId === activeEvent.id)
    : undefined;

  const seatId: string | null = ticket?.seatId ?? null;

  const {
    data: seatData,
    loading: seatLoading,
    error: seatError,
  } = useQuery<GetSeatByIdResult, GetSeatByIdRequest>(GET_SEAT_BY_ID, {
    variables: seatId ? { seatId } : { seatId: "undefined " },
    skip: !seatId,
  });

  /* -------------------------------------------------------
   * UI states (AFTER hooks)
   * ----------------------------------------------------- */
  if (!activeEvent) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Kein aktives Event ausgewählt.</Typography>
      </Box>
    );
  }

  if (ticketLoading) {
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

  if (!seatId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Noch kein Sitzplatz zugewiesen.</Typography>
      </Box>
    );
  }

  if (seatLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Lade Sitzplatz…</Typography>
      </Box>
    );
  }

  if (seatError || !seatData?.seat) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Sitzplatz konnte nicht geladen werden.</Typography>
      </Box>
    );
  }

  const seat = seatData.seat;

  /* -------------------------------------------------------
   * UI
   * ----------------------------------------------------- */
  return (
    <Box sx={{ p: 2 }}>
      <Card
        sx={{
          borderRadius: 4,
          backdropFilter: "blur(14px)",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Dein Sitzplatz</Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <EventSeatIcon />
              <Typography>
                Bereich {seat?.section?.name} · Tisch {seat.table?.name} · Sitz{" "}
                {seat.number}
              </Typography>
            </Stack>

            {seat.label && (
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon />
                <Typography>{seat.label}</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
