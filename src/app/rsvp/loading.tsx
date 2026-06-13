import { CircularProgress, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import type { JSX } from "react";

const WEDDING_MONOGRAM = "C · R";

export default async function RsvpLoading(): Promise<JSX.Element> {
  const t = await getTranslations("rsvp");

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 50% 18%, rgba(216,184,121,0.18), transparent 34%), #050506",
        color: "#f1ece2",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography
        sx={{
          color: "#d8b879",
          fontFamily: "var(--font-wedding-serif), Georgia, serif",
          fontSize: "1.25rem",
          letterSpacing: "0.28em",
        }}
      >
        {WEDDING_MONOGRAM}
      </Typography>
      <CircularProgress color="inherit" size={34} thickness={2} />
      <Typography variant="body2">{t("public.preparing")}</Typography>
    </Stack>
  );
}
