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

export default function TimelineShareButton({ items, design = "clean", title }: Props) {
  const handleShare = async () => {
    try {
      // 1. Generate HTML
      const html = await generateTimelineHtmlAdvanced(items, design, title, window.location.href);

      // 2. Convert to PDF Blob
      const element = document.createElement("div");
      element.innerHTML = html;

      const pdfBlob: Blob = await html2pdf().from(element).outputPdf("blob");

      const file = new File([pdfBlob], "timeline.pdf", {
        type: "application/pdf",
      });

      // 3. Native Share (Mobile)
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: title || "Event Timeline",
          text: "Check out this event",
          files: [file],
        });
        return;
      }

      // 4. Fallback: download
      const url = URL.createObjectURL(file);

      const a = document.createElement("a");
      a.href = url;
      a.download = "timeline.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (_err) {}
  };

  return (
    <Button variant="contained" onClick={handleShare}>
      📲 Share
    </Button>
  );
}
