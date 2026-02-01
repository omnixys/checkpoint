"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import MailListPane from "./MailListPane";
import MailDetailPane from "./MailDetailPane";

export default function NotificationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        height: "100%",
      }}
    >
      <MailListPane selectedId={selectedId} onSelect={setSelectedId} />

      <MailDetailPane notificationId={selectedId} />
    </Box>
  );
}
