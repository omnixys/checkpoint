"use client";

import BlockIcon from "@mui/icons-material/Block";
import { alpha, Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { env } from "@/checkpoint/lib/env";

interface Props {
  message?: string;
}

export default function ForbiddenPage({ message }: Props) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          p: 4,
          borderRadius: 24,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <BlockIcon sx={{ fontSize: 48, color: theme.palette.error.main }} />

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Zugriff verweigert
        </Typography>

        <Typography color="text.secondary">
          {message ?? "Du hast keine Berechtigung für diesen Bereich."}
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push(env.CHECKPOINT_BASE_PATH || "/")}
          sx={{ borderRadius: 2 }}
        >
          Zur Startseite
        </Button>
      </Stack>
    </Box>
  );
}
