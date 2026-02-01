"use client";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { JSX } from "react";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { useAuth } from "@/providers/AuthProvider";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const EVENT_ID =
  process.env.NEXT_PUBLIC_EVENT_ID || "cmk6vasuo000nh8ijz4lhyotn";
export default function HomePage(): JSX.Element {
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { activeEvent } = useActiveEvent();

  const role = activeEvent?.myRole ?? "GUEST";

  /* ------------------------------------------------------------------
   * NOT AUTHENTICATED – BRAND-FOCUSED ENTRY
   * ------------------------------------------------------------------ */
  if (!isAuthenticated) {
    return (
      <Stack
        spacing={4}
        sx={{
          px: 3,
          py: 10,
          mt: 30,
          maxWidth: 420,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: theme.palette.omnixys.textPrimary,
          }}
        >
          Checkpoint
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: theme.palette.omnixys.textSecondary }}
        >
          Premium-Einladungen, QR-Tickets und Event-Zugänge. Entwickelt für
          Fokus, Sicherheit und Eleganz.
        </Typography>

        <Stack spacing={2}>
          <Link href="/checkpoint/login">
            <Button size="large" variant="contained" fullWidth>
              Anmelden
            </Button>
          </Link>

          <Link href={`/checkpoint/rsvp?eventId=${EVENT_ID}`}>
            <Button size="large" variant="text" fullWidth>
              Einladung einlösen
            </Button>
          </Link>

          {/* UNLOCK → new feature */}
          <Link href="/checkpoint/unlock" style={{ textDecoration: "none" }}>
            <Button
              fullWidth
              variant="text"
              sx={{
                py: 1.4,
                fontSize: 15,
                color: "primary.main",
                textDecoration: "underline",
                mt: 1,
              }}
            >
              Ticket / Einladung / Token ohne Login anzeigen
            </Button>
          </Link>
        </Stack>
      </Stack>
    );
  }

  /* ------------------------------------------------------------------
   * LOGGED IN – VISIONOS-STYLE HOME
   * ------------------------------------------------------------------ */

  const primaryAction =
    // role === "SECURITY"
    //   ? {
    //       label: "Scanner starten",
    //       href: "/checkpoint/scan",
    //       icon: <QrCodeScannerIcon sx={{ fontSize: 44 }} />,
    //     }
    // :
    {
      label: "Meine Events",
      href: "/checkpoint/event",
      icon: <EventIcon sx={{ fontSize: 44 }} />,
    };

  const secondaryAction =
    role === "GUEST"
      ? {
          label: "Meine Tickets",
          href: "/checkpoint/my-qr",
          icon: <ConfirmationNumberIcon />,
        }
      : role === "SECURITY"
        ? {
            label: "Scanner starten",
            href: "/checkpoint/scan",
            icon: <QrCodeScannerIcon />,
          }
        : null;

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: 860, mx: "auto" }}>
      {/* HEADER */}
      <Stack spacing={0.5} sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            color: theme.palette.omnixys.textPrimary,
          }}
        >
          Willkommen, {user?.personalInfo.firstName}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.omnixys.textSecondary }}
        >
          {activeEvent
            ? `Aktives Event: ${activeEvent.name}`
            : "Kein aktives Event ausgewählt"}
        </Typography>
      </Stack>

      {/* PRIMARY FOCUS SURFACE */}
      <Link href={primaryAction.href} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            mb: 4,
            backgroundColor: theme.palette.apple.secondarySystemBackground,
          }}
        >
          <CardActionArea>
            <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
              {primaryAction.icon}

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.omnixys.textPrimary,
                }}
              >
                {primaryAction.label}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.omnixys.textSecondary,
                  textAlign: "center",
                  maxWidth: 360,
                }}
              >
                Zentrale Aktion für deinen aktuellen Kontext
              </Typography>
            </Stack>
          </CardActionArea>
        </Card>
      </Link>

      {/* SECONDARY ACTION – SUBTLE */}
      {secondaryAction && (
        <Link href={secondaryAction.href} style={{ textDecoration: "none" }}>
          <Card
            sx={{
              backgroundColor: theme.palette.apple.tertiarySystemBackground,
            }}
          >
            <CardActionArea>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ p: 3 }}
              >
                {secondaryAction.icon}
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.omnixys.textPrimary,
                  }}
                >
                  {secondaryAction.label}
                </Typography>
              </Stack>
            </CardActionArea>
          </Card>
        </Link>
      )}
    </Box>
  );
}
