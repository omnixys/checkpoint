"use client";

import { JSX } from "react";
import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CalendarView } from "./calendar-view.type";

type Props = {
  value: CalendarView;
  onChange: (view: CalendarView) => void;
};

export default function CalendarViewSwitch({
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
      {(["list", "grid"] as const).map((v) => (
        <Button
          key={v}
          onClick={() => onChange(v)}
          disableRipple
          sx={{
            px: 2.5,
            py: 0.75,
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            color:
              value === v
                ? theme.palette.apple.systemBackground
                : theme.palette.omnixys.textSecondary,
            backgroundColor:
              value === v ? theme.palette.omnixys.primary : "transparent",
            boxShadow: value === v ? "0 4px 14px rgba(0,0,0,0.18)" : "none",
            "&:hover": {
              backgroundColor:
                value === v ? theme.palette.omnixys.primary : "transparent",
            },
          }}
        >
          {v === "list" ? "Liste" : "Übersicht"}
        </Button>
      ))}
    </Box>
  );
}
