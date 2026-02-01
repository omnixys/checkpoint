"use client";

import { GET_MY_TICKETS } from "@/graphql/ticket/ticket.query";
import { GetMyTicketsResult } from "@/types/ticket/ticket-graphql-query.type";
import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { useQuery } from "@apollo/client/react";
import { Box, Stack, Typography } from "@mui/material";
import TicketCard from "./TicketCard";

export default function MyQrContent() {
  const { activeEvent } = useActiveEvent();

  // If user has no active event → no UI
  if (!activeEvent) return null;

  /* -------------------------------------------------------
   * Query: load all my tickets
   * ----------------------------------------------------- */
  const { data, loading } = useQuery<GetMyTicketsResult>(GET_MY_TICKETS);

  // Optional: loading state
  if (loading)
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Lade Ticket…</Typography>
      </Box>
    );

  const tickets = data?.getMyTickets ?? [];

  /* -------------------------------------------------------
   * Filter: ticket for THIS event
   * ----------------------------------------------------- */
  const ticket = tickets.find((t: any) => t.eventId === activeEvent.id);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Mein Ticket
          </Typography>
          <Typography sx={{ opacity: 0.75 }}>
            Dein persönlicher QR-Code für dieses Event
          </Typography>
        </Box>

        {/* Correct Ticket */}
        <TicketCard ticket={ticket} event={activeEvent} />
      </Stack>
    </Box>
  );
}
