"use client";

import {
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useState } from "react";

type Filter = "ALL" | "NOT_ARRIVED" | "CHECKED_IN" | "INSIDE" | "OUTSIDE";

type Props = {
  filter: Filter;
  setFilter: (f: Filter) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
};

export function FilterControlCapsule({
  filter,
  setFilter,
  highContrast,
  setHighContrast,
  largeText,
  setLargeText,
}: Props) {
  const theme = useTheme();
  const apple = theme.palette.apple;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      {/* Capsule Button */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          px: 1.5,
          py: 0.8,
          borderRadius: 999,
          backdropFilter: "blur(20px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.7)"
              : "rgba(30,30,30,0.6)",
          border: `1px solid ${apple.separator}`,
        }}
      >
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <TuneIcon fontSize="small" />
        </IconButton>

        <Typography fontSize={13} fontWeight={600}>
          Filter & Anzeige
        </Typography>
      </Box>

      {/* VisionOS-like Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 2,
            minWidth: 260,
            borderRadius: 4,
            backdropFilter: "blur(30px)",
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(255,255,255,0.85)"
                : "rgba(15,15,15,0.85)",
            border: `1px solid ${apple.separator}`,
          },
        }}
      >
        <Stack spacing={2}>
          <Typography fontWeight={700}>Anzeigeoptionen</Typography>

          <Select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
          >
            <MenuItem value="ALL">Alle Gäste</MenuItem>
            <MenuItem value="NOT_ARRIVED">Nicht angekommen</MenuItem>
            <MenuItem value="CHECKED_IN">Eingecheckt</MenuItem>
            <MenuItem value="INSIDE">Drinnen</MenuItem>
            <MenuItem value="OUTSIDE">Draußen</MenuItem>
          </Select>

          <FormControlLabel
            control={
              <Switch
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
            }
            label="High Contrast"
          />

          <FormControlLabel
            control={
              <Switch
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
              />
            }
            label="Große Schrift"
          />
        </Stack>
      </Popover>
    </>
  );
}
