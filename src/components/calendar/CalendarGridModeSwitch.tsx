"use client";

import { JSX } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CalendarGridViewMode } from "./calendar-view.type";

type Props = {
  value: CalendarGridViewMode;
  onChange: (mode: CalendarGridViewMode) => void;
};

export default function CalendarGridModeSwitch({
  value,
  onChange,
}: Props): JSX.Element {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "inline-flex",
        p: 0.5,
        borderRadius: 999,
        backgroundColor: theme.palette.apple.tertiarySystemBackground,
        gap: 0.5,
      }}
    >
      {(["month", "year"] as const).map((mode) => (
        <Button
          key={mode}
          disableRipple
          onClick={() => onChange(mode)}
          sx={{
            px: 2.5,
            py: 0.75,
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            backgroundColor:
              value === mode ? theme.palette.omnixys.primary : "transparent",
            color:
              value === mode
                ? theme.palette.apple.systemBackground
                : theme.palette.omnixys.textSecondary,
          }}
        >
          {mode === "month" ? "Monat" : "Jahr"}
        </Button>
      ))}
    </Box>
  );
}
