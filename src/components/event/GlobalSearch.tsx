"use client";

import SearchIcon from "@mui/icons-material/Search";
import { alpha, Box, Modal, Stack, TextField, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function GlobalSearch() {
  const t = useTypedTranslations("event");

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // open with CMD+K
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          boxShadow: theme.shadows[10],
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t("search.title")}
          </Typography>

          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            autoFocus={true}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                sx: { borderRadius: 3 },
              },
            }}
          />
        </Stack>
      </Box>
    </Modal>
  );
}
