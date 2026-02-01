"use client";

import BackToEventDetail from "@/components/invitationList/button/BackToEventDetail";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import { alpha, Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  total: number;
  onCreate: () => void;
  onFilter: () => void;
};

export default function TicketHeader({ total, onCreate, onFilter }: Props) {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        px: 3,
        py: 2.2,
        mb: 3,
        borderRadius: 4,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        {/* Back Button */}
        <BackToEventDetail />
        <Stack>
          <Typography variant="h5" fontWeight={600}>
            Tickets verwalten
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {total} Tickets
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.4}>
          <Button
            variant="outlined"
            startIcon={<FilterListRoundedIcon />}
            onClick={onFilter}
          >
            Filter
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={onCreate}
            sx={{ fontWeight: 600 }}
          >
            Ticket erstellen
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
