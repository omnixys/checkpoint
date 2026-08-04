"use client";

import QrCodeIcon from "@mui/icons-material/QrCode";
import { alpha, Button, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { useParams, useRouter } from "next/navigation";

export default function ScannerQuickWidget() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useParams();

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.paper, 0.7)})`,
        backdropFilter: "blur(12px)",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <CardContent>
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
          <QrCodeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Scanner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scan QR codes for quick check-in
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push(`/scan?eventId=${id}`)}
            sx={{ borderRadius: 2 }}
          >
            Launch Scanner
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
