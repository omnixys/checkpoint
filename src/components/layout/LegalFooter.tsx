"use client";

import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

const CHECKPOINT_BASE_PATH = env.CHECKPOINT_BASE_PATH;

export default function LegalFooter() {
  const t = useTypedTranslations("legal");

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: { xs: 2, md: 4 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{ alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}
      >
        <Typography variant="caption" color="text.secondary">
          {new Date().getFullYear()} © Omnixys
        </Typography>
        <Typography
          variant="caption"
          component={Link}
          href={`${CHECKPOINT_BASE_PATH}privacy`}
          color="text.secondary"
          sx={{ textDecoration: "underline" }}
        >
          {t("nav.privacy")}
        </Typography>
        <Typography
          variant="caption"
          component={Link}
          href={`${CHECKPOINT_BASE_PATH}imprint`}
          color="text.secondary"
          sx={{ textDecoration: "underline" }}
        >
          {t("nav.imprint")}
        </Typography>
        <Typography
          variant="caption"
          component={Link}
          href={`${CHECKPOINT_BASE_PATH}terms`}
          color="text.secondary"
          sx={{ textDecoration: "underline" }}
        >
          {t("nav.terms")}
        </Typography>
        <Typography
          variant="caption"
          component={Link}
          href={`${CHECKPOINT_BASE_PATH}cookies`}
          color="text.secondary"
          sx={{ textDecoration: "underline" }}
        >
          {t("nav.cookies")}
        </Typography>
      </Stack>
    </Box>
  );
}
