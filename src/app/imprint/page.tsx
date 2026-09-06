import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

const SECTION_KEYS = [
  "serviceProvider",
  "contact",
  "registry",
  "management",
  "responsible",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Imprint",
  description: "Imprint / Legal notice for Checkpoint.",
  page: "imprint",
});

export default async function ImprintPage() {
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
              {t("imprint.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("imprint.intro")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("imprint.lastUpdated")}
            </Typography>
          </Stack>

          {SECTION_KEYS.map((section) => (
            <Stack key={section} spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t(`imprint.sections.${section}.title`)}
              </Typography>
              {section === "contact" ? (
                <Stack spacing={0.25}>
                  <Typography variant="body2" color="text.secondary">
                    {t("imprint.sections.contact.emailLine")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("imprint.sections.contact.phoneLine")}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t(`imprint.sections.${section}.text`)}
                </Typography>
              )}
            </Stack>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
