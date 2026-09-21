"use client";

import { Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  type CommunicationCapabilities,
  type CommunicationConversation,
  type CommunicationDataSource,
  type CommunicationMessage,
  CommunicationWorkspace,
} from "@/checkpoint/components/communication/CommunicationWorkspace";
import type { PersonData } from "@/checkpoint/components/communication/PersonListItem";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { InternalConversationType } from "@/checkpoint/generated/graphql";
import { resolveStaffName, useEventStaff } from "@/checkpoint/hooks/events/useEventStaff";
import { useEventInternalMessages } from "@/checkpoint/hooks/internal/useEventInternalMessages";
import { useEventSupport } from "@/checkpoint/hooks/support/useEventSupport";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export type CommunicationWorkspaceKind = "support" | "messages";

function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const isToday = date.toDateString() === new Date().toDateString();
  return new Intl.DateTimeFormat(undefined, {
    ...(isToday ? { hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "2-digit" }),
  }).format(date);
}

function toAudience(value: string | null | undefined): "DIRECT" | "ROLE" | "BROADCAST" | undefined {
  if (value === "ROLE_CHANNEL") return "ROLE";
  if (value === "BROADCAST") return "BROADCAST";
  if (value === "DIRECT") return "DIRECT";
  return undefined;
}

function toChannel(value: string): "IN_APP" | "WHATSAPP" | "EMAIL" {
  if (value === "WHATSAPP") return "WHATSAPP";
  if (value === "EMAIL") return "EMAIL";
  return "IN_APP";
}

const SEND_CAPABILITY: CommunicationCapabilities = { send: true };
const MESSAGES_CAPABILITY: CommunicationCapabilities = { send: true, create: true };

/** Shared host for both communication workspaces; drives the shell from real GraphQL data. */
export function CommunicationWorkspaceClientPage({
  workspace,
  deepLinkConversationId,
  detailsView = false,
}: {
  workspace: CommunicationWorkspaceKind;
  deepLinkConversationId?: string | null;
  detailsView?: boolean;
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;
  const { currentUser } = useAuth();
  const basePath =
    workspace === "support" ? `/event/${eventId}/support` : `/event/${eventId}/notification`;

  const support = useEventSupport(
    workspace === "support" ? eventId : undefined,
    workspace === "support" ? deepLinkConversationId : undefined,
  );
  const internal = useEventInternalMessages(
    workspace === "messages" ? eventId : undefined,
    workspace === "messages" ? deepLinkConversationId : undefined,
  );

  const { staff: staffMembers } = useEventStaff({
    ...(workspace === "messages" && eventId ? { eventId } : {}),
  });

  const staff = useMemo<PersonData[]>(
    () =>
      staffMembers.map((s) => ({
        id: s.userId,
        name: resolveStaffName(s),
        roles: s.roles,
        channels: s.phoneNumbers?.length
          ? ["WHATSAPP", ...(s.email ? ["EMAIL"] : [])]
          : s.email
            ? ["EMAIL"]
            : ["IN_APP"],
        isOnline: false,
        unreadCount: 0,
      })),
    [staffMembers],
  );

  const onCreateConversation = useCallback(
    async (participantIds: string[]): Promise<string | null> => {
      const names = staff
        .filter((person) => participantIds.includes(person.id))
        .map((person) => person.name)
        .filter(Boolean);
      const title = names.length ? names.join(", ") : "Internal";
      const conversation = await internal.createConversation({
        title,
        participantIds,
        type: InternalConversationType.DIRECT,
      });
      if (conversation) router.push(`${basePath}/${conversation.id}`);
      return conversation?.id ?? null;
    },
    [basePath, internal, router, staff],
  );

  const dataSource = useMemo<CommunicationDataSource>(() => {
    if (workspace === "support") {
      const conversations: CommunicationConversation[] = support.allConversationViews.map(
        (conversation) => ({
          id: conversation.id,
          channel: conversation.channel,
          name: conversation.externalDisplayName,
          contact: conversation.externalAddress ?? "",
          preview: conversation.lastMessage ?? "",
          updatedAt: formatTime(conversation.lastMessageAt),
          unreadCount: conversation.unreadCount ?? 0,
          status: conversation.status,
          audience: "DIRECT",
          eventLabel: eventId,
          details: [{ label: "Status", value: conversation.status }],
        }),
      );
      const messages: CommunicationMessage[] = support.messages.map((message) => {
        const outgoing = !message.fromGuest;
        return {
          id: message.id,
          body: message.body ?? "",
          createdAt: formatTime(message.createdAt),
          outgoing,
          sender: outgoing ? "You" : "Guest",
        };
      });
      return {
        conversations,
        selectedId: support.selectedId,
        onSelect: (id) => router.push(`${basePath}/${id}`),
        messages,
        onSend: (body) => {
          void support.sendMessage(support.selectedId ?? "", body);
        },
        loading: support.conversationsLoading,
        error: null,
        capabilities: SEND_CAPABILITY,
      };
    }

    const conversations: CommunicationConversation[] = internal.conversations.map(
      (conversation) => ({
        id: conversation.id,
        channel: toChannel(conversation.channel),
        name: conversation.title,
        contact: conversation.description ?? "",
        preview: conversation.description ?? "",
        updatedAt: formatTime(conversation.updatedAt),
        unreadCount: conversation.unreadCount ?? 0,
        status: "OPEN",
        audience: toAudience(conversation.type),
        eventLabel: eventId,
        details: [
          { label: "Type", value: conversation.type },
          { label: "Participants", value: String(conversation.participants?.length ?? 0) },
        ],
      }),
    );
    const messages: CommunicationMessage[] = internal.messages.map((message) => {
      const outgoing = message.senderId === currentUser?.id;
      return {
        id: message.id,
        body: message.body,
        createdAt: formatTime(message.createdAt),
        outgoing,
        sender: outgoing ? "You" : "Staff",
      };
    });
    return {
      conversations,
      selectedId: internal.selectedId,
      onSelect: (id) => router.push(`${basePath}/${id}`),
      messages,
      onSend: (body) => {
        void internal.send(body);
      },
      staff,
      onCreateConversation,
      loading: internal.conversationsLoading,
      error: internal.conversationsError ? internal.conversationsError.message : null,
      capabilities: MESSAGES_CAPABILITY,
    };
  }, [
    basePath,
    currentUser?.id,
    eventId,
    internal,
    onCreateConversation,
    router,
    staff,
    support,
    workspace,
  ]);

  return (
    <RouteGuard featureId={workspace === "support" ? "support" : "notifications"}>
      <Box
        sx={{
          height: { xs: "calc(100dvh - 132px)", md: "calc(100dvh - 64px)" },
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <CommunicationWorkspace
          workspace={workspace}
          dataSource={dataSource}
          detailsView={detailsView}
          onBackToInbox={() => router.push(basePath)}
        />
      </Box>
    </RouteGuard>
  );
}
