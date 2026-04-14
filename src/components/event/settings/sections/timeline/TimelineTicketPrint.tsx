"use client";

import { Button } from "@mui/material";
import { TimelineItem, renderTicketToHtml } from "./TimelineTicketRenderer";

type Props = {
  items: TimelineItem[];
  title?: string;
};

export default function TimelineTicketPrint({ items, title }: Props) {
  const handlePrint = async () => {
    const html = await renderTicketToHtml(items, title);

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(html);
    win.document.close();
    win.print();
  };

  return <Button onClick={handlePrint}>🖨 Print Ticket</Button>;
}
