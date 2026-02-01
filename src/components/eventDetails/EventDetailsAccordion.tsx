"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { Event } from "@/types/event/event.type";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import DescriptionIcon from "@mui/icons-material/Description";
import PlaceIcon from "@mui/icons-material/Place";

type Props = {
  ev: Event;
};

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  value: string | null | undefined;
};

function AccordionSection({ icon, title, value }: SectionProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  if (!value) return null;

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
        alignItems="center"
        onClick={() => setOpen((v) => !v)}
        sx={{
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Box sx={{ color: theme.palette.primary.main }}>{icon}</Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
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

export default function EventDetailsAccordion({ ev }: Props) {
  return (
    <Stack spacing={2}>
      <AccordionSection
        icon={<PlaceIcon />}
        title="Location"
        value={`${ev.address.street} ${ev.address.zip} ${ev.address.city} ${ev.address.country}`}
      />
      <AccordionSection
        icon={<CheckroomIcon />}
        title="Dresscode"
        value={ev.dressCode}
      />
      <AccordionSection
        icon={<DescriptionIcon />}
        title="Description"
        value={ev.description}
      />
    </Stack>
  );
}
