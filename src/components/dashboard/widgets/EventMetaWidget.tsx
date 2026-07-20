"use client";

import InfoIcon from "@mui/icons-material/Info";
import { alpha, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { useParams } from "next/navigation";
import useEventTreeQuery from "@/checkpoint/hooks/events/useEventTreeQuery";

export default function EventMetaWidget() {
  const theme = useTheme();
  const { id } = useParams();
  const eventId = id as string;
  const { fullEventTree } = useEventTreeQuery({ eventId, loadFullEventTreeInfo: true });

  const event = fullEventTree?.rootEvent;
  const name = event?.name ?? "Event";

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <InfoIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Event
            </Typography>
          </Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {name}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
