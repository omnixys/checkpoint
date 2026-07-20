"use client";

import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { alpha, Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function SupportQueueWidget() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useParams();

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        cursor: "pointer",
      }}
      onClick={() => router.push(`/event/${id}/support`)}
    >
      <CardContent>
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
          <HeadsetMicIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Support Queue</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage guest conversations
          </Typography>
          <Chip label="Open Queue" size="small" color="primary" variant="outlined" />
        </Stack>
      </CardContent>
    </Card>
  );
}
