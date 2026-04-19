"use client";

import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { useRouter } from "next/navigation";
import BlockIcon from "@mui/icons-material/Block";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

export default function ForbiddenPage() {
  const theme = useTheme();
  const router = useRouter();
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
        <BlockIcon sx={{ fontSize: 48, color: theme.palette.error.main }} />

        <Typography variant="h5">{t("forbidden.title")}</Typography>

        <Typography color="text.secondary">{t("forbidden.message")}</Typography>

        <Button variant="contained" onClick={() => router.push(env.CHECKPOINT_BASE_PATH || "/")}>
          {t("forbidden.actions.home")}
        </Button>
      </Stack>
    </Box>
  );
}
