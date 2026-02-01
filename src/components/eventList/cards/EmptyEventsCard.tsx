"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EventIcon from "@mui/icons-material/Event";
import { Button, Card, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function EmptyEventsCard() {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        textAlign: "center",
        p: { xs: 3, sm: 4 },
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <EventIcon sx={{ fontSize: 48, color: "primary.main" }} />

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Noch keine Events
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Lege dein erstes Event an und verschicke Einladungen.
        </Typography>

        <Button
          component={Link}
          disabled={true}
          href="/checkpoint/event/new"
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{ borderRadius: 3, mt: 1 }}
        >
          Event erstellen
        </Button>
      </Stack>
    </Card>
  );
}
