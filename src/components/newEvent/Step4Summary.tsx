"use client";

import React from "react";
import { Stack, Typography, Divider, Button, Box, Alert } from "@mui/material";

import dayjs from "dayjs";
import { AppleCardGlass } from "./EventSteps.style";

/* -------------------------------------------------------
 * Helper: Dauer formatieren
 * ------------------------------------------------------- */
function formatDuration(startIso: string, endIso: string): string {
  if (!startIso || !endIso) return "-";

  const start = dayjs(startIso);
  const end = dayjs(endIso);
  let minutes = end.diff(start, "minute");

  if (minutes <= 0) return "0m";

  const years = Math.floor(minutes / (60 * 24 * 365));
  minutes -= years * 60 * 24 * 365;

  const months = Math.floor(minutes / (60 * 24 * 30));
  minutes -= months * 60 * 24 * 30;

  const weeks = Math.floor(minutes / (60 * 24 * 7));
  minutes -= weeks * 60 * 24 * 7;

  const days = Math.floor(minutes / (60 * 24));
  minutes -= days * 60 * 24;

  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;

  const parts: string[] = [];

  if (years > 0) parts.push(`${years}J`);
  if (months > 0) parts.push(`${months}M`);
  if (weeks > 0) parts.push(`${weeks}w`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ");
}


export default function Step4Summary({ form, onBack, onFinish, loading }) {
  const duration = formatDuration(form.startsAt, form.endsAt);

  return (
    <AppleCardGlass>
      <Stack spacing={3}>
        <Typography variant="h6" textAlign="center" fontWeight={700}>
          Schritt 4 – Zusammenfassung
        </Typography>

        <Typography textAlign="center" sx={{ opacity: 0.7 }}>
          Prüfe deine Eingaben, bevor das Event erstellt wird.
        </Typography>

        <Divider />

        {/* BASISDATEN */}
        <Section title="Basisdaten">
          <Row label="Name" value={form.name} />
          <Row label="Max Seats" value={form.maxSeats} />
          <Row
            label="Wiedereinlass"
            value={form.allowReEntry ? "Ja" : "Nein"}
          />
          <Row label="Location" value={form.location || "-"} />
          <Row label="Beschreibung" value={form.description || "-"} />
        </Section>

        <Divider />

        {/* ZEITRAUM */}
        <Section title="Zeitraum">
          <Row
            label="Start"
            value={
              form.startsAt
                ? dayjs(form.startsAt).format("DD.MM.YYYY HH:mm")
                : "-"
            }
          />
          <Row
            label="Ende"
            value={
              form.endsAt ? dayjs(form.endsAt).format("DD.MM.YYYY HH:mm") : "-"
            }
          />
          <Row label="Dauer" value={duration} />
        </Section>

        <Divider />

        {/* ADVANCED */}
        <Section title="Advanced">
          <Row label="Dresscode" value={form.dressCode || "-"} />
          <Row label="Standard Sektion" value={form.defaultSection} />
          <Row label="Standard Tisch" value={form.defaultTable} />
          <Row label="QR Rotation" value={`${form.rotateSeconds}s`} />
        </Section>

        <Divider />

        {/* ---------------------------------------------- */}
        {/* TIPS – wie in EventAdvancedFields (Alerts)      */}
        {/* ---------------------------------------------- */}

        {form.allowReEntry && (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <strong>Re-Entry aktiv.</strong>
            <br />
            Gäste können mehrfach rein und raus.
          </Alert>
        )}

        {form.rotateSeconds > 60 && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Eine QR-Rotation von <strong>{form.rotateSeconds}s</strong> ist eher
            unsicher.
          </Alert>
        )}

        {/* <Alert severity="info" sx={{ borderRadius: 2 }}>
          Weitere Einstellungen findest du später im Event-Menü.
        </Alert> */}

        {/* Buttons */}
        <Stack direction="row" justifyContent="space-between" mt={1}>
          <Button onClick={onBack}>Zurück</Button>

          <Button
            variant="contained"
            sx={{ borderRadius: 3 }}
            disabled={loading}
            onClick={onFinish}
          >
            Event erstellen
          </Button>
        </Stack>
      </Stack>
    </AppleCardGlass>
  );
}

/* -------------------------------------------------------
 * Section Wrapper
 * ------------------------------------------------------- */
function Section({ title, children }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700}>
        {title}
      </Typography>

      <Stack spacing={0.5} mt={1}>
        {children}
      </Stack>
    </Box>
  );
}

/* -------------------------------------------------------
 * Row – für schöne 2-Spalten Darstellung
 * ------------------------------------------------------- */
function Row({ label, value }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <Typography sx={{ opacity: 0.65 }}>{label}</Typography>

      <Typography fontWeight={600}>{String(value)}</Typography>
    </Stack>
  );
}
