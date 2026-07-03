"use client";

import TimerIcon from "@mui/icons-material/Timer";
import { alpha, Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function RateLimitPage() {
  const theme = useTheme();
  const _router = useRouter();
  const t = useTypedTranslations("error");

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          p: 4,
          borderRadius: 24,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
        }}
      >
        <TimerIcon sx={{ fontSize: 48, color: theme.palette.warning.main }} />

        <Typography variant="h5">{t("rateLimit.title")}</Typography>

        <Typography color="text.secondary">{t("rateLimit.message")}</Typography>

        <Button variant="contained" onClick={() => location.reload()}>
          {t("rateLimit.actions.retry")}
        </Button>
      </Stack>
    </Box>
  );
}
