"use client";

import { Stack, Typography } from "@mui/material";
import { TimelineItem, TimelineTicketRenderer } from "./TimelineTicketRenderer";
import { TimelineDesign } from "@/checkpoint/components/event/settings/sections/timeline/TimelineRenderer";

type Props = {
  items: TimelineItem[];
  title?: string;
  design?: TimelineDesign;
};

export default function TimelineTicketPreview({ items, title, design }: Props) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Live Preview</Typography>

      <TimelineTicketRenderer
        items={items}
        title={title}
        design={design}
        qrValue={window.location.href}
      />
    </Stack>
  );
}
