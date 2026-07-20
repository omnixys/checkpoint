"use client";

import { alpha, Button, Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  buildQuickActions,
  groupQuickActions,
} from "@/checkpoint/lib/experience/quick-action-builder";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

const GROUP_LABELS: Record<string, string> = {
  guest: "Guest",
  security: "Security",
  admin: "Administration",
};

export default function QuickActionPanel() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const { myRoles, myPermissions } = useActiveEvent();

  const grouped = useMemo(() => {
    const roleIds = myRoles.map((r) => r.key);
    const experience = resolveExperience(roleIds, myPermissions);
    const actions = buildQuickActions(experience, id);
    return groupQuickActions(actions);
  }, [myRoles, myPermissions, id]);

  const hasAny = Object.values(grouped).some((g) => g.length > 0);
  if (!hasAny) return null;

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      {Object.entries(grouped).map(([key, items]) => {
        if (items.length === 0) return null;
        return (
          <Stack key={key} spacing={1.5}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: alpha(theme.palette.text.secondary, 0.6),
                px: 0.5,
              }}
            >
              {GROUP_LABELS[key] ?? key}
            </Typography>
            {items.map((action) => (
              <Button
                key={`${action.featureId}-${action.category}`}
                fullWidth
                variant={action.primary ? "contained" : "outlined"}
                component={Link}
                href={action.path}
                sx={{ borderRadius: 3, fontWeight: 600 }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        );
      })}
    </Stack>
  );
}
