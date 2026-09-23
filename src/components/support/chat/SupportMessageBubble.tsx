"use client";

import { RefreshOutlined } from "@mui/icons-material";
import {
  alpha,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import type { Message } from "@/checkpoint/generated/graphql";
import type { PendingMessage } from "@/checkpoint/hooks/support/useSupportChat";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type SupportMessage = Message;

interface SupportMessageBubbleProps {
  message: SupportMessage;
  isLatest: boolean;
  currentUserId?: string | undefined;
}

export function SupportMessageBubble({
  message,
  isLatest,
  currentUserId,
}: SupportMessageBubbleProps) {
  const theme = useTheme();
  const isGuest = currentUserId ? message.senderId === currentUserId : false;

  return (
    <Box
      sx={{
        alignSelf: isGuest ? "flex-end" : "flex-start",
        maxWidth: { xs: "82%", sm: "78%" },
        width: "fit-content",
      }}
    >
      <motion.div
        initial={isLatest ? { opacity: 0, y: 8, scale: 0.96 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            background: isGuest
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette.background.paper, 0.6),
            border: "1px solid",
            borderColor: isGuest
              ? alpha(theme.palette.primary.main, 0.18)
              : alpha(theme.palette.divider, 0.12),
            borderRadius: isGuest ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            px: 2.5,
            py: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {message.body}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              display: "block",
              fontSize: "0.65rem",
              mt: 0.5,
              textAlign: isGuest ? "right" : "left",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}

interface PendingSupportMessageBubbleProps {
  pending: PendingMessage;
  onRetry?: (pending: PendingMessage) => Promise<void>;
}

export function PendingSupportMessageBubble({
  pending,
  onRetry,
}: PendingSupportMessageBubbleProps) {
  const theme = useTheme();
  const t = useTypedTranslations("support");
  const isFailed = pending.status === "failed";

  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        maxWidth: { xs: "82%", sm: "78%" },
        width: "fit-content",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Paper
          elevation={0}
          sx={{
            background: isFailed
              ? alpha(theme.palette.error.main, 0.08)
              : alpha(theme.palette.primary.main, 0.08),
            border: "1px solid",
            borderColor: isFailed
              ? alpha(theme.palette.error.main, 0.18)
              : alpha(theme.palette.primary.main, 0.12),
            borderRadius: "18px 18px 4px 18px",
            px: 2.5,
            py: 1.5,
            opacity: pending.status === "sending" ? 0.7 : 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {pending.body}
          </Typography>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              gap: 0.5,
              justifyContent: "flex-end",
              mt: 0.5,
            }}
          >
            {pending.status === "sending" && (
              <CircularProgress size={10} sx={{ color: "text.disabled" }} />
            )}
            {isFailed && onRetry && (
              <Tooltip title={t("retry")}>
                <IconButton
                  aria-label={t("retry")}
                  onClick={() => onRetry(pending)}
                  size="small"
                  sx={{ color: "error.main", p: 0, mr: 0.5 }}
                >
                  <RefreshOutlined sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
            )}
            <Typography
              variant="caption"
              sx={{
                color: isFailed ? "error.main" : "text.disabled",
                fontSize: "0.65rem",
              }}
            >
              {isFailed ? t("sendFailed") : t("sending")}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
