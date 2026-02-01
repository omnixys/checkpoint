"use client";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Button, alpha, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BackToEventDetail() {
  const theme = useTheme();
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Button
        component={Link}
        href={`/checkpoint/event/${id}`}
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
        Zurück zur Veranstaltung
      </Button>
    </motion.div>
  );
}
