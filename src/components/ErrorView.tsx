"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ErrorViewProps {
  title: string;
  message?: ReactNode;
  actions?: Array<{
    href: string;
    label: string;
    variant?: "contained" | "outlined";
  }>;
  chips?: string[];
}

export default function ErrorView({ title, message, actions, chips }: ErrorViewProps) {
  const visibleActions = actions ?? [];
  const visibleChips = chips ?? [];

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 640, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>
            {message && (
              <Typography variant="body1" color="text.secondary">
                {message}
              </Typography>
            )}
            {visibleChips.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                useFlexGap={true}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                {visibleChips.map((c) => (
                  <Chip key={c} label={c} size="small" />
                ))}
              </Stack>
            )}
            {visibleActions.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                {visibleActions.map(({ href, label, variant = "contained" }) => (
                  <Button key={href + label} component={Link} href={href} variant={variant}>
                    {label}
                  </Button>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
