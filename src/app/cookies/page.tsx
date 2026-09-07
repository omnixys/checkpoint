import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

const SECTION_KEYS = ["essential", "consent", "analytics", "managing"] as const;

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "Cookie Policy for Checkpoint.",
  page: "cookies",
});

export default async function CookiesPage() {
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
              {t("cookies.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("cookies.intro")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("cookies.lastUpdated")}
            </Typography>
          </Stack>

          {SECTION_KEYS.map((section) => (
            <Stack key={section} spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(`cookies.sections.${section}.title`)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`cookies.sections.${section}.text`)}
              </Typography>
            </Stack>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
