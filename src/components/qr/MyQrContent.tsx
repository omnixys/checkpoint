"use client";

import QrCard from "@/checkpoint/components/qr/QrCard";
import { BackButtonBase } from "@/checkpoint/components/utils/back-button-base";
import {
  GetMyTicketsQuery,
  GetMyTicketsQueryVariables,
  GetMyTicketsDocument,
} from "@/checkpoint/generated/graphql";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useQuery } from "@apollo/client/react";
import { Box, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import { useMemo } from "react";
/**
 * MyQrContent
 *
 * Responsibilities:
 * - Load tickets
 * - Filter by active event
 * - Render ticket + QR
 *
 * Enterprise rules:
 * - No request spam
 * - Safe rendering
 * - Zero crash guarantees
 */
export default function MyQrContent() {
  const { activeEvent } = useActiveEvent();

  /**
   * Prevent query execution if no active event
   *
   * Why:
   * Avoid unnecessary requests + rate limit issues
   */
  const { data, loading, error } = useQuery<GetMyTicketsQuery, GetMyTicketsQueryVariables>(
    GetMyTicketsDocument,
    {
      skip: !activeEvent,
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
    },
  );

  /**
   * Extract ticket for current event
   */
  const ticket = useMemo(() => {
    if (!data?.getMyTickets || !activeEvent) return null;

    return data.getMyTickets.find((t) => t.eventId === activeEvent.id) ?? null;
  }, [data, activeEvent]);

  /**
   * No active event → no UI
   */
  if (!activeEvent) return null;

  /**
   * Loading state
   */
  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return <Alert severity="error">Ticket konnte nicht geladen werden.</Alert>;
  }

  /**
   * No ticket for event
   */
  if (!ticket) {
    return <Alert severity="info">Kein Ticket für dieses Event vorhanden.</Alert>;
  }

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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            Mein Ticket
          </Typography>

          <Typography sx={{ opacity: 0.75 }}>Dein persönlicher QR-Code für dieses Event</Typography>
        </Box>

        {/* Ticket Info */}
        <QrCard ticket={ticket} event={activeEvent} />
      </Stack>
    </Box>
  );
}
