import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

const SECTION_KEYS = [
  "scope",
  "account",
  "service",
  "userContent",
  "acceptableUse",
  "liability",
  "law",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Checkpoint.",
  page: "terms",
});

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100svh",
        bgcolor: "background.default",
        py: { xs: 6, md: 10 },
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {t("terms.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("terms.intro")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("terms.lastUpdated")}
            </Typography>
          </Stack>

          {SECTION_KEYS.map((section) => (
            <Stack key={section} spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(`terms.sections.${section}.title`)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`terms.sections.${section}.text`)}
              </Typography>
            </Stack>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
