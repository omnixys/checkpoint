"use client";

import { Box, Typography } from "@mui/material";

// Premium Modules
import { Event } from "@/types/event/event.type";
import EventDescriptionEditor from "./EventDescriptionEditor";
import EventDetailsAccordion from "./EventDetailsAccordion";
import EventLocationMap from "./EventLocationMap";
import EventTimeline from "./EventTimeline";

type Props = {
  ev: Event;
  active: string;
  onDescriptionChange: (v: string) => void;
};

export default function EventTabContent({
  ev,
  active,
  onDescriptionChange,
}: Props) {
  switch (active) {
    case "timeline":
      return (
        <EventTimeline
          items={
            ev.timeline ?? [
              {
                id: "created",
                type: "event-created",
                timestamp: ev.createdAt,
                label: "Event erstellt",
              },
            ]
          }
        />
      );

    case "settings":
      return <EventDetailsAccordion ev={ev} />;

    case "location":
      if (!ev.address.latitude || !ev.address.longitude) {
        return (
          <Typography sx={{ mt: 2 }}>Keine Standortdaten vorhanden.</Typography>
        );
      }
      return <EventLocationMap ev={ev} />;

    case "description":
      return (
        <EventDescriptionEditor
          value={ev.description ?? ""}
          onChange={onDescriptionChange}
        />
      );

    default:
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">
            Inhalt für den Tab <strong>{active}</strong> ist noch nicht
            implementiert.
          </Typography>
        </Box>
      );
  }
}
