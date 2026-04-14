"use client";

import { Button } from "@mui/material";
import { TimelineItem } from "../TimelineSection";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

type Props = {
  items: TimelineItem[];
};

export default function TimelineExcelExport({ items }: Props) {
  const handleExport = () => {
    const data = items.map((i) => ({
      Label: i.label,
      Type: i.type,
      Time: dayjs(i.timestamp).format("HH:mm"),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Timeline");

    XLSX.writeFile(wb, "timeline.xlsx");
  };

  return <Button onClick={handleExport}>📊 Export Excel</Button>;
}
