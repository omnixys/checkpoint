"use client";

import { useDevice } from "@/providers/DeviceProvider";
import {
  alpha,
  AppBar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EventsNavBar() {
  const theme = useTheme();
  const pathname = usePathname();
  const { isMobile } = useDevice();

  const NavButton = ({
    href,
    label,
    disabled,
  }: {
    href: string;
    label: string;
    disabled?: boolean;
  }) => {
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
            color: active
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            transition: "all .25s ease",
            "&:hover": {
              backgroundColor: alpha(
                theme.palette.primary.main,
                active ? 0.28 : 0.15,
              ),
            },
          }}
        >
          {label}
        </Button>
      </motion.div>
    );
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        backdropFilter: "blur(18px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        px: { xs: 1.4, sm: 2.2 },
        py: { xs: 0.5, sm: 0.8 },
        fontSize: { xs: "0.75rem", sm: "0.9rem" },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {!isMobile && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Events
            </Typography>

            <Box sx={{ flex: 1 }} />
          </>
        )}

        <Stack
          direction="row"
          spacing={isMobile ? 3 : 1.5}
          px={{ xs: 5, sm: 0 }}
        >
          <NavButton href="/checkpoint/event" label="Übersicht" />
          <NavButton href="/checkpoint/calendar" label="Kalender" />
          <NavButton href="/checkpoint/event/stats" label="Statistiken" disabled={true} />
        </Stack>
      </Stack>
    </AppBar>
  );
}
