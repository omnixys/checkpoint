"use client";

import { Stack } from "@mui/material";
import type { TimelineItem } from "../TimelineSection";
import TimelineDownloadButton from "./TimelineDownloadButton";
import TimelineExcelExport from "./TimelineExcelExport";
import TimelinePdfExport from "./TimelinePdfExport";
import TimelinePrintButton from "./TimelinePrintButton";
import type { TimelineDesign } from "./TimelineRenderer";
import TimelineShareButton from "./TimelineShareButton";

interface Props {
  items: TimelineItem[];
  title?: string;
  design?: TimelineDesign;
}

export default function TimelineActionsToolbar({ items, title, design = "clean" }: Props) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{
        justifyContent: "flex-end",
        flexWrap: "wrap",
      }}
    >
      <TimelineDownloadButton items={items} design={design} title={title} />
      <TimelinePrintButton items={items} design={design} title={title} />
      <TimelinePdfExport items={items} design={design} title={title} />
      <TimelineExcelExport items={items} />
      <TimelineShareButton items={items} design={design} title={title} />
    </Stack>
  );
}
