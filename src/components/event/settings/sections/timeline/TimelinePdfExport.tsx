"use client";

import { Button } from "@mui/material";
import html2pdf from "html2pdf.js";
import type { TimelineItem } from "../TimelineSection";
import { generateTimelineHtmlAdvanced, type TimelineDesign } from "./TimelineRenderer";

interface Props {
  items: TimelineItem[];
  design?: TimelineDesign;
  title?: string | undefined;
}

export default function TimelinePdfExport({ items, design = "clean", title }: Props) {
  const handlePdf = async () => {
    const html = await generateTimelineHtmlAdvanced(items, design, title, window.location.href);

    const element = document.createElement("div");
    element.innerHTML = html;

    html2pdf().from(element).save("timeline.pdf");
  };

  return (
    <Button variant="contained" onClick={handlePdf}>
      📄 Export PDF
    </Button>
  );
}
