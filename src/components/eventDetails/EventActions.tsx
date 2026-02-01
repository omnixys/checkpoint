"use client";

import { EventRole } from "@/types/event/event-enum.type";
import { Event } from "@/types/event/event.type";
import { getLogger } from "@/utils/logger";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

export type EventHeaderProps = {
  ev: Event;
};

export default function EventActions({ ev }: EventHeaderProps) {
  const logger = getLogger("EventActions");
  logger.debug({ ev });
  return (
    <Stack spacing={1.5}>
      <Button
        fullWidth
        variant="contained"
        component={Link}
        href={`/checkpoint/event/${ev.id}/description`}
        sx={{ borderRadius: 3, fontWeight: 600 }}
      >
        Description
      </Button>
      {/* Guest */}
      {ev.myRole === EventRole.GUEST && (
        <>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href={`/my-qr?eventId=${ev.id}`}
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            My Ticket (QR)
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/my-seat?eventId=${ev.id}`}
            sx={{ borderRadius: 3 }}
          >
            My seat
          </Button>
        </>
      )}

      {/* Security */}
      {ev.myRole === EventRole.SECURITY && (
        <>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href={`/scan?eventId=${ev.id}`}
            sx={{ borderRadius: 3 }}
          >
            Scanner starten
          </Button>

          <Button
            component={Link}
            href={`/checkpoint/event/${ev.id}/scans`}
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            Scan Logs
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/guest`}
            sx={{ borderRadius: 3 }}
          >
            Gästeliste
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/seat`}
            sx={{ borderRadius: 3 }}
          >
            Sitzplätze
          </Button>
        </>
      )}

      {/* Admin */}
      {ev.myRole === EventRole.ADMIN && (
        <>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href={`/checkpoint/event/${ev.id}/invitation`}
            sx={{ borderRadius: 3 }}
          >
            Einladungen verwalten
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/seat`}
            sx={{ borderRadius: 3 }}
          >
            Sitzplätze verwalten
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/ticket`}
            sx={{ borderRadius: 3 }}
          >
            Tickets verwalten
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/security`}
            sx={{ borderRadius: 3 }}
          >
            Security Dashboard
          </Button>

          <Button
            component={Link}
            href={`/checkpoint/event/${ev.id}/scans`}
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 3 }}
            disabled
          >
            Scan Logs
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/guest`}
            sx={{ borderRadius: 3 }}
          >
            Gästeliste
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`/checkpoint/event/${ev.id}/settings`}
            sx={{ borderRadius: 3 }}
            disabled
          >
            Event Einstellungen
          </Button>
        </>
      )}
    </Stack>
  );
}
