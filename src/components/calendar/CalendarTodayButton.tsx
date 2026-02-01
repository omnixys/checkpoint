"use client";

import { JSX } from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Props = {
  onClick: () => void;
};

export default function CalendarTodayButton({ onClick }: Props): JSX.Element {
  const theme = useTheme();

  return (
    <Button
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: 999,
        px: 2,
        fontSize: 13,
        fontWeight: 600,
        backgroundColor: theme.palette.apple.tertiarySystemBackground,
        color: theme.palette.omnixys.primary,
      }}
    >
      Heute
    </Button>
  );
}
