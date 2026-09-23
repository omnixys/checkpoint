"use client";

import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { alpha, Box, IconButton, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { Message } from "@/checkpoint/generated/graphql";
import { useRealtimeStatus } from "@/checkpoint/hooks/support/useRealtimeStatus";
import type { PendingMessage } from "@/checkpoint/hooks/support/useSupportChat";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { RealtimeStatus } from "@/checkpoint/lib/apollo/ws-link";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import { SupportChatPanel } from "./SupportChatPanel";

type SupportMessage = Message;

// Mobile height ownership: AppShell.mobile renders a scrollable content Box with
// baked-in header (56px) and bottom-nav (76px) padding, so it cannot pass its
// available height to a flex child cleanly. /me/support therefore owns the height
// with the viewport calc as a local fallback and uses flex for every inner region.
const MOBILE_SHELL_HEADER_HEIGHT = 56;
const MOBILE_SHELL_NAV_HEIGHT = 76;

interface SupportChatPageProps {
  messages: SupportMessage[];
  pendingMessages?: PendingMessage[] | undefined;
  latestMessage: SupportMessage | null;
  onSend: (body: string) => Promise<void>;
  onRetry?: ((pending: PendingMessage) => Promise<void>) | undefined;
  sending: boolean;
  isCreating?: boolean | undefined;
  currentUserId?: string | undefined;
  messagesLoading?: boolean | undefined;
}

const STATUS_KEY: Record<
  RealtimeStatus,
  | "status.connected"
  | "status.connecting"
  | "status.reconnecting"
  | "status.authentication_failed"
  | "status.offline"
> = {
  connected: "status.connected",
  connecting: "status.connecting",
  reconnecting: "status.reconnecting",
  authentication_failed: "status.authentication_failed",
  offline: "status.offline",
};

function SupportChatHeader({ onBack }: { onBack: () => void }) {
  const theme = useTheme();
  const t = useTypedTranslations("support");
  const realtimeStatus = useRealtimeStatus();

  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        borderBottom: "1px solid",
        borderColor: theme.palette.extended.border.subtle,
        display: "flex",
        gap: 1,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 1, sm: 1.25 },
      }}
    >
      <motion.div whileTap={{ scale: 0.9 }}>
        <IconButton aria-label={t("back")} onClick={onBack} size="medium">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </motion.div>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.125rem" },
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {t("title")}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            lineHeight: 1.4,
          }}
        >
          {t("headline")} · {t(STATUS_KEY[realtimeStatus])}
        </Typography>
      </Box>
    </Box>
  );
}

export function SupportChatPage(props: SupportChatPageProps) {
  const theme = useTheme();
  const router = useRouter();
  const { isMobile } = useDevice();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/me");
    }
  }, [router]);

  if (isMobile) {
    return (
      <Box
        data-testid="support-chat-page"
        sx={{
          // Full-bleed under the shared /me layout: /me/support keeps the
          // exact shell paddings here instead of opting the shared /me layout
          // into a mode that would affect the other /me pages. Values match
          // AppShell.mobile (px 1.5/2) + me/layout (px 1.5/2, py 2/4):
          // xs => 12+12 per side, sm => 16+16 per side. The /me Stack resets
          // margins on its direct children, so this box (a child of the
          // page.tsx wrapper, not of the Stack) owns the negative margins and
          // widens by both cancelled insets to span the full viewport.
          height: `calc(100dvh - ${MOBILE_SHELL_HEADER_HEIGHT}px - ${MOBILE_SHELL_NAV_HEIGHT}px - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          mx: { xs: -3, sm: -4 },
          my: { xs: -2, sm: -4 },
          width: { xs: "calc(100% + 48px)", sm: "calc(100% + 64px)" },
        }}
      >
        <Box
          component="section"
          data-testid="support-chat-section"
          sx={{
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            maxWidth: "none",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <SupportChatHeader onBack={handleBack} />
          <SupportChatPanel applySafeAreaPadding composerSize="large" {...props} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      data-testid="support-chat-page"
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100dvh - 64px)",
        width: "100%",
      }}
    >
      <Box
        component="section"
        data-testid="support-chat-section"
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: theme.palette.extended.border.subtle,
          // MUI 9 treats numeric borderRadius as a multiple of
          // theme.shape.borderRadius (16 => 256px); stringify the token so the
          // card keeps DESIGN.md's 16px base radius.
          borderRadius: `${theme.shape.borderRadius}px`,
          boxShadow: theme.shadows[2],
          display: "flex",
          flexDirection: "column",
          height: "min(720px, calc(100dvh - 96px))",
          maxWidth: 900,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <SupportChatHeader onBack={handleBack} />
        <SupportChatPanel composerSize="large" {...props} />
      </Box>
    </Box>
  );
}
