"use client";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";

import TicketCard from "@/components/ticket/TicketCard";

export default function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 920,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Link
            href="/unlock"
            aria-label="Back"
            style={{ display: "flex" }}
          >
            <IconButton
              size="small"
              sx={{
                color: theme.palette.omnixys.textSecondary,
                "&:hover": {
                  color: theme.palette.omnixys.textPrimary,
                  bgcolor: "action.hover",
                },
              }}
            >
              <ArrowBackIosNewRoundedIcon fontSize="small" />
            </IconButton>
          </Link>

          <Typography
            variant="body2"
            sx={{ color: theme.palette.omnixys.textSecondary, fontWeight: 500 }}
          >
            Back
          </Typography>
        </Stack>

        {/* Title */}
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing={-0.5}
            sx={{
              color: theme.palette.omnixys.textPrimary,
            }}
          >
            My Ticket
          </Typography>
          <Typography
            sx={{ opacity: 0.65, color: theme.palette.omnixys.textSecondary }}
          >
            Your personal QR code for this event
          </Typography>
        </Box>

        {/* Ticket */}
        <TicketCard ticketId={id} />
      </Stack>
    </Box>
  );
}
