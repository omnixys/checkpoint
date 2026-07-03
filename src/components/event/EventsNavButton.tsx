"use client";

import { alpha, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function EventsNavButton({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled?: boolean;
}) {
  const _t = useTypedTranslations("event");

  const theme = useTheme();
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        disabled={disabled}
        component={Link}
        href={href}
        sx={{
          borderRadius: "18px",
          px: { xs: 1.4, sm: 2.2 },
          py: { xs: 0.5, sm: 0.8 },
          fontSize: { xs: "0.75rem", sm: "0.9rem" },
          fontWeight: 600,
          whiteSpace: "nowrap",
          backdropFilter: "blur(16px)",
          backgroundColor: active
            ? alpha(theme.palette.primary.main, 0.18)
            : alpha(theme.palette.background.paper, 0.25),
          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          transition: "all .25s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, active ? 0.28 : 0.15),
          },
        }}
      >
        {label}
      </Button>
    </motion.div>
  );
}
