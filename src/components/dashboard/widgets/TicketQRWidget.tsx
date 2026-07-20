"use client";

import QrCodeIcon from "@mui/icons-material/QrCode";
import { alpha, Button, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

export default function TicketQRWidget() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent>
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
          <QrCodeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>My Ticket</Typography>
          <Typography variant="body2" color="text.secondary">
            Show your QR code for event check-in
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/me/my-qr")}
            sx={{ borderRadius: 2 }}
          >
            View Ticket
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
