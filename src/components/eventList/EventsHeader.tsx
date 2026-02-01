"use client";

import {
  alpha,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import type { EventsFilter } from "@/types/event/event.type";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  filter: EventsFilter;
  onFilterChange: (v: EventsFilter) => void;

  count: number;
  loading: boolean;

  onRefresh: () => void;
  onCreateHref: string;
};

export default function EventsHeader({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  count,
  loading,
  onRefresh,
  onCreateHref,
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      spacing={2.5}
      sx={{
        width: "100%",
        flex: 1,
      }}
    >
      {/* TITLE */}
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Events
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {loading ? "lädt…" : `${count} gefunden`}
        </Typography>
      </Stack>

      {/* TOOLBAR */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="stretch"
        sx={{ width: "100%" }}
      >
        {/* Apple-like Glass Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ flex: 1 }}
        >
          <TextField
            fullWidth
            placeholder="Suchen…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: "20px",
                backdropFilter: "blur(20px)",
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 0.85),
                },
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <Stack
          direction={{ xs: "row", sm: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          {/* FILTER SELECT */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <TextField
              select
              size="small"
              value={filter}
              onChange={(e) => onFilterChange(e.target.value as EventsFilter)}
              sx={{
                minWidth: 150,
                borderRadius: "20px",
              }}
            >
              <MenuItem value="all">Alle Events</MenuItem>
              <MenuItem value="upcoming">Kommende</MenuItem>
              <MenuItem value="now">Laufende</MenuItem>
              <MenuItem value="past">Vergangene</MenuItem>
            </TextField>
          </motion.div>

          {/* REFRESH */}
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <IconButton
              disabled={true}
              onClick={onRefresh}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.action.hover, 0.8),
                backdropFilter: "blur(12px)",
              }}
            >
              <RefreshIcon />
            </IconButton>
          </motion.div>

          {/* NEW EVENT */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Button
              disabled={true}
              component={Link}
              href={onCreateHref}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "20px",
                px: 3,
                height: 44,
                fontWeight: 600,
              }}
            >
              Neu
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </Stack>
  );
}
