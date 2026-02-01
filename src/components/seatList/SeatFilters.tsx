"use client";

import React from "react";
import {
  Stack,
  useTheme,
  alpha,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { SeatStatus } from "@/types/seat/seat-enum.type";
import { SeatFilter, SeatFilterStatus } from "@/types/seat/seat.type";

interface Props {
  filter: SeatFilter;
  onChange: (v: SeatFilter) => void;
}

export default function SeatFilters({ filter, onChange }: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{
        background: alpha(theme.palette.background.paper, 0.5),
        p: 2,
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      }}
    >
      <TextField
        label="Search Seat / Name"
        fullWidth
        value={filter.search}
        onChange={(e) => onChange({ ...filter, search: e.target.value })}
      />

      <Select
        fullWidth
        value={filter.status}
        onChange={(e) =>
          onChange({
            ...filter,
            status: e.target.value as SeatFilterStatus,
          })
        }
      >
        <MenuItem value="all">Alle</MenuItem>
        <MenuItem value={SeatStatus.AVAILABLE}>Verfügbar</MenuItem>
        <MenuItem value={SeatStatus.RESERVED}>Reserviert</MenuItem>
        <MenuItem value={SeatStatus.ASSIGNED}>Zugewiesen</MenuItem>
        <MenuItem value={SeatStatus.BLOCKED}>Geblockt</MenuItem>
      </Select>
    </Stack>
  );
}
