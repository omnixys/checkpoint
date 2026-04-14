"use client";

import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { useRouter } from "next/navigation";
import BlockIcon from "@mui/icons-material/Block";

export default function ForbiddenPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
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
        }}
      >
        <BlockIcon sx={{ fontSize: 48, color: theme.palette.error.main }} />

        <Typography variant="h5">Zugriff verweigert</Typography>

        <Typography color="text.secondary">Du hast keine Berechtigung für diese Aktion.</Typography>

        <Button variant="contained" onClick={() => router.push("/")}>
          Zur Startseite
        </Button>
      </Stack>
    </Box>
  );
}
