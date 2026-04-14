"use client";

import { Stack } from "@mui/material";
import { TimelineItem } from "../TimelineSection";
import TimelineDownloadButton from "./TimelineDownloadButton";
import TimelinePrintButton from "./TimelinePrintButton";
import TimelinePdfExport from "./TimelinePdfExport";
import TimelineExcelExport from "./TimelineExcelExport";
import TimelineShareButton from "./TimelineShareButton";
import { TimelineDesign } from "./TimelineRenderer";

type Props = {
  items: TimelineItem[];
  title?: string;
  design?: TimelineDesign;
};

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
