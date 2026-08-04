"use client";

import FlashOnIcon from "@mui/icons-material/FlashOn";
import { alpha, Box, Card, CardContent, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getFeaturesByIds } from "@/checkpoint/lib/experience/feature-registry";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

export default function QuickActionsWidget() {
  const theme = useTheme();
  const router = useRouter();
  const { myRoles, myPermissions } = useActiveEvent();

  const actions = useMemo(() => {
    const roleIds = myRoles.map((r) => r.key);
    const experience = resolveExperience(roleIds, myPermissions);
    return getFeaturesByIds(experience.allowedFeatureIds)
      .filter((f) => f.id !== "event-dashboard" && f.id !== "my-dashboard")
      .slice(0, 8);
  }, [myRoles, myPermissions]);

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
            <FlashOnIcon sx={{ color: theme.palette.warning.main }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Quick Actions
            </Typography>
          </Stack>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {actions.map((f) => (
              <Chip
                key={f.id}
                label={f.label}
                size="small"
                clickable
                onClick={() => {
                  const path = f.path.replace("[id]", "");
                  router.push(path ? `/${path}` : "/");
                }}
                sx={{
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                }}
              />
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
