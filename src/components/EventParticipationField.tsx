"use client";

import { alpha, Box, Card, Checkbox, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import type { EventSelectionNode } from "@/checkpoint/hooks/events/useEventSelection";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type Props = {
  rootEventId: string;
  rootEventName: string;
  events: EventSelectionNode[];
  isRootSelected: boolean;
  isChildSelected: (childId: string) => boolean;
  onToggleRoot: () => void;
  onToggleChild: (childId: string) => void;
};

type SelectionCardProps = {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onChange: () => void;
  subtitle: string;
};

function SelectionCard({
  checked,
  indeterminate = false,
  label,
  onChange,
  subtitle,
}: SelectionCardProps) {
  const theme = useTheme();

  return (
    <Card
      component="label"
      elevation={0}
      sx={{
        background: checked
          ? `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.background.paper, 0.76)})`
          : alpha(theme.palette.background.paper, 0.5),
        border: "1px solid",
        borderColor: checked
          ? alpha(theme.palette.primary.main, 0.72)
          : alpha(theme.palette.text.primary, 0.1),
        borderRadius: 3,
        cursor: "pointer",
        display: "block",
        minHeight: 150,
        p: 2.5,
        transition:
          "border-color 240ms ease, background-color 240ms ease, transform 240ms ease, box-shadow 240ms ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.58),
          boxShadow: `0 20px 46px ${alpha(theme.palette.primary.main, 0.12)}`,
          transform: "translateY(-3px)",
        },
        "&:focus-within": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 3,
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
        },
      }}
    >
      <Stack spacing={2} sx={{ height: "100%", justifyContent: "space-between" }}>
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={onChange}
          slotProps={{ input: { "aria-label": label } }}
          sx={{
            alignSelf: "flex-end",
            color: alpha(theme.palette.primary.main, 0.6),
            m: -1,
          }}
        />

        <Stack spacing={0.75}>
          <Typography
            sx={{
              fontFamily: "var(--font-wedding-serif), Georgia, serif",
              fontSize: { xs: "1.25rem", md: "1.45rem" },
              lineHeight: 1.2,
              overflowWrap: "anywhere",
            }}
          >
            {label}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.6 }}>
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default function EventParticipationField({
  rootEventName,
  events,
  isRootSelected,
  isChildSelected,
  onToggleRoot,
  onToggleChild,
}: Props) {
  const t = useTypedTranslations("rsvp");

  const selectedChildren = useMemo(
    () => events.filter((event) => isChildSelected(event.id)),
    [events, isChildSelected],
  );
  const selectedCount = selectedChildren.length;
  const allSelected = selectedCount === events.length && events.length > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < events.length;

  if (events.length === 0) {
    return (
      <Box
        aria-label={t("public.participation")}
        component="fieldset"
        sx={{ border: 0, m: 0, p: 0 }}
      >
        <SelectionCard
          checked={isRootSelected}
          label={rootEventName}
          onChange={onToggleRoot}
          subtitle={t("public.singleEventDescription")}
        />
      </Box>
    );
  }

  return (
    <Stack
      aria-label={t("public.participation")}
      component="fieldset"
      spacing={2.5}
      sx={{ border: 0, m: 0, p: 0 }}
    >
      <Box
        aria-live="polite"
        sx={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography color="text.secondary" variant="body2">
          {t("public.selectionLabel")}
        </Typography>
        {isRootSelected ? (
          <Chip color="primary" label={t("public.allEvents")} size="small" />
        ) : selectedChildren.length > 0 ? (
          selectedChildren.map((child) => <Chip key={child.id} label={child.name} size="small" />)
        ) : (
          <Chip label={t("public.noSelection")} size="small" variant="outlined" />
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        <SelectionCard
          checked={isRootSelected || allSelected}
          indeterminate={isIndeterminate}
          label={t("public.rootWithAll", { name: rootEventName })}
          onChange={onToggleRoot}
          subtitle={t("public.allEventsDescription")}
        />

        {events.map((event) => (
          <SelectionCard
            checked={isChildSelected(event.id)}
            key={event.id}
            label={event.name}
            onChange={() => onToggleChild(event.id)}
            subtitle={t("public.singleEventDescription")}
          />
        ))}
      </Box>
    </Stack>
  );
}
