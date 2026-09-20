"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import {
  Avatar,
  alpha,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export type CommunicationWorkspaceKind = "support" | "messages";
export type CommunicationChannel = "IN_APP" | "WHATSAPP" | "EMAIL";
export type CommunicationAudience = "DIRECT" | "ROLE" | "BROADCAST";

export interface CommunicationConversation {
  id: string;
  channel: CommunicationChannel;
  name: string;
  contact: string;
  preview: string | null;
  updatedAt: string;
  unreadCount: number;
  status?: string | undefined;
  audience?: CommunicationAudience | undefined;
  assignedTo?: string | undefined;
  subject?: string | null | undefined;
  eventLabel?: string | undefined;
  details?: Array<{ label: string; value: string }> | undefined;
}

export interface CommunicationMessage {
  id: string;
  body: string;
  createdAt: string;
  outgoing: boolean;
  sender: string;
}

export interface CommunicationCapabilities {
  send: boolean;
}

export interface CommunicationDataSource {
  conversations: CommunicationConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  messages?: CommunicationMessage[] | undefined;
  onSend?: ((body: string) => Promise<void> | void) | undefined;
  loading?: boolean | undefined;
  error?: string | null | undefined;
  capabilities?: CommunicationCapabilities | undefined;
}

export interface CommunicationWorkspaceProps {
  workspace: CommunicationWorkspaceKind;
  dataSource: CommunicationDataSource;
  detailsView?: boolean | undefined;
  onBackToInbox?: (() => void) | undefined;
}

type MobileView = "inbox" | "conversation" | "details";

const filterChannels: Array<CommunicationChannel | "ALL"> = ["ALL", "IN_APP", "WHATSAPP", "EMAIL"];

function channelMeta(channel: CommunicationChannel | "ALL") {
  switch (channel) {
    case "WHATSAPP":
      return { icon: <ForumOutlinedIcon fontSize="small" />, label: "WhatsApp" };
    case "EMAIL":
      return { icon: <EmailOutlinedIcon fontSize="small" />, label: "Email" };
    case "IN_APP":
      return { icon: <SupportAgentRoundedIcon fontSize="small" />, label: "In-App" };
    default:
      return { icon: <GroupOutlinedIcon fontSize="small" />, label: "All" };
  }
}

function channelColor(theme: Theme, channel: CommunicationChannel | "ALL"): string {
  if (channel === "WHATSAPP") return theme.palette.success.main;
  if (channel === "EMAIL") return theme.palette.secondary.main;
  return theme.palette.primary.main;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTitle(
  workspace: CommunicationWorkspaceKind,
  conversation: CommunicationConversation,
): string {
  if (workspace === "support") return conversation.contact || conversation.name;
  return conversation.name;
}

function statusOf(conversation: CommunicationConversation): string {
  return conversation.status ?? "OPEN";
}

function MutedText({ children }: { children: ReactNode }) {
  return (
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {children}
    </Typography>
  );
}

function ConversationRow({
  workspace,
  conversation,
  selected,
  onSelect,
}: {
  workspace: CommunicationWorkspaceKind;
  conversation: CommunicationConversation;
  selected: boolean;
  onSelect: () => void;
}) {
  const theme = useTheme();
  const accent = channelColor(theme, conversation.channel);
  const meta = channelMeta(conversation.channel);
  const unread = conversation.unreadCount > 0;

  return (
    <Box
      component="button"
      type="button"
      data-testid="communication-conversation-row"
      onClick={onSelect}
      aria-current={selected ? "page" : undefined}
      sx={{
        appearance: "none",
        border: 0,
        borderRadius: theme.shape.borderRadius,
        bgcolor: selected
          ? alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.1)
          : "transparent",
        color: "text.primary",
        cursor: "pointer",
        display: "block",
        p: 1.25,
        textAlign: "left",
        width: "100%",
        "&:hover": {
          bgcolor: selected
            ? alpha(theme.palette.primary.main, 0.16)
            : theme.palette.extended.surface.level3,
        },
        "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
        <Badge
          badgeContent={conversation.unreadCount || undefined}
          color="primary"
          overlap="circular"
        >
          <Avatar
            sx={{
              bgcolor: alpha(accent, 0.14),
              color: accent,
              fontWeight: 700,
              height: 40,
              width: 40,
            }}
          >
            {initials(conversation.name)}
          </Avatar>
        </Badge>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "baseline", justifyContent: "space-between" }}
          >
            <Typography noWrap sx={{ fontSize: "0.875rem", fontWeight: unread ? 700 : 600 }}>
              {conversation.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", flexShrink: 0 }}>
              {conversation.updatedAt}
            </Typography>
          </Stack>
          <MutedText>
            <Box
              component="span"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {formatTitle(workspace, conversation)}
            </Box>
          </MutedText>
          <Typography
            sx={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              color: unread ? "text.primary" : "text.secondary",
              display: "-webkit-box",
              fontSize: "0.8125rem",
              lineHeight: 1.35,
              mt: 0.75,
              overflow: "hidden",
            }}
          >
            {conversation.preview}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.9 }}>
            <Box sx={{ color: accent, display: "grid", placeItems: "center" }}>{meta.icon}</Box>
            <MutedText>{meta.label}</MutedText>
            {conversation.assignedTo ? <MutedText>· {conversation.assignedTo}</MutedText> : null}
            {conversation.audience ? <MutedText>· {conversation.audience}</MutedText> : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function Inbox({
  workspace,
  conversations,
  selectedId,
  onSelect,
}: {
  workspace: CommunicationWorkspaceKind;
  conversations: CommunicationConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const theme = useTheme();
  const t = useTypedTranslations("layout");
  const [channel, setChannel] = useState<CommunicationChannel | "ALL">("ALL");
  const [audience, setAudience] = useState<CommunicationAudience | "ALL">("ALL");
  const [status, setStatus] = useState<string | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () =>
      conversations.filter((conversation) => {
        const channelMatches = channel === "ALL" || conversation.channel === channel;
        const statusMatches = status === "ALL" || statusOf(conversation) === status;
        const audienceMatches =
          workspace === "messages"
            ? audience === "ALL" || conversation.audience === audience
            : true;
        const term = search.trim().toLowerCase();
        const searchMatches =
          !term ||
          [conversation.name, conversation.contact, conversation.preview]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term);
        return channelMatches && statusMatches && audienceMatches && searchMatches;
      }),
    [audience, channel, conversations, search, status, workspace],
  );

  const title = workspace === "support" ? t("communication.support") : t("communication.messages");

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <Box>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <MutedText>
            {rows.length} {t("communication.conversations")}
          </MutedText>
        </Box>
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "background.default",
            border: `1px solid ${theme.palette.extended.border.subtle}`,
            borderRadius: theme.shape.borderRadius,
            display: "flex",
            gap: 1,
            mt: 1.75,
            px: 1.25,
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("communication.search")}
            inputProps={{
              "aria-label": t("communication.search"),
              autoComplete: "off",
              name: "communication-search",
            }}
            sx={{ fontSize: "0.875rem", height: 40, minWidth: 0, width: "100%" }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.extended.border.subtle}`,
          overflowX: "auto",
          px: 1.5,
          pb: 1.25,
        }}
      >
        <Stack direction="row" spacing={0.75} sx={{ minWidth: "max-content" }}>
          {filterChannels.map((item) => {
            const active = channel === item;
            const meta = channelMeta(item);
            return (
              <Chip
                key={item}
                icon={meta.icon}
                label={`${meta.label} ${item === "ALL" ? conversations.length : conversations.filter((conversation) => conversation.channel === item).length}`}
                onClick={() => setChannel(item)}
                size="small"
                variant={active ? "filled" : "outlined"}
                sx={{
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.14) : "transparent",
                  borderColor: active
                    ? alpha(theme.palette.primary.main, 0.35)
                    : theme.palette.extended.border.subtle,
                  color: active ? "primary.main" : "text.secondary",
                  height: 30,
                }}
              />
            );
          })}
        </Stack>
        {workspace === "messages" ? (
          <Stack direction="row" spacing={0.75} sx={{ minWidth: "max-content", mt: 1 }}>
            {(["ALL", "DIRECT", "ROLE", "BROADCAST"] as const).map((option) => (
              <Chip
                key={option}
                label={
                  option === "ALL"
                    ? t("communication.all")
                    : option === "DIRECT"
                      ? t("communication.direct")
                      : option === "ROLE"
                        ? t("communication.role")
                        : t("communication.broadcast")
                }
                onClick={() => setAudience(option)}
                size="small"
                variant={audience === option ? "filled" : "outlined"}
                sx={{
                  bgcolor:
                    audience === option ? alpha(theme.palette.primary.main, 0.12) : "transparent",
                  borderColor:
                    audience === option
                      ? alpha(theme.palette.primary.main, 0.32)
                      : theme.palette.extended.border.subtle,
                  color: audience === option ? "primary.main" : "text.secondary",
                  height: 28,
                }}
              />
            ))}
          </Stack>
        ) : (
          <Stack direction="row" spacing={0.75} sx={{ minWidth: "max-content", mt: 1 }}>
            {(["ALL", "OPEN", "WAITING", "CLOSED"] as const).map((item) => (
              <Chip
                key={item}
                label={
                  item === "ALL" ? t("communication.all") : t(`communication.statuses.${item}`)
                }
                onClick={() => setStatus(item)}
                size="small"
                variant={status === item ? "filled" : "outlined"}
                sx={{
                  bgcolor:
                    status === item ? alpha(theme.palette.primary.main, 0.12) : "transparent",
                  borderColor:
                    status === item
                      ? alpha(theme.palette.primary.main, 0.32)
                      : theme.palette.extended.border.subtle,
                  color: status === item ? "primary.main" : "text.secondary",
                  height: 28,
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 1 }}>
        {rows.length ? (
          <Stack spacing={0.5}>
            {rows.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                workspace={workspace}
                conversation={conversation}
                selected={selectedId === conversation.id}
                onSelect={() => onSelect(conversation.id)}
              />
            ))}
          </Stack>
        ) : (
          <Box sx={{ color: "text.secondary", px: 2, py: 7, textAlign: "center" }}>
            <SearchRoundedIcon />
            <Typography sx={{ mt: 1 }}>{t("communication.noResults")}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Timeline({
  conversationId,
  messages,
}: {
  conversationId: string;
  messages: CommunicationMessage[];
}) {
  const theme = useTheme();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);
  const latestMessage = messages.at(-1);

  useLayoutEffect(() => {
    isNearBottomRef.current = true;
  }, [conversationId]);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || !latestMessage) return;

    if (latestMessage.outgoing || isNearBottomRef.current) {
      timeline.scrollTop = timeline.scrollHeight;
      isNearBottomRef.current = true;
    }
  }, [latestMessage?.id, latestMessage?.outgoing]);

  return (
    <Box
      ref={timelineRef}
      data-testid="communication-timeline"
      onScroll={(event) => {
        const timeline = event.currentTarget;
        isNearBottomRef.current =
          timeline.scrollHeight - timeline.scrollTop - timeline.clientHeight <=
          Number.parseFloat(theme.spacing(6));
      }}
      sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: { xs: 1.5, md: 3 }, py: 2 }}
    >
      <Stack spacing={0.9}>
        {messages.map((message) => (
          <Box
            key={message.id}
            data-testid={`communication-message-${message.id}`}
            sx={{
              alignSelf: message.outgoing ? "flex-end" : "flex-start",
              maxWidth: { xs: "88%", sm: "68%" },
            }}
          >
            <Box
              sx={{
                bgcolor: message.outgoing
                  ? alpha(theme.palette.primary.main, 0.14)
                  : "background.paper",
                border: `1px solid ${message.outgoing ? alpha(theme.palette.primary.main, 0.26) : theme.palette.extended.border.subtle}`,
                borderRadius: theme.shape.borderRadius,
                px: 1.5,
                py: 1.125,
              }}
            >
              <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                {message.body}
              </Typography>
            </Box>
            <MutedText>
              <Box
                component="span"
                sx={{
                  display: "block",
                  textAlign: message.outgoing ? "right" : "left",
                  mt: 0.5,
                }}
              >
                {message.sender} · {message.createdAt}
              </Box>
            </MutedText>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function Conversation({
  workspace,
  conversation,
  messages,
  onSend,
  onBack,
  onDetails,
}: {
  workspace: CommunicationWorkspaceKind;
  conversation: CommunicationConversation | null;
  messages?: CommunicationMessage[] | undefined;
  onSend?: ((body: string) => Promise<void> | void) | undefined;
  onBack?: (() => void) | undefined;
  onDetails: () => void;
}) {
  const theme = useTheme();
  const t = useTypedTranslations("layout");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!conversation) {
    return (
      <Box
        sx={{
          alignItems: "center",
          color: "text.secondary",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          p: 3,
          textAlign: "center",
        }}
      >
        <ForumOutlinedIcon sx={{ color: "text.disabled", fontSize: 34 }} />
        <Typography component="h2" sx={{ color: "text.primary", fontWeight: 500, mt: 1.5 }}>
          {t("communication.selectConversation")}
        </Typography>
        <Typography sx={{ mt: 0.75 }}>
          {t("communication.selectConversationDescription")}
        </Typography>
      </Box>
    );
  }

  const meta = channelMeta(conversation.channel);
  const accent = channelColor(theme, conversation.channel);
  const canSend = Boolean(onSend);

  const send = () => {
    if (!input.trim() || !onSend) return;
    const body = input.trim();
    setInput("");
    setSending(true);
    setFailed(false);
    Promise.resolve(onSend(body))
      .catch(() => {
        setFailed(true);
        setInput(body);
      })
      .finally(() => setSending(false));
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "background.paper",
          borderBottom: `1px solid ${theme.palette.extended.border.subtle}`,
          display: "flex",
          gap: 1,
          minHeight: 64,
          px: { xs: 1, md: 2 },
        }}
      >
        {onBack ? (
          <Tooltip title={t("communication.back")}>
            <IconButton aria-label={t("communication.back")} onClick={onBack}>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Avatar
          sx={{
            bgcolor: alpha(accent, 0.14),
            color: accent,
            fontWeight: 700,
            height: 38,
            width: 38,
          }}
        >
          {initials(conversation.name)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 600 }}>
            {conversation.name}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Box sx={{ color: accent, display: "grid", placeItems: "center" }}>{meta.icon}</Box>
            <MutedText>
              <Box
                component="span"
                sx={{
                  display: "block",
                  maxWidth: 280,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {meta.label} · {formatTitle(workspace, conversation)}
              </Box>
            </MutedText>
          </Stack>
        </Box>
        <Tooltip title={t("communication.details")}>
          <IconButton aria-label={t("communication.details")} onClick={onDetails}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Timeline conversationId={conversation.id} messages={messages ?? []} />
      {failed ? (
        <Typography
          aria-live="polite"
          role="status"
          variant="caption"
          sx={{ color: "error.main", display: "block", px: 2, pb: 0.5 }}
        >
          {t("communication.sendFailed")}
        </Typography>
      ) : null}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.extended.border.subtle}`,
          pb: "max(env(safe-area-inset-bottom), 12px)",
          pt: 1.25,
          px: { xs: 1.25, md: 2 },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "background.default",
              border: `1px solid ${theme.palette.extended.border.subtle}`,
              borderRadius: theme.shape.borderRadius,
              display: "flex",
              flex: 1,
              minHeight: 44,
              px: 1.25,
            }}
          >
            <InputBase
              multiline
              maxRows={4}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder={
                conversation.channel === "EMAIL"
                  ? t("communication.reply")
                  : t("communication.writeMessage")
              }
              inputProps={{
                "aria-label": t("communication.writeMessage"),
                autoComplete: "off",
                name: "communication-draft",
              }}
              disabled={!canSend}
              sx={{ fontSize: "0.9rem", width: "100%" }}
            />
          </Box>
          <IconButton
            aria-label={t("communication.send")}
            color="primary"
            disabled={!canSend || !input.trim() || sending}
            onClick={send}
            sx={{ height: 44, width: 44 }}
          >
            {sending ? <CircularProgress size={20} /> : <SendRoundedIcon />}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

function Details({
  workspace,
  conversation,
  onClose,
}: {
  workspace: CommunicationWorkspaceKind;
  conversation: CommunicationConversation | null;
  onClose?: (() => void) | undefined;
}) {
  const theme = useTheme();
  const t = useTypedTranslations("layout");
  if (!conversation) {
    return (
      <Box sx={{ color: "text.secondary", p: 2.5 }}>
        <Typography>{t("communication.noDetails")}</Typography>
      </Box>
    );
  }

  const detailRows = conversation.details ?? [];
  const summary =
    workspace === "support"
      ? t("communication.guest")
      : (conversation.audience ?? t("communication.staff"));

  return (
    <Box sx={{ bgcolor: "background.paper", height: "100%", overflowY: "auto", p: 2.25 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t("communication.details")}
        </Typography>
        {onClose ? (
          <IconButton aria-label={t("communication.closeDetails")} onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        ) : null}
      </Stack>
      <Stack spacing={1.25} sx={{ alignItems: "center", mt: 2, textAlign: "center" }}>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.14),
            color: "primary.main",
            fontWeight: 700,
            height: 64,
            width: 64,
          }}
        >
          {initials(conversation.name)}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600 }}>{conversation.name}</Typography>
          <MutedText>{summary}</MutedText>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: theme.palette.extended.border.subtle, my: 2.25 }} />
      <MutedText>
        <Box
          component="span"
          sx={{ display: "block", textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          {t("communication.contact")}
        </Box>
      </MutedText>
      <Typography sx={{ fontSize: "0.875rem", mt: 0.5, overflowWrap: "anywhere" }}>
        {formatTitle(workspace, conversation)}
      </Typography>
      {conversation.eventLabel ? (
        <>
          <Divider sx={{ borderColor: theme.palette.extended.border.subtle, my: 2.25 }} />
          <MutedText>
            <Box
              component="span"
              sx={{ display: "block", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              {t("communication.event")}
            </Box>
          </MutedText>
          <Typography sx={{ fontSize: "0.875rem", mt: 0.5 }}>{conversation.eventLabel}</Typography>
        </>
      ) : null}
      {conversation.status ? (
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", mt: 1.25 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("communication.status")}
          </Typography>
          <Typography align="right" variant="body2" sx={{ fontWeight: 600 }}>
            {conversation.status}
          </Typography>
        </Stack>
      ) : null}
      {detailRows.length ? (
        <>
          <Divider sx={{ borderColor: theme.palette.extended.border.subtle, my: 2.25 }} />
          <Stack spacing={1.25}>
            {detailRows.map((detail) => (
              <Stack
                key={detail.label}
                direction="row"
                spacing={1}
                sx={{ justifyContent: "space-between" }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {detail.label}
                </Typography>
                <Typography align="right" variant="body2" sx={{ fontWeight: 600 }}>
                  {detail.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      ) : null}
    </Box>
  );
}

function StatePanel({ message, loading }: { message: string; loading?: boolean }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        color: "text.secondary",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        height: "100%",
        justifyContent: "center",
        px: 2,
        textAlign: "center",
      }}
    >
      {loading ? <CircularProgress size={22} /> : <SearchRoundedIcon />}
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}

export function CommunicationWorkspace({
  workspace,
  dataSource,
  detailsView = false,
  onBackToInbox,
}: CommunicationWorkspaceProps) {
  const theme = useTheme();
  const t = useTypedTranslations("layout");
  const isMobile = useMediaQuery("(max-width: 767.95px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279.95px)");
  const [mobileView, setMobileView] = useState<MobileView>(detailsView ? "details" : "inbox");
  const [drawerOpen, setDrawerOpen] = useState(detailsView && isTablet);

  const conversations = dataSource.conversations;
  const selected = useMemo(
    () => conversations.find((item) => item.id === dataSource.selectedId) ?? null,
    [conversations, dataSource.selectedId],
  );
  const loading = dataSource.loading ?? false;
  const error = dataSource.error ?? null;

  const select = (id: string) => {
    dataSource.onSelect(id);
    if (isMobile) setMobileView("conversation");
  };
  const showDetails = () => {
    if (isMobile) setMobileView("details");
    else if (isTablet) setDrawerOpen(true);
  };
  const backToInbox = () => {
    if (onBackToInbox) {
      onBackToInbox();
      return;
    }
    setMobileView("inbox");
  };

  const capabilities = dataSource.capabilities ?? { send: true };
  const canSend = capabilities.send && Boolean(dataSource.onSend);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        display: "flex",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {!isMobile || mobileView === "inbox" ? (
        <Box
          sx={{
            borderRight: { md: `1px solid ${theme.palette.extended.border.subtle}` },
            flexShrink: 0,
            height: "100%",
            width: { xs: "100%", md: 320, lg: 336 },
          }}
        >
          {error ? (
            <StatePanel message={error} />
          ) : conversations.length === 0 && loading ? (
            <StatePanel loading message={t("communication.loading")} />
          ) : (
            <Inbox
              workspace={workspace}
              conversations={conversations}
              selectedId={dataSource.selectedId}
              onSelect={select}
            />
          )}
        </Box>
      ) : null}
      {!isMobile || mobileView === "conversation" ? (
        <Conversation
          workspace={workspace}
          conversation={selected}
          messages={dataSource.messages}
          onSend={canSend ? (body) => dataSource.onSend?.(body) : undefined}
          onBack={isMobile ? backToInbox : undefined}
          onDetails={showDetails}
        />
      ) : null}
      {!isMobile && !isTablet ? (
        <Box
          sx={{
            borderLeft: `1px solid ${theme.palette.extended.border.subtle}`,
            flexShrink: 0,
            height: "100%",
            width: 296,
          }}
        >
          <Details workspace={workspace} conversation={selected} />
        </Box>
      ) : null}
      {isMobile && mobileView === "details" ? (
        <Box sx={{ bgcolor: "background.paper", height: "100%", width: "100%" }}>
          <Details
            workspace={workspace}
            conversation={selected}
            onClose={() => setMobileView("conversation")}
          />
        </Box>
      ) : null}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              overscrollBehavior: "contain",
              width: "min(360px, 92vw)",
            },
          },
        }}
      >
        <Details
          workspace={workspace}
          conversation={selected}
          onClose={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Box>
  );
}
