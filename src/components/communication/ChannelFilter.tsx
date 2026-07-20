"use client";

import { alpha, Chip, Stack } from "@mui/material";

export interface ChannelOption {
  key: string;
  label: string;
  icon?: string;
}

interface Props {
  channels: ChannelOption[];
  selected: string | null;
  onChange: (key: string | null) => void;
}

export function ChannelFilter({ channels, selected, onChange }: Props) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ px: 1.5, py: 1, flexWrap: "wrap", gap: 0.5 }}>
      {channels.map((ch) => {
        const active = selected === ch.key;
        return (
          <Chip
            key={ch.key}
            label={ch.label}
            size="small"
            onClick={() => onChange(active ? null : ch.key)}
            sx={(theme) => ({
              height: 24,
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 6,
              background: active
                ? alpha(theme.palette.primary.main, 0.12)
                : alpha(theme.palette.divider, 0.3),
              color: active ? theme.palette.primary.main : theme.palette.text.secondary,
              border: active
                ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                : "1px solid transparent",
              transition: "all 0.15s",
              "&:hover": {
                background: active
                  ? alpha(theme.palette.primary.main, 0.18)
                  : alpha(theme.palette.divider, 0.5),
              },
            })}
          />
        );
      })}
    </Stack>
  );
}
