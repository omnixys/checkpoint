"use client";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Box, Button, Card, CardActionArea, Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import type { JSX } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

const basePath = env.CHECKPOINT_BASE_PATH;
const EVENT_ID = env.EVENT_ID;

export default function HomePage(): JSX.Element {
  const theme = useTheme();
  const { isAuthenticated, currentUser } = useAuth();
  const { activeEvent } = useActiveEvent();
  const t = useTypedTranslations("home");

  const role = activeEvent?.myRole ?? "GUEST";

  /* ------------------------------------------------------------------
   * NOT AUTHENTICATED
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
            color: theme.palette.text.primary,
          }}
        >
          {t("brand.title")}
        </Typography>

        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          {t("brand.subtitle")}
        </Typography>

        <Stack spacing={2}>
          <Link href={`${basePath}login`}>
            <Button size="large" variant="contained" fullWidth={true}>
              {t("auth.login")}
            </Button>
          </Link>

          <Link href={`${basePath}rsvp?eventId=${EVENT_ID}`}>
            <Button size="large" variant="text" fullWidth={true}>
              {t("auth.redeem")}
            </Button>
          </Link>
        </Stack>
      </Stack>
    );
  }

  /* ------------------------------------------------------------------
   * LOGGED IN
   * ------------------------------------------------------------------ */

  const primaryAction = {
    label: t("actions.events"),
    href: `${basePath}event`,
    icon: <EventIcon sx={{ fontSize: 44 }} />,
  };

  const secondaryAction =
    role === "GUEST"
      ? {
          label: t("actions.tickets"),
          href: `${basePath}me/my-qr`,
          icon: <ConfirmationNumberIcon />,
        }
      : role === "SECURITY"
        ? {
            label: t("actions.scan"),
            href: `${basePath}scan`,
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
            color: theme.palette.text.primary,
          }}
        >
          {t("header.welcome", {
            name: currentUser?.personalInfo?.firstName ?? "",
          })}
        </Typography>

        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {activeEvent ? t("header.activeEvent", { event: activeEvent.name }) : t("header.noEvent")}
        </Typography>
      </Stack>

      {/* PRIMARY */}
      <Link href={primaryAction.href} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            mb: 4,
            backgroundColor: theme.palette.apple.secondarySystemBackground,
          }}
        >
          <CardActionArea>
            <Stack spacing={2} sx={{ p: 4 }}>
              {primaryAction.icon}

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {primaryAction.label}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  maxWidth: 360,
                }}
              >
                {t("actions.primaryDescription")}
              </Typography>
            </Stack>
          </CardActionArea>
        </Card>
      </Link>

      {/* SECONDARY */}
      {secondaryAction && (
        <Link href={secondaryAction.href} style={{ textDecoration: "none" }}>
          <Card
            sx={{
              backgroundColor: theme.palette.apple.tertiarySystemBackground,
            }}
          >
            <CardActionArea>
              <Stack direction="row" spacing={2} sx={{ p: 3 }}>
                {secondaryAction.icon}
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
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
