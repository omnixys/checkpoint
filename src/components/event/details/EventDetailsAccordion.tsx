"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface Props {
  ev: any;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

function AccordionSection({ icon, title, value }: SectionProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  if (!value) {
    return null;
  }

  return (
    <Box
      sx={{
        borderRadius: 4,
        bgcolor: alpha(theme.palette.background.paper, 0.35),
        backdropFilter: "blur(14px)",
        p: 1.5,
        px: 2,
        transition: ".25s ease",
        boxShadow: theme.shadows[2],
      }}
    >
      {/* HEADER */}
      <Stack
        direction="row"
        spacing={1.5}
        onClick={() => setOpen((v) => !v)}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          alignItems: "center",
        }}
      >
        <Box sx={{ color: theme.palette.primary.main }}>{icon}</Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ExpandMoreIcon />
        </motion.div>
      </Stack>

      {/* CONTENT */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Box sx={{ mt: 1.5, pl: 5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  whiteSpace: "pre-line",
                }}
              >
                {value}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const joinLines = (rows: Array<string | null | undefined>) => rows.filter(Boolean).join("\n");

export default function EventDetailsAccordion({ ev }: Props) {
  const t = useTypedTranslations("event");
  const settings = ev.settings;
  const enabled = t("details.enabled");
  const disabled = t("details.disabled");

  return (
    <Stack spacing={2}>
      {/* <AccordionSection
        icon={<PlaceIcon />}
        title="Location"
        value={`${ev.address.street} ${ev.address.zip} ${ev.address.city} ${ev.address.country}`}
      /> */}
      <AccordionSection
        icon={<CheckroomIcon />}
        title={t("details.dresscode")}
        value={settings.dressCode}
      />

      <AccordionSection
        icon={<DescriptionIcon />}
        title={t("details.description")}
        value={settings.description}
      />

      <AccordionSection
        icon={<CalendarMonthIcon />}
        title={t("details.schedule")}
        value={joinLines([
          `${t("details.startsAt")}: ${formatDateTime(settings.startsAt)}`,
          `${t("details.endsAt")}: ${formatDateTime(settings.endsAt)}`,
          settings.rsvpDeadline
            ? `${t("details.rsvpDeadline")}: ${formatDateTime(settings.rsvpDeadline)}`
            : null,
          settings.ticketReleaseAt
            ? `${t("details.ticketReleaseAt")}: ${formatDateTime(settings.ticketReleaseAt)}`
            : null,
        ])}
      />

      <AccordionSection
        icon={<GroupsIcon />}
        title={t("details.capacity")}
        value={joinLines([
          t("details.maxSeatsValue", { count: settings.maxSeats }),
          t("details.maxPlusOnesValue", { count: settings.maxPlusOnes }),
          t("details.guestSeatSelection", {
            value: settings.allowGuestSeatSelection ? enabled : disabled,
          }),
        ])}
      />

      <AccordionSection
        icon={<SettingsSuggestIcon />}
        title={t("details.rsvp")}
        value={joinLines([
          t("details.approvalMode", { value: settings.approvalMode }),
          t("details.publicRsvp", { value: settings.allowPublicRsvp ? enabled : disabled }),
          t("details.publicPlusOne", {
            value: settings.allowPublicPlusOne ? enabled : disabled,
          }),
        ])}
      />

      <AccordionSection
        icon={<PublicIcon />}
        title={t("details.visibility")}
        value={joinLines([
          `${t("details.category")}: ${settings.category}`,
          settings.publicRsvpWebsite
            ? t("details.publicWebsite", { value: settings.publicRsvpWebsite })
            : null,
        ])}
      />
    </Stack>
  );
}
