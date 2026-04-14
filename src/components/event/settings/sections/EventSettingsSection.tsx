"use client";

import { useState, useEffect } from "react";
import { Stack, TextField, Button, Switch, FormControlLabel, useTheme } from "@mui/material";
import dayjs from "dayjs";

import { SettingsPayload } from "@/checkpoint/generated/graphql";

import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import { mapSettingsPatchToInput } from "@/checkpoint/utils/event/settings.mapper";

type Props = {
  settings: SettingsPayload;
  actions: {
    updateSettings: (patch: any) => Promise<any>;
  };
};

export default function EventSettingsSection({ settings, actions }: Props) {
  const theme = useTheme();

  /**
   * Local UI state based on backend payload
   */
  const [local, setLocal] = useState<SettingsPayload>(settings);
  const [dirty, setDirty] = useState(false);

  /**
   * Sync external updates → local state
   */
  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  /**
   * Generic updater with strict typing
   */
  const update = <K extends keyof SettingsPayload>(key: K, value: SettingsPayload[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  /**
   * Persist changes via mapper
   */
  const handleSave = async () => {
    setDirty(false);

    const input = mapSettingsPatchToInput(settings, local);

    await actions.updateSettings(input);
  };

  return (
    <Stack spacing={2}>
      <FormControlLabel
        control={
          <Switch
            checked={local.allowReEntry}
            onChange={(e) => update("allowReEntry", e.target.checked)}
          />
        }
        label="Allow Re-Entry"
      />

      <FormControlLabel
        control={
          <Switch checked={local.isActive} onChange={(e) => update("isActive", e.target.checked)} />
        }
        label="Active"
      />

      <TextField
        label="Rotate Seconds"
        type="number"
        value={local.rotateSeconds}
        onChange={(e) => update("rotateSeconds", Number(e.target.value))}
        sx={glassInputSx(theme)}
      />

      <TextField
        label="Max Seats"
        type="number"
        value={local.maxSeats}
        onChange={(e) => update("maxSeats", Number(e.target.value))}
        sx={glassInputSx(theme)}
      />

      <TextField
        label="Starts At"
        type="datetime-local"
        value={local.startsAt ? dayjs(local.startsAt).format("YYYY-MM-DDTHH:mm") : ""}
        onChange={(e) => update("startsAt", new Date(e.target.value).toISOString())}
        sx={glassInputSx(theme)}
      />

      <TextField
        label="Ends At"
        type="datetime-local"
        value={local.endsAt ? dayjs(local.endsAt).format("YYYY-MM-DDTHH:mm") : ""}
        onChange={(e) => update("endsAt", new Date(e.target.value).toISOString())}
        sx={glassInputSx(theme)}
      />

      <TextField
        label="Dress Code"
        value={local.dressCode ?? ""}
        onChange={(e) => update("dressCode", e.target.value)}
        sx={glassInputSx(theme)}
      />

      <TextField
        label="Description"
        multiline
        value={local.description ?? ""}
        onChange={(e) => update("description", e.target.value)}
        sx={glassInputSx(theme)}
      />

      <Button variant="contained" disabled={!dirty} onClick={handleSave}>
        Save Settings
      </Button>
    </Stack>
  );
}
