"use client";

import {
  SeatsQuery,
  InvitationPayload,
  EventChildrenQuery,
  EventChildrenQueryVariables,
  EventChildrenDocument,
  GetFullEventInvitationQuery,
  GetFullEventInvitationQueryVariables,
  GetFullEventInvitationDocument,
  EventQuery,
  EventQueryVariables,
  EventDocument,
  SeatsQueryVariables,
  SeatsDocument,
  CreateInvitationMutation,
  CreateInvitationMutationVariables,
  CreateInvitationDocument,
  ApproveInvitationMutation,
  ApproveInvitationMutationVariables,
  ApproveInvitationDocument,
  RemoveInvitationMutation,
  RemoveInvitationMutationVariables,
  RemoveInvitationDocument,
  ImportInvitationsMutation,
  ImportInvitationsMutationVariables,
  ImportInvitationsDocument,
  SendBulkInvitationsMutation,
  SendBulkInvitationsMutationVariables,
  SendBulkInvitationsDocument,
  BulkApproveInvitationsMutation,
  BulkApproveInvitationsMutationVariables,
  BulkApproveInvitationsDocument,
} from "@/checkpoint/generated/graphql";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";
import { mapPhoneNumbersToInput } from "@/checkpoint/utils/mapPhoneNumbersToInput";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */
export interface UserCreatedEntry {
  invitationId: string;
  username: string;
  password: string;
  timestamp: number;
  firstName: string;
  lastName: string;
}

export interface EventOption {
  id: string;
  name: string;
}

export interface BulkApproveSeatOption {
  id: string;
  eventId: string;
  label: string;
  status: string;
  note: string | null;
  guestId: string | null;
}

export interface BulkApproveEntry {
  invitationId: string;
  locale: string;
  eventId: string;
  eventName: string;
  seatId: string | null;
  seatLabel: string | null;
  
}


/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */
export interface PreviewResponse {
  headers: string[];
  mapping: Record<string, string>;
  confidence: number;
  rows: Record<string, unknown>[];
  errors: string[];
  duplicates: number[];
  total: number;
}

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */
function formatSeatLabel(seat: NonNullable<SeatsQuery["seats"]>[number]): string {
  const sectionName = seat.section?.name?.trim();
  const tableName = seat.table?.name?.trim();
  const baseLabel =
    seat.label?.trim() || (typeof seat.number === "number" ? `Seat ${seat.number}` : seat.id);

  const parts = [sectionName, tableName, baseLabel].filter((value): value is string =>
    Boolean(value && value.length > 0),
  );

  return parts.join(" • ");
}

/* ---------------------------------------------------------------------------
 * Hook
 * ------------------------------------------------------------------------- */
export function useInvitationLogic(eventId: string) {
  const logger = getLogger("useInvitationLogic");

  /* -----------------------------------------------------------------------
   * Filters
   * --------------------------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<string | null>(null);

  /* -----------------------------------------------------------------------
   * UI State
   * --------------------------------------------------------------------- */
  const [selected, setSelected] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [activeInvitation, setActiveInvitation] =
    useState<InvitationPayload | null>(null);


  /* -----------------------------------------------------------------------
   * Bulk Send State
   * --------------------------------------------------------------------- */
  const [bulkSendIds, setBulkSendIds] = useState<string[] | null>(null);
  const [bulkLocales, setBulkLocales] = useState<Record<string, string>>({});

  /* -----------------------------------------------------------------------
   * Bulk Approve State
   * --------------------------------------------------------------------- */
  const [bulkApproveIds, setBulkApproveIds] = useState<string[] | null>(null);
  const [bulkApproveEntries, setBulkApproveEntries] = useState<
    Record<string, BulkApproveEntry>
  >({});
  const [seatOptionsByEventId, setSeatOptionsByEventId] = useState<
    Record<string, BulkApproveSeatOption[]>
  >({});

  /* -----------------------------------------------------------------------
   * Inbox
   * --------------------------------------------------------------------- */
  const [createdUsers, setCreatedUsers] = useState<UserCreatedEntry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* -----------------------------------------------------------------------
   * Upload / Preview / Import State
   * --------------------------------------------------------------------- */
  const [key, setKey] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"csv" | "xlsx">("csv");

    const [importLoading, setImportLoading] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);


  /* -----------------------------------------------------------------------
   * Queries
   * --------------------------------------------------------------------- */
  const { data: childrenData, loading: childrenLoading } = useQuery<
    EventChildrenQuery,
    EventChildrenQueryVariables
  >(EventChildrenDocument, {
    variables: { id: eventId },
  });

  const eventIds = [
    eventId,
    ...(childrenData?.eventChildren?.map((event) => event.id) ?? []),
  ];

  const {
    data: invitationData,
    loading: invitationsLoading,
    refetch,
  } = useQuery<
    GetFullEventInvitationQuery,
    GetFullEventInvitationQueryVariables
  >(GetFullEventInvitationDocument, {
    variables: { eventIds },
  });

  const { data: rootEventData, loading: rootLoading } = useQuery<
    EventQuery,
    EventQueryVariables
  >(EventDocument, {
    variables: { id: eventId },
  });

  const [loadSeatsByEvent] = useLazyQuery<SeatsQuery, SeatsQueryVariables>(
    SeatsDocument,
    {
      fetchPolicy: "network-only",
    },
  );

  /* -----------------------------------------------------------------------
   * Data Mapping
   * --------------------------------------------------------------------- */
  const invitations = invitationData?.getFullByEventIds ?? [];
  const rootEvent = rootEventData?.event ?? null;

  const childEvents = useMemo<EventOption[]>(
    () =>
      (childrenData?.eventChildren ?? []).map((event) => ({
        id: event.id,
        name: event.name,
      })),
    [childrenData],
  );

  const allEventOptions = useMemo<EventOption[]>(() => {
    const options: EventOption[] = [
      {
        id: rootEvent?.id ?? eventId,
        name: rootEvent?.name ?? "Hauptevent",
      },
      ...childEvents,
    ];

    const seen = new Set<string>();
    return options.filter((option) => {
      if (seen.has(option.id)) {
        return false;
      }

      seen.add(option.id);
      return true;
    });
  }, [childEvents, eventId, rootEvent]);

  const rootEventId = rootEvent?.id ?? eventId;
  const rootEventName = rootEvent?.name ?? "Hauptevent";

  const eventNameById = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {
      [rootEventId]: rootEventName,
    };

    for (const child of childEvents) {
      map[child.id] = child.name;
    }

    return map;
  }, [childEvents, rootEventId, rootEventName]);

  const invitationById = useMemo(() => {
    const map = new Map<string, (typeof invitations)[number]>();

    for (const invitation of invitations) {
      map.set(invitation.id, invitation);
    }

    return map;
  }, [invitations]);

  const bulkApproveInvitationList = useMemo(() => {
    if (!bulkApproveIds?.length) {
      return [];
    }

    return bulkApproveIds
      .map((id) => invitationById.get(id))
      .filter((invitation): invitation is NonNullable<typeof invitation> =>
        Boolean(invitation),
      );
  }, [bulkApproveIds, invitationById]);

  /* -----------------------------------------------------------------------
   * Filtering
   * --------------------------------------------------------------------- */
  const filteredInvitations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return invitations.filter((invitation) => {
      if (eventFilter && invitation.eventId !== eventFilter) {
        return false;
      }

      if (typeFilter && invitation.type !== typeFilter) {
        return false;
      }

      if (statusFilter && invitation.status !== statusFilter) {
        return false;
      }

      if (normalizedSearch) {
        const fullName =
          `${invitation.firstName ?? ""} ${invitation.lastName ?? ""}`.toLowerCase();

        const email = (invitation.email ?? "").toLowerCase();
        const phone = (invitation.phoneNumber ?? "").toLowerCase();

        return (
          fullName.includes(normalizedSearch) ||
          email.includes(normalizedSearch) ||
          phone.includes(normalizedSearch)
        );
      }

      return true;
    });
  }, [eventFilter, invitations, search, statusFilter, typeFilter]);

  /* -----------------------------------------------------------------------
   * Mutations
   * --------------------------------------------------------------------- */
  const [createInvitation] = useMutation<
    CreateInvitationMutation,
    CreateInvitationMutationVariables
  >(CreateInvitationDocument);

  const [approveInvitation] = useMutation<
    ApproveInvitationMutation,
    ApproveInvitationMutationVariables
  >(ApproveInvitationDocument);

  const [deleteInvitation] = useMutation<
    RemoveInvitationMutation,
    RemoveInvitationMutationVariables
  >(RemoveInvitationDocument);

  const [importInvitations] = useMutation<
    ImportInvitationsMutation,
    ImportInvitationsMutationVariables
  >(ImportInvitationsDocument);

  const [sendBulkInvitationsMutation, { loading: sendingBulk }] = useMutation<
    SendBulkInvitationsMutation,
    SendBulkInvitationsMutationVariables
  >(SendBulkInvitationsDocument);

  const [bulkApproveMutation, { loading: bulkApproving }] = useMutation<
    BulkApproveInvitationsMutation,
    BulkApproveInvitationsMutationVariables
  >(BulkApproveInvitationsDocument);

  /* -----------------------------------------------------------------------
   * Internal Seat Loader
   * --------------------------------------------------------------------- */
  async function ensureSeatsLoaded(targetEventId: string): Promise<void> {
    if (seatOptionsByEventId[targetEventId]) {
      return;
    }

    const result = await loadSeatsByEvent({
      variables: {
        id: targetEventId,
      },
    });

    const seats = result.data?.seats ?? [];

    const mapped: BulkApproveSeatOption[] = seats.map((seat) => ({
      id: seat.id,
      eventId: seat.eventId,
      label: formatSeatLabel(seat),
      status: seat.status,
      note: seat.note ?? null,
      guestId: seat.guestId ?? null,
    }));

    setSeatOptionsByEventId((prev) => ({
      ...prev,
      [targetEventId]: mapped,
    }));
  }

  /* -----------------------------------------------------------------------
   * General Actions
   * --------------------------------------------------------------------- */
  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }

  function clearSelection() {
    setSelected([]);
  }

  function openInvitation(invitation: InvitationPayload) {
    setActiveInvitation(invitation);
  }

  function closeInvitation() {
    setActiveInvitation(null);
  }

  /* -----------------------------------------------------------------------
   * Bulk Send Actions
   * --------------------------------------------------------------------- */
  function openBulkSendDialog(ids: string[]) {
    const defaults: Record<string, string> = {};

    ids.forEach((id) => {
      defaults[id] = "en-US";
    });

    setBulkLocales(defaults);
    setBulkSendIds(ids);
    setSendOpen(true);
  }

  function setGuestLocale(invitationId: string, locale: string) {
    setBulkLocales((prev) => ({
      ...prev,
      [invitationId]: locale,
    }));
  }

  function closeBulkSendDialog() {
    setSendOpen(false);
    setBulkSendIds(null);
    setBulkLocales({});
  }

  async function sendBulkInvitations(ids: string[]) {
    try {
      logger.debug("Sending bulk invitations", { ids });

      const selectedInvitations = invitations.filter((invitation) =>
        ids.includes(invitation.id),
      );

      if (selectedInvitations.length === 0) {
        throw new Error("No invitations selected");
      }

      const guests = selectedInvitations.map((invitation) => {
        const eventNameResolved =
          eventNameById[invitation.eventId] ?? rootEventName;

        const rsvpUrl = `${window.location.origin}/rsvp/${invitation.id}`;

        return {
          firstName: invitation.firstName ?? "",
          lastName: invitation.lastName ?? "",
          email: invitation.email ?? null,
          phoneNumbers: mapPhoneNumbersToInput(invitation.phoneNumbers) ?? null,
          plusOnes: invitation.maxInvitees,
          locale: bulkLocales[invitation.id] ?? "en-US",
          rootInvitee: invitation.invitedByInvitationId,
          eventId: invitation.eventId,
          eventName: eventNameResolved,
          rsvpUrl,
        };
      });

      await sendBulkInvitationsMutation({
        variables: {
          input: {
            hostName: rootEventName,
            guests,
          },
        },
      });

      setSendOpen(false);
      setBulkSendIds(null);
      setBulkLocales({});
      setSelected([]);

      await refetch();
    } catch (err) {
      logger.error("Bulk send failed", err);
      throw err;
    }
  }

  /* -----------------------------------------------------------------------
   * Bulk Approve Dialog Actions
   * --------------------------------------------------------------------- */
  async function openBulkApproveDialog(ids: string[]) {
    const selectedInvitations = invitations.filter((invitation) =>
      ids.includes(invitation.id),
    );

    if (selectedInvitations.length === 0) {
      throw new Error("No invitations selected");
    }

    const defaults: Record<string, BulkApproveEntry> = {};

    for (const invitation of selectedInvitations) {
      const resolvedEventId = invitation.eventId;
      const resolvedEventName = eventNameById[resolvedEventId] ?? rootEventName;

      defaults[invitation.id] = {
        invitationId: invitation.id,
        locale: "en-US",
        eventId: resolvedEventId,
        eventName: resolvedEventName,
        seatId: null,
        seatLabel: null,
      };
    }

    setBulkApproveIds(ids);
    setBulkApproveEntries(defaults);
    setApproveOpen(true);

    const uniqueEventIds = Array.from(
      new Set(selectedInvitations.map((invitation) => invitation.eventId)),
    );

    await Promise.all(
      uniqueEventIds.map(async (targetEventId) => {
        await ensureSeatsLoaded(targetEventId);
      }),
    );
  }

  function closeBulkApproveDialog() {
    setApproveOpen(false);
    setBulkApproveIds(null);
    setBulkApproveEntries({});
  }

  function setBulkApproveLocale(invitationId: string, locale: string) {
    setBulkApproveEntries((prev) => {
      const existing = prev[invitationId];

      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [invitationId]: {
          ...existing,
          locale,
        },
      };
    });
  }

  async function setBulkApproveEvent(
    invitationId: string,
    selectedEventId: string,
  ) {
    await ensureSeatsLoaded(selectedEventId);

    setBulkApproveEntries((prev) => {
      const existing = prev[invitationId];

      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [invitationId]: {
          ...existing,
          eventId: selectedEventId,
          eventName: eventNameById[selectedEventId] ?? rootEventName,
          seatId: null,
          seatLabel: "debug",
        },
      };
    });
  }

  function setBulkApproveSeat(invitationId: string, seatId: string | null) {
    setBulkApproveEntries((prev) => {
      const existing = prev[invitationId];

      if (!existing) {
        return prev;
      }

      const seatOptions = seatOptionsByEventId[existing.eventId] ?? [];
      const selectedSeat = seatOptions.find((seat) => seat.id === seatId);

      return {
        ...prev,
        [invitationId]: {
          ...existing,
          seatId,
          seatLabel: selectedSeat?.label ?? "debug",
        },
      };
    });
  }

  async function bulkApprove(ids?: string[]) {
    try {
      const effectiveIds = ids ?? bulkApproveIds ?? [];

      logger.debug("Bulk approve start", { ids: effectiveIds });

      if (effectiveIds.length === 0) {
        throw new Error("No invitations selected");
      }

      const payload = effectiveIds.map((invitationId) => {
        const entry = bulkApproveEntries[invitationId];

        if (!entry) {
          throw new Error(`Missing bulk approve entry for ${invitationId}`);
        }

        return {
          invitationId: entry.invitationId,
          eventName: entry.eventName,
          seat: entry.seatLabel || "debug",
          seatId: entry.seatId ?? null,
        };
      });

      await bulkApproveMutation({
        variables: {
          input: {
            invitationIds: payload,
            approved: true,
          },
        },
      });

      await refetch();

      setApproveOpen(false);
      setBulkApproveIds(null);
      setBulkApproveEntries({});
      setSelected([]);
    } catch (err) {
      logger.error("Bulk approve failed", err);
      throw err;
    }
  }

  /* -----------------------------------------------------------------------
   * Generic Helpers
   * --------------------------------------------------------------------- */
  function reload() {
    return refetch();
  }

  function resetUserInbox() {
    setCreatedUsers([]);
    setUnreadCount(0);
  }

  function addCreatedUser(payload: {
    invitationId: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    setCreatedUsers((prev) => [
      {
        ...payload,
        timestamp: Date.now(),
      },
      ...prev,
    ]);

    setUnreadCount((count) => count + 1);
  }

  /* ======================================================================
   * UPLOAD
   * ====================================================================== */
  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${env.NEXT_PUBLIC_INVITATION_URI}/upload`, {
      method: "POST",
      body: form,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const json = await res.json();

    setKey(json.key);
    setUploadType(json.type);

    logger.debug("Upload success", json);

    return json;
  }

  /* ======================================================================
   * PREVIEW
   * ====================================================================== */
async function previewFile(input?: {
  key: string;
  type: "csv" | "xlsx";
}): Promise<PreviewResponse> {
  const effectiveKey = input?.key ?? key;
  const effectiveType = input?.type ?? uploadType;

  if (!effectiveKey || !effectiveType) {
    throw new Error("No upload available");
  }

  const res = await fetch(`${env.NEXT_PUBLIC_INVITATION_URI}/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      key: effectiveKey,
      type: effectiveType,
      eventId,
    }),
  });

  const json: PreviewResponse = await res.json();

  setPreview(json);

  return json;
}

  /* ======================================================================
   * IMPORT
   * ====================================================================== */
  async function executeImport() {
    if (!key || !uploadType) {
      throw new Error("Upload not initialized");
    }

    setImportProgress(20);

    try {
      const result = await importInvitations({
        variables: {
          input: {
            eventId,
            key,
            uploadType,
          },
        },
      });

      setImportProgress(100);

      logger.debug("Import finished", result.data);

      return result;
    } catch (err) {
      setImportProgress(0);
      logger.error("Import failed", err);
      throw err;
    }
  }

  /* ======================================================================
   * RESET
   * ====================================================================== */
  function resetImport() {
    setKey(null);
    setUploadType('csv');
    setPreview(null);
    setImportProgress(0);
  }

  /* -----------------------------------------------------------------------
   * Return
   * --------------------------------------------------------------------- */
  return {
    eventId,
    events: childrenData?.eventChildren,
    invitations: filteredInvitations,
    loading: invitationsLoading || rootLoading || childrenLoading,


    /* filters */
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    eventFilter,
    setEventFilter,

    /* event */
    rootEventId,
    rootEventName,
    childEvents,
    allEventOptions,
    eventNameById,

    /* selection */
    selected,
    toggleSelect,
    clearSelection,

    /* dialogs */
    createOpen,
    setCreateOpen,
    importOpen,
    setImportOpen,
    sendOpen,
    approveOpen,

    /* invitation */
    activeInvitation,
    openInvitation,
    closeInvitation,

    /* upload/import */
    uploadType,
    setUploadType,
    importLoading,
    importProgress,
    executeImport,

    /* mutations */
    createInvitation,
    approveInvitation,
    deleteInvitation,
    importInvitations,

    key,
    preview,

    /* actions */
    uploadFile,
    previewFile,
    resetImport,

    /* bulk send */
    openBulkSendDialog,
    bulkSendIds,
    closeBulkSendDialog,
    bulkLocales,
    setGuestLocale,
    sendBulkInvitations,
    sendingBulk,

    /* bulk approve */
    bulkApproveIds,
    bulkApproveEntries,
    bulkApproveInvitationList,
    seatOptionsByEventId,
    openBulkApproveDialog,
    closeBulkApproveDialog,
    setBulkApproveLocale,
    setBulkApproveEvent,
    setBulkApproveSeat,
    bulkApprove,
    bulkApproving,

    /* data */
    refetch,
    reload,

    /* inbox */
    createdUsers,
    unreadCount,
    resetUserInbox,
    addCreatedUser,
  };
}

export type InvitationLogic = ReturnType<typeof useInvitationLogic>;
