"use client";

import { Box, Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";

import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

import { motion } from "framer-motion";

import { useCreateEvent } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";
import { useField } from "@/checkpoint/app/(protected)/event/new/hooks/useField";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { MediaType } from "@/checkpoint/generated/graphql";

/**
 * -------------------------------------------------------------
 * Constants
 * -------------------------------------------------------------
 */

const CATEGORY_OPTIONS = ["GENERAL", "KONFERENZ", "MUSIK", "WORKSHOP", "SOCIAL", "SPORTS"] as const;

// const CATEGORY_OPTIONS = [
//   "general",
//   "conference",
//   "music",
//   "workshop",
//   "social",
//   "sports",
// ] as const;

/**
 * -------------------------------------------------------------
 * Component
 * -------------------------------------------------------------
 */
export default function ExperienceStep() {
  const t = useTypedTranslations("create");
  const { addUpload } = useCreateEvent();

  /**
   * -------------------------------------------------------------
   * Fields (GLOBAL CONTEXT)
   * -------------------------------------------------------------
   */
  const category = useField("settings.category");
  const dressCode = useField("settings.dressCode");

  const coverImageUrl = useField("settings.coverImageUrl");
  const logoUrl = useField("settings.logoUrl");

  // const { upload, loading } = useUploadMedia(draft.id ?? "temp");
  /**
   * -------------------------------------------------------------
   * File Handlers (Preview + Form Sync)
   * -------------------------------------------------------------
   */
  const handleFile2 = (file: File | undefined, type: MediaType, setter: (val: string) => void) => {
    if (!file) return;

    /**
     * 1. Preview (instant UX)
     */
    const preview = URL.createObjectURL(file);
    setter(preview);

    /**
     * 2. Save for later upload
     */
    addUpload(file, type);
  };

  const handleFile = (file: File | undefined, type: MediaType) => {
    if (!file) return;

    addUpload(file, type);

    const preview = URL.createObjectURL(file);

    if (type === "COVER") {
      coverImageUrl.onChange(preview);
    } else {
      logoUrl.onChange(preview);
    }
  };

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
      <Stack spacing={3}>
        {/* HEADER */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <StyleRoundedIcon color="primary" />
          <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{t("experience.title")}</Typography>
        </Stack>

        {/* -----------------------------------------------------
         * CATEGORY + DRESS CODE
         * --------------------------------------------------- */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField select label={t("experience.category")} fullWidth {...category}>
              {CATEGORY_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {t(`experience.categories.${opt}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              label={t("experience.dressCode")}
              placeholder={t("experience.dressCodePlaceholder")}
              fullWidth
              {...dressCode}
            />
          </Grid>
        </Grid>

        {/* -----------------------------------------------------
         * MEDIA
         * --------------------------------------------------- */}
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <ImageRoundedIcon color="secondary" />
            <Typography sx={{ fontWeight: 700 }}>{t("experience.media")}</Typography>
          </Stack>

          <Grid container spacing={2}>
            {/* COVER */}
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label={t("experience.coverImageUrl")}
                placeholder={t("experience.coverImageUrlPlaceholder")}
                fullWidth
                {...coverImageUrl}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadRoundedIcon />}
                fullWidth
                sx={{
                  minHeight: 56,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                {t("experience.chooseCover")}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFile(
                      e.target.files?.[0],
                      "COVER",
                      //coverImageUrl.onChange,
                    )
                  }
                />
              </Button>
            </Grid>

            {/* LOGO */}
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label={t("experience.logoUrl")}
                placeholder={t("experience.logoUrlPlaceholder")}
                fullWidth
                {...logoUrl}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadRoundedIcon />}
                fullWidth
                sx={{
                  minHeight: 56,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                {t("experience.chooseLogo")}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFile(
                      e.target.files?.[0],
                      "LOGO",
                      //logoUrl.onChange
                    )
                  }
                />
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
}
