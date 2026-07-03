import { Box, Stack, Typography } from "@mui/material";
import { BackButtonBase } from "@/checkpoint/components/utils/back-button-base";
import { env } from "@/checkpoint/lib/env";

interface Props {
  eventName: string;
  eventId: string;
}

export default function NoTicket({ eventId, eventName }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
          px: { xs: 2.5, sm: 5 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Box
          aria-hidden={true}
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "text.secondary",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          QR
        </Box>

        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Kein Ticket für dieses Event
          </Typography>
          <Typography sx={{ color: "text.secondary", maxWidth: 460 }}>
            Für {eventName} ist aktuell kein persönliches Ticket mit QR-Code hinterlegt.
          </Typography>
        </Stack>

        <BackButtonBase
          href={`${env.CHECKPOINT_BASE_PATH}event/${eventId}`}
          label="Zurück zum Event"
        />
      </Stack>
    </Box>
  );
}
