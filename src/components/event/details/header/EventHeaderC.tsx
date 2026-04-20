"use client";

import { alpha, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { EventHeaderProps } from "../EventActions";
import { useEventFormatting } from "@/checkpoint/hooks/events/useEventFormatting";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function EventHeaderC({ ev }: EventHeaderProps) {
  const t = useTypedTranslations("event");
  const theme = useTheme();

  const { roleChipColor, startFormatted, endFormatted } = useEventFormatting(ev);

  return (
    <Box
      sx={{
        borderRadius: 5,
        p: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        backdropFilter: "blur(14px)",
        boxShadow: theme.shadows[2],
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {ev.name}
        </Typography>

        <Chip
          label={
            ev.myRole ? t(`header.role.${ev.myRole}`) : t("header.role.GUEST")
          }
          color={roleChipColor}
          variant="filled"
          sx={{ width: "fit-content", fontWeight: 600 }}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {t("header.start")}: {startFormatted}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t("header.end")}: {endFormatted}
        </Typography>
      </Stack>
    </Box>
  );
}
