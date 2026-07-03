"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Box, Stack, TextField, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useField } from "@/checkpoint/app/(protected)/event/new/hooks/useField";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function BasicsStep() {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  const name = useField("name");
  const description = useField("settings.description");
  const startsAt = useField("settings.startsAt");
  const endsAt = useField("settings.endsAt");

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
      }}
    >
      {/* HEADER */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700 }}>{t("basics.title")}</Typography>
          <AutoAwesomeRoundedIcon color="primary" />
        </Stack>

        <Typography sx={{ color: theme.palette.text.secondary }}>{t("basics.subtitle")}</Typography>
      </Stack>

      {/* FORM */}
      <Stack spacing={3}>
        <TextField label={t("basics.name")} fullWidth={true} {...name} />

        <TextField
          label={t("basics.description")}
          multiline={true}
          minRows={3}
          fullWidth={true}
          {...description}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            type="datetime-local"
            label={t("basics.startsAt")}
            fullWidth={true}
            {...startsAt}
          />

          <TextField
            type="datetime-local"
            label={t("basics.endsAt")}
            fullWidth={true}
            {...endsAt}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
