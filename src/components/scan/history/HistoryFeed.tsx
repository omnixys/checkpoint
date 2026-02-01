"use client";

import { useActiveEvent } from "@/components/../providers/ActiveEventProvider";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import HistoryItemCard, { HistoryEntry } from "./HistoryItemCard";

/* ---------------------------------------------------------------------
 * WebSocket Feed
 * ------------------------------------------------------------------- */
export default function HistoryFeed() {
  const { activeEventId } = useActiveEvent();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://your-gateway/ws/scan-history?event=${activeEventId}`
    );

    ws.onmessage = (msg) => {
      const data: HistoryEntry = JSON.parse(msg.data);

      setEntries((prev) => [data, ...prev]); // newest first
    };

    return () => ws.close();
  }, [activeEventId]);

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
      <Stack spacing={2}>
        {entries.map((entry, idx) => (
          <HistoryItemCard key={idx} entry={entry} />
        ))}
      </Stack>
    </Box>
  );
}
