"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { useCreateEvent } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";
import { useField } from "@/checkpoint/app/(protected)/event/new/hooks/useField";
import type { ChildEventDraft } from "@/checkpoint/app/(protected)/event/new/types/event/event-draft.type";
import { formatEnum } from "@/checkpoint/i18n/format-enum";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { formatChildEventDateRange } from "@/checkpoint/utils/date-utils";

const CATEGORY_OPTIONS = [
  "general",
  "conference",
  "music",
  "workshop",
  "social",
  "sports",
] as const;

function getCategoryIcon(category?: string) {
  switch (category) {
    case "Musik":
      return <MusicNoteRoundedIcon />;
    case "Sports":
      return <SportsSoccerRoundedIcon />;
    case "Workshop":
      return <SchoolRoundedIcon />;
    case "Social":
      return <GroupsRoundedIcon />;
    case "Konferenz":
      return <EventRoundedIcon />;
    default:
      return <EventRoundedIcon />;
  }
}

function validateChild(child: ChildEventDraft) {
  const errors: Record<string, string> = {};

  if (!child.name?.trim()) {
    errors.name = "Required";
  }

  if (child.startsAt && child.endsAt) {
    const start = new Date(child.startsAt).getTime();
    const end = new Date(child.endsAt).getTime();

    if (start >= end) {
      errors.date = "Start must be before End";
    }
  }

  if (child.maxSeats != null && child.maxSeats < 0) {
    errors.maxSeats = "Invalid";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

interface ChildEventAccordionProps {
  child: ChildEventDraft;
  index: number;
  childCount: number;
  collapsed: boolean;
  touched: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

function ChildEventAccordion({
  child,
  index,
  childCount,
  collapsed,
  touched,
  onToggle,
  onRemove,
}: ChildEventAccordionProps) {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  const name = useField(`children.${index}.name`);
  const category = useField(`children.${index}.category`);
  const maxSeats = useField(`children.${index}.maxSeats`);
  const startsAt = useField(`children.${index}.startsAt`);
  const endsAt = useField(`children.${index}.endsAt`);
  const description = useField(`children.${index}.description`);

  const expanded = !collapsed;
  const isFirst = index === 0;
  const isLast = index === childCount - 1;
  const borderRadius = isFirst ? "24px 24px 0 0" : isLast ? "0 0 24px 24px" : "0";
  const dateLabel = formatChildEventDateRange(child.startsAt, child.endsAt, "de-DE", t);
  const validation = validateChild(child);

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggle}
      disableGutters={true}
      square={false}
      sx={{
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        borderRadius: `${borderRadius} !important`,
        // overflow: "hidden",
        background: theme.palette.background.paper,
        boxShadow: "none",

        "&:before": {
          display: "none",
        },

        "&.Mui-expanded": {
          margin: 0,
          // borderRadius: "28px !important",
          my: 2,
        },

        "& .MuiAccordionSummary-root": {
          minHeight: 64,
          borderRadius: "28px",
          px: 2.5,
        },

        "& .MuiAccordionSummary-root.Mui-expanded": {
          minHeight: 64,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },

        "& .MuiAccordionSummary-content": {
          margin: 0,
        },

        "& .MuiAccordionSummary-content.Mui-expanded": {
          margin: 0,
        },

        "& .MuiAccordionDetails-root": {
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          px: 2.5,
          pb: 2.5,
          pt: 2,
          background: alpha(theme.palette.background.paper, 0.72),
        },
      }}
    >
      {/* HEADER */}
      <AccordionSummary
        expandIcon={expanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        sx={{
          alignItems: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {getCategoryIcon(child.category)}
            <Typography sx={{ fontWeight: 700 }}>{child.name || t("children.untitled")}</Typography>

            {child.maxSeats != null && child.maxSeats > 0 && (
              <>
                <Typography sx={{ fontWeight: 700 }}>•</Typography>

                <Chip size="small" label={`${child.maxSeats}`} />
              </>
            )}
            {dateLabel && (
              <>
                <Typography sx={{ fontWeight: 700 }}>•</Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {dateLabel}
                </Typography>
              </>
            )}
          </Stack>

          {/* RIGHT */}
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <DeleteRoundedIcon />
          </IconButton>
        </Stack>
      </AccordionSummary>

      {/* DETAILS */}
      <AccordionDetails>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Grid container={true} spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label={t("children.name")} fullWidth={true} {...name} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select={true}
                label={t("children.category")}
                fullWidth={true}
                {...category}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {formatEnum(t, "categorie", opt)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                type="number"
                label={t("children.maxSeats")}
                fullWidth={true}
                {...maxSeats}
              />
            </Grid>
          </Grid>

          <Grid container={true} spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container={true} spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateTimePicker
                    label="Start"
                    onChange={(val) => startsAt.onChange(val?.toISOString() ?? "")}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <DateTimePicker
                    label="End"
                    onChange={(val) => endsAt.onChange(val?.toISOString() ?? "")}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            {touched && validation.errors.date && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: theme.palette.error.main,
                }}
              >
                {validation.errors.date}
              </Typography>
            )}
          </Grid>

          <TextField
            label={t("children.description")}
            multiline={true}
            minRows={2}
            fullWidth={true}
            {...description}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default function ChildrenStep() {
  const t = useTypedTranslations("create");

  const { draft, addChild, removeChild } = useCreateEvent();

  const children = draft.children ?? [];

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [touched, _setTouched] = useState<Record<number, boolean>>({});

  const toggle = (index: number) => {
    setCollapsed((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Stack spacing={2.5}>
      {/* HEADER */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t("children.title")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setCollapsed((prev) => {
              const next = { ...prev };

              if (children.length > 0) {
                next[children.length - 1] = true;
              }

              next[children.length] = false;

              return next;
            });

            addChild();
          }}
        >
          {t("children.add")}
        </Button>
      </Stack>

      <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
        <Stack spacing={2}>
          {children.length === 0 && (
            <Typography color="text.secondary">{t("children.empty")}</Typography>
          )}

          {children.map((child, index) => (
            <ChildEventAccordion
              key={child.id}
              child={child}
              index={index}
              childCount={draft.children?.length ?? 0}
              collapsed={collapsed[index] ?? false}
              touched={Boolean(touched[index])}
              onToggle={() => toggle(index)}
              onRemove={() => removeChild(index)}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
