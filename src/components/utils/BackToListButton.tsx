"use client";

import { Box, Button, alpha, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  backTo: string
};

export default function BackToListButton({backTo}: Props) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Button
        component={Link}
        href={backTo}
        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: "14px",
          px: 2,
          py: 0.8,
          textTransform: "none",
          fontWeight: 600,
          backdropFilter: "blur(14px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.35),
          transition: "all 0.25s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            transform: "translateX(-2px)",
          },
        }}
      >
        Zurück zur Liste
      </Button>
    </motion.div>
  );
}
