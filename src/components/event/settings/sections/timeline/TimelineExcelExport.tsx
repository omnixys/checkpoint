"use client";

import { Button } from "@mui/material";
import dayjs from "dayjs";
import * as Xlsx from "xlsx";
import type { TimelineItem } from "../TimelineSection";

interface Props {
  items: TimelineItem[];
}

export default function TimelineExcelExport({ items }: Props) {
  const handleExport = () => {
    const data = items.map((i) => ({
      Label: i.label,
      Type: i.type,
      Time: dayjs(i.timestamp).format("HH:mm"),
    }));

    const ws = Xlsx.utils.json_to_sheet(data);
    const wb = Xlsx.utils.book_new();

    Xlsx.utils.book_append_sheet(wb, ws, "Timeline");

    Xlsx.writeFile(wb, "timeline.xlsx");
  };

  return <Button onClick={handleExport}>📊 Export Excel</Button>;
}
