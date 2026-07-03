"use client";

import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface Props {
  title: string;
  text: string;
  icon: string;
}

export default function OnboardingSlide({ title, text, icon }: Props) {
  return (
    <Stack
      spacing={3}
      sx={{
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            fontSize: 64,
            lineHeight: 1,
          }}
        >
          {icon}
        </Box>
      </motion.div>

      {/* Text */}
      <Stack spacing={1}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </Stack>
    </Stack>
  );
}
