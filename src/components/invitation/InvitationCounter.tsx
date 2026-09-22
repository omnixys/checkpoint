"use client";

import { alpha, Box, useTheme } from "@mui/material";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface Props {
  count: number;
}

export function InvitationCounter({ count }: Props) {
  const t = useTypedTranslations("invitation");
  const theme = useTheme();

  return (
    <Box
      aria-label={t("counter", { count })}
      sx={{
        alignItems: "center",
        backdropFilter: "blur(12px)",
        background: alpha(theme.palette.background.paper, 0.6),
        border: `1px solid ${theme.palette.extended.border.subtle}`,
        borderRadius: theme.shape.borderRadius,
        color: "text.secondary",
        display: "flex",
        fontVariantNumeric: "tabular-nums",
        fontWeight: 600,
        justifyContent: "center",
        minWidth: 40,
        px: 1.5,
        py: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {count}
    </Box>
  );
}
