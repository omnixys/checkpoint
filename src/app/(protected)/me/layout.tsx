import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Box, Stack } from "@mui/material";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = buildMetadata({
  title: "My Account",
  description: "Manage your personal account information.",

  page: "me",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function MeLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 4,
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          backdropFilter: "blur(20px)",
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
