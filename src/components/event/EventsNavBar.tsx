"use client";

import { AppBar, alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import EventsNavButton from "@/checkpoint/components/event/EventsNavButton";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

const CHECKPOINT_BASE_PATH = env.CHECKPOINT_BASE_PATH;

export default function EventsNavBar() {
  const t = useTypedTranslations("event");

  const theme = useTheme();
  const { isMobile } = useDevice();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        px: { xs: 1.4, sm: 2.2 },
        py: { xs: 0.5, sm: 0.8 },
        fontSize: { xs: "0.75rem", sm: "0.9rem" },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", minWidth: 0 }}>
        {!isMobile && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              {t("title")}
            </Typography>

            <Box sx={{ flex: 1 }} />
          </>
        )}

        <Stack
          direction="row"
          spacing={isMobile ? 1 : 1.5}
          sx={{
            px: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <EventsNavButton href={`${CHECKPOINT_BASE_PATH}event`} label={t("overview")} />
          <EventsNavButton href={`${CHECKPOINT_BASE_PATH}calendar`} label={t("calendar")} />
          <EventsNavButton
            href={`${CHECKPOINT_BASE_PATH}event/stats`}
            label={t("stats")}
            disabled={true}
          />
        </Stack>
      </Stack>
    </AppBar>
  );
}
