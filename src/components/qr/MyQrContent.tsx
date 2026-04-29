"use client";

import QrCard from "@/checkpoint/components/qr/QrCard";
import { BackButtonBase } from "@/checkpoint/components/utils/back-button-base";
import NoTicket from "@/checkpoint/components/utils/NoTicket";
import useMyTicketQuery from "@/checkpoint/hooks/ticket/useMyTicketQuery";
import { env } from "@/checkpoint/lib/env";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
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

  const { fullTicketEventIdMap, myFullTicketListLoading, myFullTicketListError } = useMyTicketQuery(
    { eventId: activeEvent?.id, loadMyTicketList: true },
  );

  /**
   * Extract ticket for current event
   */
  const ticket = useMemo(() => {
    if (!fullTicketEventIdMap || !activeEvent) return null;

    return fullTicketEventIdMap.get(activeEvent.id);
  }, [fullTicketEventIdMap, activeEvent]);

  if (!activeEvent) return null;

  // TODO implement i18N keys
  if (myFullTicketListLoading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (myFullTicketListError) {
    return <Alert severity="error">Ticket konnte nicht geladen werden.</Alert>;
  }

  if (!ticket) {
    return <NoTicket eventId={activeEvent.id} eventName={activeEvent.name} />;
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
