"use client";

import { ArrowDownward, Chat, Send as SendIcon } from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/checkpoint/generated/graphql";
import type { PendingMessage } from "@/checkpoint/hooks/support/useSupportChat";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { PendingSupportMessageBubble, SupportMessageBubble } from "./SupportMessageBubble";

type SupportMessage = Message;

interface SupportChatPanelProps {
  messages: SupportMessage[];
  pendingMessages?: PendingMessage[] | undefined;
  latestMessage: SupportMessage | null;
  onSend: (body: string) => Promise<void>;
  onRetry?: ((pending: PendingMessage) => Promise<void>) | undefined;
  sending: boolean;
  isCreating?: boolean | undefined;
  currentUserId?: string | undefined;
  messagesLoading?: boolean | undefined;
  composerSize?: "compact" | "large" | undefined;
  applySafeAreaPadding?: boolean | undefined;
}

function EmptyState() {
  const t = useTypedTranslations("support");

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Avatar
        sx={{
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
          color: "primary.main",
          height: 56,
          width: 56,
        }}
      >
        <Chat sx={{ fontSize: 28 }} />
      </Avatar>
      <Typography
        sx={{
          color: "text.primary",
          fontSize: "0.95rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {t("emptyTitle")}
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "0.8rem",
          lineHeight: 1.6,
          maxWidth: 260,
          textAlign: "center",
        }}
      >
        {t("emptyDescription")}
      </Typography>
    </Box>
  );
}

function Composer({
  input,
  onInput,
  onKeyDown,
  onSend,
  sending,
  isCreating,
  size,
  applySafeAreaPadding,
}: {
  input: string;
  onInput: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  sending: boolean;
  isCreating: boolean;
  size: "compact" | "large";
  applySafeAreaPadding: boolean;
}) {
  const theme = useTheme();
  const t = useTypedTranslations("support");
  const canSend = Boolean(input.trim()) && !sending && !isCreating;
  const placeholder = isCreating ? t("startingConversation") : t("composerPlaceholder");

  return (
    <Box
      sx={{
        bgcolor: size === "large" ? "background.paper" : "transparent",
        borderTop: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.08),
        display: "flex",
        flexShrink: 0,
        gap: size === "compact" ? 1 : 1.5,
        minWidth: 0,
        p: size === "compact" ? 1.5 : { xs: 1.5, sm: 2 },
        ...(applySafeAreaPadding
          ? { paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }
          : {}),
      }}
    >
      {size === "large" ? (
        <Box
          sx={{
            alignItems: "center",
            bgcolor: alpha(theme.palette.action.hover, 0.25),
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.14),
            borderRadius: theme.shape.borderRadius,
            display: "flex",
            flex: 1,
            minHeight: 48,
            px: 1.75,
          }}
        >
          <InputBase
            aria-label={t("composerPlaceholder")}
            disabled={sending || isCreating}
            fullWidth
            maxRows={4}
            multiline
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            value={input}
            // iOS Safari zooms a focused input below 16px. Keep the composer
            // at the platform body size on phones without disabling user zoom.
            sx={{ fontSize: { xs: "1rem", sm: "0.95rem" }, py: 1.25 }}
          />
        </Box>
      ) : (
        <InputBase
          aria-label={t("composerPlaceholder")}
          disabled={sending || isCreating}
          fullWidth
          maxRows={4}
          multiline
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          value={input}
          sx={{
            bgcolor: alpha(theme.palette.action.hover, 0.3),
            borderRadius: 2,
            flex: 1,
            // See the large composer: 16px prevents iOS focus zoom.
            fontSize: { xs: "1rem", sm: "0.85rem" },
            px: 1.5,
            py: 1,
          }}
        />
      )}
      <IconButton
        aria-label={t("send")}
        color="primary"
        disabled={!canSend}
        onClick={onSend}
        size={size === "large" ? "medium" : "small"}
        sx={{
          alignSelf: "flex-end",
          ...(size === "large"
            ? {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                height: 48,
                width: 48,
              }
            : {
                minHeight: 48,
                minWidth: 48,
              }),
        }}
      >
        {isCreating ? (
          <CircularProgress size={size === "large" ? 20 : 18} />
        ) : (
          <SendIcon sx={{ fontSize: size === "large" ? 20 : 18 }} />
        )}
      </IconButton>
    </Box>
  );
}

export function SupportChatPanel({
  messages,
  pendingMessages = [],
  latestMessage,
  onSend,
  onRetry,
  sending,
  isCreating = false,
  currentUserId,
  messagesLoading = false,
  composerSize = "compact",
  applySafeAreaPadding = false,
}: SupportChatPanelProps) {
  const theme = useTheme();
  const t = useTypedTranslations("support");
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback(
    (force = false) => {
      if (!listRef.current) return;
      if (!autoScroll && !force) return;
      if (typeof listRef.current.scrollTo !== "function") return;
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    },
    [autoScroll],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on any message change
  useEffect(() => {
    scrollToBottom();
  }, [messages, latestMessage, pendingMessages, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setAutoScroll(nearBottom);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending || isCreating) return;
    const body = input;
    setInput("");
    await onSend(body);
    setAutoScroll(true);
  }, [input, sending, isCreating, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const showEmpty = messages.length === 0 && pendingMessages.length === 0;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box
        ref={listRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          position: "relative",
          px: composerSize === "compact" ? 2 : { xs: 2, sm: 3 },
          py: 1.5,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.text.primary, 0.08),
            borderRadius: 4,
          },
        }}
      >
        {messagesLoading ? (
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress size={20} />
          </Box>
        ) : showEmpty ? (
          <EmptyState />
        ) : (
          <Stack spacing={1.5}>
            {messages.map((msg, i) => (
              <SupportMessageBubble
                key={msg.id}
                message={msg}
                isLatest={latestMessage?.id === msg.id || i === messages.length - 1}
                currentUserId={currentUserId}
              />
            ))}
            {latestMessage && !messages.find((m) => m.id === latestMessage.id) && (
              <SupportMessageBubble
                message={latestMessage}
                isLatest
                currentUserId={currentUserId}
              />
            )}
            {pendingMessages.map((pending) => (
              <PendingSupportMessageBubble
                key={pending.id}
                pending={pending}
                {...(onRetry ? { onRetry } : {})}
              />
            ))}
          </Stack>
        )}

        {!autoScroll && messages.length > 0 && (
          <IconButton
            aria-label={t("scrollToBottom")}
            onClick={() => scrollToBottom(true)}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              bottom: 12,
              color: "primary.main",
              position: "absolute",
              right: 16,
              zIndex: 1,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.16) },
            }}
          >
            <ArrowDownward sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>

      <Composer
        applySafeAreaPadding={applySafeAreaPadding}
        input={input}
        isCreating={isCreating}
        onInput={setInput}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        sending={sending}
        size={composerSize}
      />
    </Box>
  );
}
