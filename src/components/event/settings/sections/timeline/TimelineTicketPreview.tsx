"use client";

import { Stack, Typography } from "@mui/material";
import type { TimelineDesign } from "@/checkpoint/components/event/settings/sections/timeline/TimelineRenderer";
import { type TimelineItem, TimelineTicketRenderer } from "./TimelineTicketRenderer";

interface Props {
  items: TimelineItem[];
  title?: string;
  design?: TimelineDesign;
}

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
