"use client";

import PeopleIcon from "@mui/icons-material/People";
import { alpha, Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useSecurityGuests } from "@/checkpoint/hooks/user/useSecurityGuests";

export default function GuestStatsWidget() {
  const theme = useTheme();
  const { id } = useParams();
  const eventId = id as string;
  const { guests } = useSecurityGuests(eventId);

  const stats = useMemo(
    () => ({
      total: guests.length,
      checkedIn: guests.filter((g) => g.checkedInAt).length,
      inside: guests.filter((g) => g.presence === "INSIDE").length,
    }),
    [guests],
  );

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
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <PeopleIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Guest Stats
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip label={`${stats.total} total`} size="small" variant="outlined" />
            <Chip
              label={`${stats.checkedIn} checked in`}
              size="small"
              sx={{
                bgcolor: `${theme.palette.success.main}22`,
                color: theme.palette.success.main,
                fontWeight: 700,
              }}
            />
            <Chip
              label={`${stats.inside} inside`}
              size="small"
              sx={{
                bgcolor: `${theme.palette.info.main}22`,
                color: theme.palette.info.main,
                fontWeight: 700,
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
