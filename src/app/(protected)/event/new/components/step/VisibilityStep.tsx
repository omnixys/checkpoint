"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

import { useField } from "@/checkpoint/app/(protected)/event/new/hooks/useField";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

function normalizeOptionList(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter((value, index, all) => value.length > 0 && all.indexOf(value) === index);
}

function splitOptions(value: string) {
  return normalizeOptionList(value.split(/[\n,]+/));
}

/**
 * -------------------------------------------------------------
 * Component
 * -------------------------------------------------------------
 */
export default function VisibilityStep() {
  const t = useTypedTranslations("create");
  const [optionInput, setOptionInput] = useState("");

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
  const invitedByOptions = useField("settings.invitedByOptions");
  const invitedByOptionValues = Array.isArray(invitedByOptions.value)
    ? (invitedByOptions.value as string[])
    : [];

  const addInvitedByOptions = (values: string[]) => {
    invitedByOptions.onChange(normalizeOptionList([...invitedByOptionValues, ...values]));
    setOptionInput("");
  };

  const removeInvitedByOption = (value: string) => {
    invitedByOptions.onChange(invitedByOptionValues.filter((option) => option !== value));
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
            fullWidth={true}
            {...publicWebsite}
          />

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <GroupAddRoundedIcon color="primary" />
            <Typography color="text.secondary">{t("visibility.helperText")}</Typography>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontWeight: 800 }}>{t("settings.invitedByOptions")}</Typography>
            <Typography color="text.secondary" variant="body2">
              {t("settings.invitedByOptionsHint")}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              fullWidth={true}
              label={t("settings.invitedByOptionsPlaceholder")}
              value={optionInput}
              onChange={(event) => setOptionInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addInvitedByOptions(splitOptions(optionInput));
                }
              }}
              onPaste={(event) => {
                const values = splitOptions(event.clipboardData.getData("text"));

                if (values.length > 1) {
                  event.preventDefault();
                  addInvitedByOptions(values);
                }
              }}
            />
            <Button
              disabled={splitOptions(optionInput).length === 0}
              onClick={() => addInvitedByOptions(splitOptions(optionInput))}
              startIcon={<AddRoundedIcon />}
              sx={{ minHeight: 48, minWidth: { sm: 140 } }}
              variant="outlined"
            >
              {t("settings.invitedByOptionsAdd")}
            </Button>
          </Stack>

          {invitedByOptionValues.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap={true}>
              {invitedByOptionValues.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onDelete={() => removeInvitedByOption(option)}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
