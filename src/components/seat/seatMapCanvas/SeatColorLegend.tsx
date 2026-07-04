"use client";

import { Box, Chip, Typography } from "@mui/material";
import React from "react";

import { SeatColorGroupMatchType } from "@/checkpoint/generated/graphql";

export interface ColorGroupInfo {
  id: string;
  name: string;
  matchType: SeatColorGroupMatchType;
  isOrphaned?: boolean;
  style: {
    background: string;
    foreground: string;
    border: string;
    legendIcon: string;
  };
}

interface Props {
  colorGroups: ColorGroupInfo[];
}

export default function SeatColorLegend({ colorGroups }: Props) {
  const visible = colorGroups.filter(
    (g) => g.matchType !== SeatColorGroupMatchType.NONE && !g.isOrphaned,
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.75,
        alignItems: "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: "text.secondary", mr: 0.5, whiteSpace: "nowrap" }}
      >
        Gruppen:
      </Typography>
      {visible.map((group) => (
        <Chip
          key={group.id}
          size="small"
          label={group.name}
          sx={{
            bgcolor: group.style.background,
            color: group.style.foreground,
            border: `1px solid ${group.style.border}`,
            fontWeight: 600,
            fontSize: 11,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ))}
    </Box>
  );
}
