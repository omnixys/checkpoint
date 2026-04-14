"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { motion } from "framer-motion";

type Segment<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  value: T;
  onChange: (v: T) => void;
  segments: Segment<T>[];
};

/**
 * Animated segmented control (Apple-style)
 */
function SegmentedControl<T>({ value, onChange, segments }: Props<T>) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        p: 0.5,
        borderRadius: 999,
        backdropFilter: "blur(20px)",
        backgroundColor: theme.palette.apple.tertiarySystemBackground,
      }}
    >
      {segments.map((s) => {
        const active = s.value === value;

        return (
          <Box
            key={String(s.value)}
            onClick={() => onChange(s.value)}
            sx={{
              position: "relative",
              px: 2.5,
              py: 0.8,
              cursor: "pointer",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              color: active
                ? theme.palette.apple.systemBackground
                : theme.palette.omnixys.textSecondary,
            }}
          >
            {active && (
              <motion.div
                layoutId="segmented-bg"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 999,
                  background: theme.palette.omnixys.primary,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}

            <span style={{ position: "relative", zIndex: 1 }}>{s.label}</span>
          </Box>
        );
      })}
    </Box>
  );
}

type ToolbarProps = {
  date: Date;
  view: "list" | "grid";
  mode: "month" | "year";
  onNavigate: (dir: "prev" | "next") => void;
  onChangeView: (v: "list" | "grid") => void;
  onChangeMode: (m: "month" | "year") => void;
  onToday: () => void;
};

export default function CalendarToolbar({
  date,
  view,
  mode,
  onNavigate,
  onChangeView,
  onChangeMode,
  onToday,
}: ToolbarProps) {
  const theme = useTheme();

  const label =
    mode === "month"
      ? date.toLocaleDateString("de-DE", {
          month: "long",
          year: "numeric",
        })
      : date.getFullYear();

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 4,
        backdropFilter: "blur(20px)",
        backgroundColor: theme.palette.apple.secondarySystemBackground,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton onClick={() => onNavigate("prev")}>
          <ChevronLeftRoundedIcon />
        </IconButton>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {label}
        </Typography>

        <IconButton onClick={() => onNavigate("next")}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <SegmentedControl
          value={view}
          onChange={onChangeView}
          segments={[
            { label: "Liste", value: "list" },
            { label: "Grid", value: "grid" },
          ]}
        />

        <SegmentedControl
          value={mode}
          onChange={onChangeMode}
          segments={[
            { label: "Monat", value: "month" },
            { label: "Jahr", value: "year" },
          ]}
        />

        <Box
          onClick={onToday}
          sx={{
            px: 2,
            py: 0.8,
            borderRadius: 999,
            cursor: "pointer",
            fontWeight: 600,
            backgroundColor: theme.palette.omnixys.primary,
            color: theme.palette.apple.systemBackground,
          }}
        >
          Heute
        </Box>
      </Box>
    </Box>
  );
}
