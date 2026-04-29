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

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { EventsFilter } from "@/checkpoint/types/event.type";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

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
  const tEvent = useTypedTranslations("event");
  const tCommon = useTypedTranslations("common");
  
  const theme = useTheme();
  const { currentUser } = useAuth();

  return (
    <Stack
      spacing={2.5}
      sx={{
        width: "100%",
        flex: 1,
      }}
    >
      {/* TITLE */}
      <Stack direction="row" spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {tEvent("header.title")}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {loading ? tCommon("loading") : tEvent("header.count", { count })}
        </Typography>
      </Stack>

      {/* TOOLBAR */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
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
            placeholder={tEvent("header.search")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            variant="outlined"
            slotProps={{
              input: {
                sx: {
                  borderRadius: "20px",
                  backdropFilter: "blur(20px)",
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      0.85,
                    ),
                  },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </motion.div>

        <Stack direction={{ xs: "row", sm: "row" }} spacing={2}>
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
              <MenuItem value="all">{tEvent("header.filter.all")}</MenuItem>
              <MenuItem value="upcoming">
                {tEvent("header.filter.upcoming")}
              </MenuItem>
              <MenuItem value="now">{tEvent("header.filter.now")}</MenuItem>
              <MenuItem value="past">{tEvent("header.filter.past")}</MenuItem>
            </TextField>
          </motion.div>

          {/* REFRESH */}
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <IconButton
              disabled={currentUser?.role !== "ADMIN"}
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
              disabled={currentUser?.role !== "ADMIN"}
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
              {tEvent("header.create")}
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </Stack>
  );
}
