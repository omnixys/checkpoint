import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

const SECTION_KEYS = [
  "controller",
  "collected",
  "analytics",
  "cookies",
  "legalBasis",
  "rights",
  "contact",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Checkpoint.",
  page: "privacy",
});

export default async function PrivacyPage() {
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
              {t("privacy.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("privacy.intro")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("privacy.lastUpdated")}
            </Typography>
          </Stack>

          {SECTION_KEYS.map((section) => (
            <Stack key={section} spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(`privacy.sections.${section}.title`)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`privacy.sections.${section}.text`)}
              </Typography>
            </Stack>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
