"use client";

import { Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { env } from "@/checkpoint/lib/env";

const CHECKPOINT_BASE_PATH = env.CHECKPOINT_BASE_PATH;

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Stack
          spacing={4}
          sx={{
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            Checkpoint
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Einlass einfach & sicher: Einladungen, QR‑Tickets und Live‑Status. Mobile‑first im
            Apple‑Look.
          </Typography>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: "100%" }}>
            <Stack spacing={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                }}
              >
                Ich bin eingeladen
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  href={`${CHECKPOINT_BASE_PATH}rsvp`}
                  size="large"
                  fullWidth={true}
                  variant="contained"
                >
                  Einladung öffnen (RSVP)
                </Button>
                <Button
                  component={Link}
                  href={`${CHECKPOINT_BASE_PATH}me/my-qr`}
                  size="large"
                  fullWidth={true}
                  variant="outlined"
                >
                  Mein QR‑Ticket
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, borderRadius: 3, width: "100%" }}>
            <Stack spacing={2}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                }}
              >
                Login
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component={Link}
                  href={`${CHECKPOINT_BASE_PATH}login`}
                  size="large"
                  fullWidth={true}
                  variant="contained"
                >
                  Login (Admin / Security)
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Divider flexItem={true} />

          <Stack
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Schnelleinstieg für Team
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button component={Link} href={`${CHECKPOINT_BASE_PATH}scan`} variant="text">
                Zur Scanner‑Ansicht
              </Button>
              <Button component={Link} href={`${CHECKPOINT_BASE_PATH}security`} variant="text">
                Security‑Dashboard
              </Button>
              <Button component={Link} href={`${CHECKPOINT_BASE_PATH}nvitations`} variant="text">
                Einladungen
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
