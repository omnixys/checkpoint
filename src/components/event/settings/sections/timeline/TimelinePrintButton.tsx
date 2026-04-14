"use client";

import { Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { TimelineItem } from "../TimelineSection";
import { generateTimelineHtmlAdvanced, TimelineDesign } from "./TimelineRenderer";

type Props = {
  items: TimelineItem[];
  design?: TimelineDesign;
  title?: string | undefined;
};

export default function TimelinePrintButton({ items, design = "clean", title }: Props) {
  const theme = useTheme();

  const handlePrint = async () => {
    const html = await generateTimelineHtmlAdvanced(items, design, title, window.location.href);

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <Button
      onClick={handlePrint}
      sx={{
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        "&:hover": {
          background: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      🖨 Print
    </Button>
  );
}
