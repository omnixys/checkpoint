"use client";

import { useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import AddressForm, {
  FormState,
} from "@/checkpoint/components/event/settings/address/AddressForm";

import { useEventAddress } from "@/checkpoint/app/(protected)/create/hooks/useEventAddress";
import { useCreateEvent } from "@/checkpoint/app/(protected)/create/context/CreateEventContext";

/**
 * -------------------------------------------------------------
 * Component
 * -------------------------------------------------------------
 */
export default function AddressStep() {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  const { draft, patch } = useCreateEvent();
  const { resolveGeo } = useEventAddress();

  const [input, setInput] = useState<FormState | null>(null);

  /**
   * -------------------------------------------------------------
   * Handle autocomplete change
   * -------------------------------------------------------------
   */
  const handleChange = (val: FormState) => {
    setInput(val);
  };

  /**
   * -------------------------------------------------------------
   * Resolve address → patch global form
   * -------------------------------------------------------------
   */
  useEffect(() => {
    if (!input) return;

    const text = input.formatted?.trim();
    if (!text || text.length < 5) return;

    let active = true;

    (async () => {
      const result = await resolveGeo(text);
      if (!result || !active) return;

      patch({
        address: {
          street: result.street ?? "",
          houseNumber: result.houseNumber ?? "",
          city: result.city ?? "",
          postalCode: result.postalCode ?? "",
          country: result.country ?? "",
          state: result.state ?? '',
          additionalInfo: '',
        },
      });
    })();

    return () => {
      active = false;
    };
  }, [input, resolveGeo, patch]);

  /**
   * -------------------------------------------------------------
   * Render
   * -------------------------------------------------------------
   */
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
          <LocationOnRoundedIcon color="primary" />

          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: theme.palette.text.primary,
            }}
          >
            {t("address.title")}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: 14,
            color: theme.palette.text.secondary,
          }}
        >
          {t("address.subtitle")}
        </Typography>
      </Stack>

      {/* AUTOCOMPLETE */}
      <AddressForm onChange={handleChange} />

      {/* SELECTED ADDRESS */}
      {draft.address && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: theme.palette.text.secondary,
              mb: 1,
            }}
          >
            {t("address.selected")}
          </Typography>

          <Stack spacing={1}>
            <Typography sx={{ fontSize: 14 }}>
              {draft.address.street} {draft.address.houseNumber}
            </Typography>

            <Typography sx={{ fontSize: 14 }}>
              {draft.address.postalCode} {draft.address.city}
            </Typography>

            <Typography sx={{ fontSize: 14 }}>
              {draft.address.country}
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
