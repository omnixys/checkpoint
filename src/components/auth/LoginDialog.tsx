"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Dialog, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { LoginFormCard } from "./login/LoginFormCard";
import { useLoginForm } from "./login/useLoginForm";

/**
 * Login rendered inside the intercepted `@dialog/(.)login` parallel route.
 * Shown over the current page when an authenticated GraphQL call fails with
 * a session/auth error. After a successful sign-in `router.back()` returns
 * to the page that triggered the dialog.
 */
export default function LoginDialog({
  callingCodeCountries,
}: {
  readonly callingCodeCountries: ReadonlyArray<CallingCodeCountry>;
}): JSX.Element {
  const router = useRouter();
  const theme = useTheme();
  const t = useTypedTranslations("auth");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const close = () => router.back();
  const form = useLoginForm({ onSuccess: close });

  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      onClose={close}
      maxWidth="xs"
      fullWidth={true}
      aria-labelledby="login-dialog-title"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pt: 2.5,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0 }}>
          {t("login.title")}
        </Typography>
        <IconButton onClick={close} aria-label="Close sign in">
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 3, pb: 3 }}>
        <LoginFormCard form={form} onBack={close} callingCodeCountries={callingCodeCountries} />
      </Box>
    </Dialog>
  );
}
