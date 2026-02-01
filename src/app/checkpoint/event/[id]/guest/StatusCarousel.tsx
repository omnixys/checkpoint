"use client";

import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";

type Props = {
  total: number;
  checkedIn: number;
  inside: number;
  outside: number;
};

export function StatusCarousel({ total, checkedIn, inside, outside }: Props) {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const items = [
    { label: "Gesamt", value: total },
    { label: "Eingecheckt", value: checkedIn, color: omni.success },
    { label: "Drinnen", value: inside, color: omni.primary },
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
              theme.palette.mode === "light"
                ? "rgba(255,255,255,0.75)"
                : "rgba(20,20,20,0.55)",
            border: `1px solid ${apple.separator}`,
          }}
        >
          <Typography
            fontSize={12}
            color={apple.secondaryLabel}
            fontWeight={600}
          >
            {item.label}
          </Typography>

          <Typography
            fontSize={22}
            fontWeight={800}
            color={item.color ?? apple.label}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
