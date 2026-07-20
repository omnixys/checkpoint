"use client";

import SecurityIcon from "@mui/icons-material/Security";
import { alpha, Box, Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useSecurityGuests } from "@/checkpoint/hooks/user/useSecurityGuests";

export default function SecurityStatusWidget() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useParams();
  const { guests } = useSecurityGuests(id as string);

  const stats = useMemo(() => ({
    inside: guests.filter((g) => g.presence === "INSIDE").length,
    outside: guests.filter((g) => g.presence !== "INSIDE").length,
    notArrived: guests.filter((g) => !g.checkedInAt).length,
  }), [guests]);

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        cursor: "pointer",
      }}
      onClick={() => router.push(`/event/${id}/security`)}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <SecurityIcon sx={{ color: theme.palette.warning.main }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Security Status</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              label={`${stats.inside} inside`}
              size="small"
              sx={{ bgcolor: `${theme.palette.success.main}22`, color: theme.palette.success.main, fontWeight: 700 }}
            />
            <Chip
              label={`${stats.outside} outside`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${stats.notArrived} pending`}
              size="small"
              sx={{ bgcolor: `${theme.palette.warning.main}22`, color: theme.palette.warning.main, fontWeight: 700 }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
