"use client";

import { Box, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";

import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import { motion } from "framer-motion";

import { useField } from "@/checkpoint/app/(protected)/event/new/hooks/useField";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/**
 * -------------------------------------------------------------
 * Component
 * -------------------------------------------------------------
 */
export default function VisibilityStep() {
  const t = useTypedTranslations("create");

  /**
   * -------------------------------------------------------------
   * Fields (GLOBAL FORM CONTEXT)
   * -------------------------------------------------------------
   */
  const isPublic = useField("settings.isPublic");
  const allowPublicRsvp = useField("settings.allowPublicRsvp");
  const allowPublicPlusOne = useField("settings.allowPublicPlusOne");
  const allowPublicRsvpWebsite = useField("settings.allowPublicRsvpWebsite");
  const publicWebsite = useField("settings.publicRsvpWebsite");

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
      <Stack spacing={4}>
        {/* -----------------------------------------------------
         * HEADER
         * --------------------------------------------------- */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <PublicRoundedIcon color="primary" />
          <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{t("visibility.title")}</Typography>
        </Stack>

        {/* -----------------------------------------------------
         * SWITCHES
         * --------------------------------------------------- */}
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(isPublic.value)}
                onChange={(e) => isPublic.onChange(e.target.checked)}
              />
            }
            label={t("visibility.isPublic")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(allowPublicRsvp.value)}
                onChange={(e) => allowPublicRsvp.onChange(e.target.checked)}
              />
            }
            label={t("visibility.allowPublicRsvp")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(allowPublicPlusOne.value)}
                onChange={(e) => allowPublicPlusOne.onChange(e.target.checked)}
              />
            }
            label={t("visibility.allowPublicPlusOne")}
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(allowPublicRsvpWebsite.value)}
                onChange={(e) => allowPublicRsvpWebsite.onChange(e.target.checked)}
              />
            }
            label={t("visibility.allowPublicRsvpWebsite")}
          />
        </Stack>

        {/* -----------------------------------------------------
         * WEBSITE FIELD
         * --------------------------------------------------- */}
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <LanguageRoundedIcon color="secondary" />
            <Typography sx={{ fontWeight: 800 }}>{t("visibility.publicWebsiteTitle")}</Typography>
          </Stack>

          <TextField
            label={t("visibility.publicRsvpWebsite")}
            placeholder={t("visibility.publicRsvpWebsitePlaceholder")}
            disabled={!allowPublicRsvpWebsite.value}
            fullWidth
            {...publicWebsite}
          />

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <GroupAddRoundedIcon color="primary" />
            <Typography color="text.secondary">{t("visibility.helperText")}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
