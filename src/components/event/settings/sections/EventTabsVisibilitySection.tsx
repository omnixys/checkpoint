"use client";

import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { EventVisibleTab } from "@/checkpoint/generated/graphql";

const TAB_OPTIONS = [
  { value: EventVisibleTab.TIMELINE, label: "Timeline" },
  { value: EventVisibleTab.DETAILS, label: "Details" },
  { value: EventVisibleTab.MAP, label: "Map" },
] satisfies Array<{ value: EventVisibleTab; label: string }>;

const DEFAULT_VISIBLE_TABS = TAB_OPTIONS.map((tab) => tab.value);

interface Props {
  settings: {
    visibleTabs?: readonly EventVisibleTab[] | null;
  };
  actions: {
    updateSettings: (patch: any) => Promise<any>;
  };
}

function normalizeVisibleTabs(value?: readonly EventVisibleTab[] | null) {
  const allowed = new Set(TAB_OPTIONS.map((tab) => tab.value));
  const normalized = (value?.length ? value : DEFAULT_VISIBLE_TABS).filter((tab) =>
    allowed.has(tab),
  );

  return normalized.length > 0 ? normalized : DEFAULT_VISIBLE_TABS;
}

export default function EventTabsVisibilitySection({ settings, actions }: Props) {
  const theme = useTheme();
  const [visibleTabs, setVisibleTabs] = useState<EventVisibleTab[]>(() =>
    normalizeVisibleTabs(settings.visibleTabs),
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setVisibleTabs(normalizeVisibleTabs(settings.visibleTabs));
    setDirty(false);
  }, [settings.visibleTabs]);

  const visibleSet = useMemo(() => new Set(visibleTabs), [visibleTabs]);

  const toggleTab = (tab: EventVisibleTab) => {
    const isVisible = visibleSet.has(tab);
    const next = isVisible ? visibleTabs.filter((item) => item !== tab) : [...visibleTabs, tab];

    if (next.length === 0) {
      return;
    }

    setVisibleTabs(next);
    setDirty(true);
  };

  const handleSave = async () => {
    setDirty(false);
    await actions.updateSettings({ visibleTabs });
  };

  const panelSx = {
    p: { xs: 2, md: 2.5 },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.72)",
    boxShadow: theme.palette.mode === "dark" ? "none" : "0 10px 30px rgba(15,23,42,0.06)",
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Event Tabs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose which sections are visible on the public event page.
          </Typography>
        </Box>

        <Chip label={`${visibleTabs.length} visible`} size="small" color="primary" />
      </Stack>

      <Box sx={panelSx}>
        <Stack spacing={1}>
          {TAB_OPTIONS.map((tab) => {
            const checked = visibleSet.has(tab.value);
            const disableLastVisible = checked && visibleTabs.length === 1;

            return (
              <FormControlLabel
                key={tab.value}
                control={
                  <Checkbox
                    checked={checked}
                    disabled={disableLastVisible}
                    onChange={() => toggleTab(tab.value)}
                  />
                }
                label={tab.label}
              />
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!dirty} onClick={handleSave} startIcon={<SaveIcon />} variant="contained">
          Save Tabs
        </Button>
      </Box>
    </Stack>
  );
}
