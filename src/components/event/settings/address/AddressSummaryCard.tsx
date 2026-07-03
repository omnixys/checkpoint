"use client";

import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

/**
 * -------------------------------------------------------------
 * Address Summary Card
 * -------------------------------------------------------------
 */
export default function AddressSummaryCard({
  address,
}: {
  address: {
    street?: string | undefined;
    houseNumber?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
  };
}) {
  const theme = useTheme();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={1}>
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {address.street} {address.houseNumber}
          </Typography>

          <Typography color="text.secondary">
            {address.postalCode} {address.city}
          </Typography>

          <Typography color="text.secondary">
            {address.state}, {address.country}
          </Typography>
        </Stack>
      </Box>
    </motion.div>
  );
}
