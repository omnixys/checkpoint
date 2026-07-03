"use client";

import { Box, Typography, useTheme } from "@mui/material";

interface Props {
  total: number;
  checkedIn: number;
  inside: number;
  outside: number;
}

export function StatusCarousel({ total, checkedIn, inside, outside }: Props) {
  const theme = useTheme();
  const _omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const items = [
    { label: "Gesamt", value: total },
    { label: "Eingecheckt", value: checkedIn, color: theme.palette.success.main },
    { label: "Drinnen", value: inside, color: theme.palette.primary.main },
    { label: "Draußen", value: outside, color: apple.quaternaryLabel },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        pb: 0.5,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            scrollSnapAlign: "start",
            minWidth: 120,
            px: 2,
            py: 1.2,
            borderRadius: 3,
            backdropFilter: "blur(18px)",
            backgroundColor:
              theme.palette.mode === "light" ? "rgba(255,255,255,0.75)" : "rgba(20,20,20,0.55)",
            border: `1px solid ${apple.separator}`,
          }}
        >
          <Typography
            color={apple.secondaryLabel}
            sx={{
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {item.label}
          </Typography>

          <Typography
            color={item.color ?? apple.label}
            sx={{
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
