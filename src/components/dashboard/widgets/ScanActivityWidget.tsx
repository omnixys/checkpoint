"use client";

import HistoryIcon from "@mui/icons-material/History";
import { alpha, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function ScanActivityWidget() {
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
      onClick={() => router.push(`/event/${id}/scans`)}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <HistoryIcon sx={{ color: theme.palette.info.main }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Scan Activity</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            View recent check-in and scan history
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
