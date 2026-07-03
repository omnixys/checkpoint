"use client";

import { Box, Typography } from "@mui/material";
import EventDetailsAccordion from "@/checkpoint/components/event/details/EventDetailsAccordion";
import EventLocationMap from "@/checkpoint/components/event/details/EventLocationMap";
import EventTimeline from "@/checkpoint/components/event/details/EventTimeline";
import EventDescriptionEditor from "@/checkpoint/components/event/EventDescriptionEditor";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface Props {
  ev: any;
  active: string;
  onDescriptionChange: (v: string) => void;
}

export default function EventTabContent({ ev, active, onDescriptionChange }: Props) {
  const t = useTypedTranslations("event");

  switch (active) {
    case "timeline":
      return <EventTimeline items={ev.timeline} />;

    case "settings":
      return <EventDetailsAccordion ev={ev} />;

    case "location":
      return <EventLocationMap eventId={ev.id} />;

    case "description":
      return (
        <EventDescriptionEditor
          value={ev.settings.description ?? ""}
          onChange={onDescriptionChange}
        />
      );

    default:
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">{t("tabs.notImplemented", { tab: active })}</Typography>
        </Box>
      );
  }
}
