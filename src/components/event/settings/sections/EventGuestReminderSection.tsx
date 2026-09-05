"use client";

import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import { type GetEventSettingsQuery, GuestReminderPreset } from "@/checkpoint/generated/graphql";

import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import type { Safe } from "@/checkpoint/types/core/core.type";
import { mapSettingsPatchToInput } from "@/checkpoint/utils/event/settings.mapper";

type SettingsType = Safe<Safe<GetEventSettingsQuery["event"]>["settings"]>;

const GUEST_REMINDER_PRESETS: GuestReminderPreset[] = [
  GuestReminderPreset.WEEK_BEFORE,
  GuestReminderPreset.THREE_DAYS_BEFORE,
  GuestReminderPreset.HOURS_24_BEFORE,
];

interface Props {
  settings: SettingsType;
  actions: {
    updateSettings: (patch: any) => Promise<any>;
  };
}

function normalizeSettings(settings: SettingsType) {
  return {
    ...settings,
    guestConfirmationReminderEnabled: settings.guestConfirmationReminderEnabled ?? true,
    guestConfirmationReminderPresets:
      settings.guestConfirmationReminderPresets ?? GUEST_REMINDER_PRESETS,
    guestConfirmationMaxResends: settings.guestConfirmationMaxResends ?? 2,
  };
}

const PRESET_LABELS: Record<GuestReminderPreset, string> = {
  [GuestReminderPreset.WEEK_BEFORE]: "1 Woche vorher",
  [GuestReminderPreset.THREE_DAYS_BEFORE]: "3 Tage vorher",
  [GuestReminderPreset.HOURS_24_BEFORE]: "24 Stunden vorher",
};

export default function EventGuestReminderSection({ settings, actions }: Props) {
  const theme = useTheme();

  const [local, setLocal] = useState<SettingsType>(() => normalizeSettings(settings));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLocal(normalizeSettings(settings));
    setDirty(false);
  }, [settings]);

  const update = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const togglePreset = (preset: GuestReminderPreset) => {
    const presets = local.guestConfirmationReminderPresets ?? [];
    const next = presets.includes(preset)
      ? presets.filter((item) => item !== preset)
      : [...presets, preset];

    update("guestConfirmationReminderPresets", next);
  };

  const handleSave = async () => {
    setDirty(false);

    const enabled = Boolean(local.guestConfirmationReminderEnabled);
    const presets = (local.guestConfirmationReminderPresets ?? GUEST_REMINDER_PRESETS).filter(
      (preset) => GUEST_REMINDER_PRESETS.includes(preset),
    );

    await actions.updateSettings({
      ...mapSettingsPatchToInput(settings, local),
      guestConfirmationReminderEnabled: enabled,
      guestConfirmationReminderPresets: presets,
      guestConfirmationMaxResends:
        presets.length === 0 ? null : (local.guestConfirmationMaxResends ?? null),
    });
  };

  const panelSx = {
    p: 2.5,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.72)",
    boxShadow: theme.palette.mode === "dark" ? "none" : "0 10px 30px rgba(15,23,42,0.06)",
  };

  const inputSx = glassInputSx(theme);
  const enabled = Boolean(local.guestConfirmationReminderEnabled);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Guest Confirmation Reminder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Automatische Erinnerungen an Gäste, die ihre Teilnahme noch nicht bestätigt haben.
        </Typography>
      </Box>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={(e) => update("guestConfirmationReminderEnabled", e.target.checked)}
                />
              }
              label="Reminder aktiviert"
            />
            <Tooltip title="Gäste ohne Registrierung erhalten beim Genehmigen erneut eine Bestätigungsanfrage, sobald einer der Zeitpunkte erreicht ist.">
              <Chip label="Gilt für nicht registrierte Gäste" size="small" variant="outlined" />
            </Tooltip>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Erinnerungszeitpunkte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Jeweils relativ zum Event-Beginn. Zeitpunkte in der Vergangenheit werden übersprungen.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", pt: 1 }} useFlexGap={true}>
              {GUEST_REMINDER_PRESETS.map((preset) => {
                const active = (local.guestConfirmationReminderPresets ?? []).includes(preset);
                return (
                  <Chip
                    key={preset}
                    label={PRESET_LABELS[preset]}
                    color={active ? "primary" : "default"}
                    onClick={() => togglePreset(preset)}
                    variant={active ? "filled" : "outlined"}
                  />
                );
              })}
            </Stack>
          </Box>

          <Divider />

          <TextField
            disabled={!enabled}
            fullWidth={true}
            label="Maximale Erinnerungen"
            type="number"
            slotProps={{ input: { inputProps: { min: 1, max: 5 } } }}
            value={local.guestConfirmationMaxResends ?? 2}
            onChange={(e) => update("guestConfirmationMaxResends", Number(e.target.value) || null)}
            helperText="Wie oft die Bestätigungsanfrage pro Gast erneut gesendet werden darf."
            sx={inputSx}
          />
        </Stack>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!dirty} onClick={handleSave} startIcon={<SaveIcon />} variant="contained">
          Save Settings
        </Button>
      </Box>
    </Stack>
  );
}
