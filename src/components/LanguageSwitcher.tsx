"use client";

import {
  Menu,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Button,
  Box,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import React from "react";
import { Locale } from "@/checkpoint/i18n/request";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "en-US", label: "English", flag: "🇬🇧" },
];
export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    // biome-ignore lint/suspicious/noDocumentCookie: egal
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    handleClose();
    router.refresh();
  };

  return (
    <Box sx={{}}>
      <Stack
        direction="row"
        spacing={1}
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          alignItems: "center",
        }}
      >
        <Button>
          <Typography
            sx={{
              letterSpacing: "0.05em",
              fontWeight: 600,
              fontSize: 14,
              border: `2px solid ${alpha(theme.palette.primary.main, 1)}`,
              borderRadius: 2,
              px: 2,
            }}
          >
            {locale.slice(0, 2).toUpperCase()}
          </Typography>
        </Button>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,

              borderRadius: 3,

              backdropFilter: "blur(20px)",
              background: alpha(theme.palette.primary.main, 0.5),

              border: "1px solid rgba(212,175,55,0.35)",

              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",

              overflow: "hidden",
            },
          },
        }}
      >
        {LOCALES.map((l) => (
          <MenuItem key={l.code} onClick={() => switchLocale(l.code)}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                color={alpha(theme.palette.secondary.main, 1)}
                sx={{
                  fontSize: 14,
                }}
              >
                {l.flag} {l.label}
              </Typography>
              {locale === l.code && <LanguageIcon fontSize="small" />}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
