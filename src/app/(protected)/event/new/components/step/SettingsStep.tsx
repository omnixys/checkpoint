"use client";

import {
  alpha,
  Box,
  FormControlLabel,
  Grid,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";

import { motion } from "framer-motion";

import CreateWizardCard from "@/checkpoint/app/(protected)/event/new/components/CreateWizardCard";
import { useField } from "@/checkpoint/app/(protected)/event/new/hooks/useField";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/**
 * -------------------------------------------------------------
 * Component
 * -------------------------------------------------------------
 */
export default function SettingsStep() {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  /**
   * -------------------------------------------------------------
   * Fields (GLOBAL FORM CONTEXT)
   * -------------------------------------------------------------
   */
  const maxSeats = useField("settings.maxSeats");
  const rotateSeconds = useField("settings.rotateSeconds");
  const allowReEntry = useField("settings.allowReEntry");
  const isActive = useField("settings.isActive");

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
      }}
    >
      <Stack spacing={3}>
        {/* HEADER */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <SecurityRoundedIcon color="primary" />
          <Typography sx={{ fontWeight: 800, fontSize: 20 }}>
            {t("settings.title")}
          </Typography>
        </Stack>

        <Typography color="text.secondary">
          {t("settings.description")}
        </Typography>

        {/* -----------------------------------------------------
         * NUMERIC SETTINGS
         * --------------------------------------------------- */}
        <Grid container spacing={2}>
          {/* MAX SEATS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.25}>
              <Typography sx={{ fontWeight: 700 }}>
                {t("settings.maxSeats")}
              </Typography>

              <Slider
                value={Number(maxSeats.value) || 0}
                min={1}
                max={1000}
                step={1}
                onChange={(_, value) => maxSeats.onChange(value)}
                valueLabelDisplay="auto"
              />

              <TextField
                label={t("settings.maxSeatsField")}
                type="number"
                fullWidth
                {...maxSeats}
              />
            </Stack>
          </Grid>

          {/* ROTATE SECONDS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.25}>
              <Typography sx={{ fontWeight: 700 }}>
                {t("settings.rotateSeconds")}
              </Typography>

              <Slider
                value={Number(rotateSeconds.value) || 0}
                min={30}
                max={3600}
                step={30}
                onChange={(_, value) => rotateSeconds.onChange(value)}
                valueLabelDisplay="auto"
              />

              <TextField
                label={t("settings.rotateSecondsField")}
                type="number"
                fullWidth
                {...rotateSeconds}
              />
            </Stack>
          </Grid>
        </Grid>

        {/* -----------------------------------------------------
         * BOOLEAN SETTINGS
         * --------------------------------------------------- */}
        <Grid container spacing={2}>
          {/* RE-ENTRY */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CreateWizardCard
              sx={{
                background: alpha(theme.palette.primary.main, 0.06),
              }}
            >
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <MeetingRoomRoundedIcon color="primary" />
                  <Typography sx={{ fontWeight: 700 }}>
                    {t("settings.allowReEntry")}
                  </Typography>
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(allowReEntry.value)}
                      onChange={(e) => allowReEntry.onChange(e.target.checked)}
                    />
                  }
                  label={t("settings.allowReEntryHint")}
                />
              </Stack>
            </CreateWizardCard>
          </Grid>

          {/* ACTIVE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CreateWizardCard
              sx={{
                background: alpha(theme.palette.secondary.main, 0.06),
              }}
            >
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <SyncRoundedIcon color="secondary" />
                  <Typography sx={{ fontWeight: 700 }}>
                    {t("settings.isActive")}
                  </Typography>
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(isActive.value)}
                      onChange={(e) => isActive.onChange(e.target.checked)}
                    />
                  }
                  label={t("settings.isActiveHint")}
                />
              </Stack>
            </CreateWizardCard>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
