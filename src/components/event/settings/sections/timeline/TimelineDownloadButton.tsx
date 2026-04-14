"use client";

import { Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { TimelineItem } from "../TimelineSection";
import { generateTimelineHtml } from "./TimelineHtmlTemplates";
import { TimelineDesign } from "@/checkpoint/components/event/settings/sections/timeline/TimelineRenderer";

type Props = {
  items: TimelineItem[];
  design?: TimelineDesign;
  title?: string | undefined;
};

export default function TimelineDownloadButton({ items, design = "clean", title }: Props) {
  const theme = useTheme();

  const handleDownload = () => {
    const html = generateTimelineHtml(items, design, title);

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "timeline.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      sx={{
        px: 3,
        py: 1.4,
        borderRadius: 3,
        fontWeight: 600,
        background: `linear-gradient(135deg,
          ${theme.palette.primary.main},
          ${theme.palette.secondary.main}
        )`,
        color: "#fff",
        boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
      }}
    >
      ⬇ Download
    </Button>
  );
}
