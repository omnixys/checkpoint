"use client";

import type { SelectChangeEvent } from "@mui/material";
import { alpha, Chip, MenuItem, Select, Stack, TextField, useTheme } from "@mui/material";

export type PresenceFilter = "all" | "free" | "occupied" | "INSIDE" | "revoked";

export interface SeatMapFilters {
  search: string;
  presence: PresenceFilter;
}

interface Props {
  filters: SeatMapFilters;
  onChange: (filters: SeatMapFilters) => void;
  resultCount?: number;
}

export default function SeatMapSearch({ filters, onChange, resultCount }: Props) {
  const theme = useTheme();

  const handlePresenceChange = (e: SelectChangeEvent<PresenceFilter>) => {
    onChange({ ...filters, presence: e.target.value as PresenceFilter });
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      sx={{
        background: alpha(theme.palette.background.paper, 0.5),
        p: { xs: 1, sm: 1.5 },
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        minWidth: 0,
        alignItems: { md: "center" },
      }}
    >
      <TextField
        label="Sitz / Gast / Section / Tisch"
        size="small"
        fullWidth={true}
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        sx={{ minWidth: 200 }}
      />

      <Select<PresenceFilter>
        size="small"
        value={filters.presence}
        onChange={handlePresenceChange}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="all">Alle</MenuItem>
        <MenuItem value="free">Frei</MenuItem>
        <MenuItem value="occupied">Belegt</MenuItem>
        <MenuItem value="INSIDE">Eingecheckt</MenuItem>
        <MenuItem value="revoked">Storniert</MenuItem>
      </Select>

      {resultCount !== undefined && (
        <Chip
          label={`${resultCount} Treffer`}
          size="small"
          variant="outlined"
          sx={{ whiteSpace: "nowrap" }}
        />
      )}
    </Stack>
  );
}
