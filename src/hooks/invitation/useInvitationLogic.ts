"use client";

// TODO kein any

import { useMutation } from "@apollo/client/react";
import { useMemo, useState } from "react";
import type {
  AssignSeatMutation,
  AssignSeatMutationVariables,
  GetGlobalEventInvitationListQuery,
  InvitationPayload,
  SeatListQuery,
} from "@/checkpoint/generated/graphql";
import { AssignSeatDocument } from "@/checkpoint/generated/graphql";
import useEventTreeQuery from "@/checkpoint/hooks/events/useEventTreeQuery";
import useInvitationListQuery from "@/checkpoint/hooks/invitation/useInvitationListQuery";
import useInvitationMutation from "@/checkpoint/hooks/invitation/useInvitationMutation";
import useSeatListQuery from "@/checkpoint/hooks/seat/useSeatListQuery";
import { env } from "@/checkpoint/lib/env";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import {
  dispatchApprovalMutation,
  isFinalizableInvitationStatus,
  isStageableInvitationStatus,
  toggleInvitationSelection,
} from "@/checkpoint/utils/invitation/approval-workflow";
import { getLogger } from "@/checkpoint/utils/logger";
import { mapPhoneNumbersToInput } from "@/checkpoint/utils/mapPhoneNumbersToInput";

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

export interface BulkApproveEntry {
  invitationId: string;
  eventId: string;
  seatId: string | null;
  originalSeatId: string | null;
}

type ApprovalDialogMode = "stage" | "finalize";
type SeatOption = SeatListQuery["seats"][number] & { label: string };

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
 * Hook
 * ------------------------------------------------------------------------- */
export function useInvitationLogic(eventId: string) {
  const logger = getLogger("useInvitationLogic");
  const { can } = useActiveEvent();
  const canApprove = can(EventPermissionKey.ApproveGuests);

  /* -----------------------------------------------------------------------
   * Filters
   * --------------------------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<string | null>(null);
  const [selectedInvitedByFilter, setSelectedInvitedByFilter] = useState<string | null>(null);

  /* -----------------------------------------------------------------------
   * UI State
   * --------------------------------------------------------------------- */
  const [selected, setSelected] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [approvalDialogMode, setApprovalDialogMode] = useState<ApprovalDialogMode>("stage");
  const [activeInvitation, setActiveInvitation] = useState<InvitationPayload | null>(null);

  /* -----------------------------------------------------------------------
   * Bulk Send State
   * --------------------------------------------------------------------- */
  const [bulkSendIds, setBulkSendIds] = useState<string[] | null>(null);
  const [bulkLocales, setBulkLocales] = useState<Record<string, string>>({});

  /* -----------------------------------------------------------------------
   * Bulk Approve State
   * --------------------------------------------------------------------- */
  const [bulkApproveIds, setBulkApproveIds] = useState<string[] | null>(null);
  const [bulkApproveEntries, setBulkApproveEntries] = useState<Record<string, BulkApproveEntry>>(
    {},
  );
  const [seatOptionsByEventId, setSeatOptionsByEventId] = useState<Record<string, SeatOption[]>>(
    {},
  );

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

  const [importLoading, _setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  const [sendingBulk, setSendingBulk] = useState<boolean>(false);

  const { fullEventTree, fullEventTreeLoading } = useEventTreeQuery({
    eventId,
    loadFullEventTreeInfo: true,
  });

  const {
    approveInvitationMutation,
    deleteInvitationMutation,
    importInvitationsMutation,
    sendBulkInvitationsMutation,
    bulkApproveMutation,
    bulkApproveMutationLoading,
    bulkStageMutation,
    bulkStageMutationLoading,
    createInvitationMutation,
  } = useInvitationMutation();
  const [assignSeatMutation] = useMutation<AssignSeatMutation, AssignSeatMutationVariables>(
    AssignSeatDocument,
  );

  const { getSeatList: loadSeatList, seatListRefetch: refetchSeatList } = useSeatListQuery({});

  const eventIds = fullEventTree
    ? [fullEventTree.rootEvent.id, ...(fullEventTree.subEvents?.map((s) => s.id) ?? [])]
    : [];

  const {
    globalEventInvitationList,
    globalEventInvitationListLoading,
    globalEventInvitationListRefetch,
  } = useInvitationListQuery({
    eventIds,
    loadGlobalEventInvitationList: true,
  });

  /* -----------------------------------------------------------------------
   * Data Mapping
   * --------------------------------------------------------------------- */
  const rootEvent = fullEventTree?.rootEvent;
  const subEvents = useMemo(() => fullEventTree?.subEvents, [fullEventTree?.subEvents]);

  const allEventOptions = useMemo(() => {
    const options = [...(rootEvent ? [rootEvent] : []), ...(subEvents ?? [])];

    const seen = new Set<string>();
    return options.filter((option) => {
      if (seen.has(option.id)) {
        return false;
      }

      seen.add(option.id);
      return true;
    });
  }, [rootEvent, subEvents]);

  const rootEventId = rootEvent?.id ?? eventId;
  const rootEventName = rootEvent?.name ?? "Hauptevent";

  const eventNameById = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {
      [rootEventId]: rootEventName,
    };

    if (!subEvents) {
      return map;
    }

    for (const child of subEvents) {
      map[child.id] = child.name;
    }

    return map;
  }, [subEvents, rootEventId, rootEventName]);

  const selectedInvitedByOptions = useMemo(() => {
    return [...(fullEventTree?.rootEvent?.settings?.invitedByOptions ?? [])].sort();
  }, [fullEventTree?.rootEvent?.settings?.invitedByOptions]);

  const invitationById = useMemo(() => {
    const map = new Map<string, GetGlobalEventInvitationListQuery["getFullByEventIds"][number]>();

    if (!globalEventInvitationList) {
      return map;
    }

    for (const invitation of globalEventInvitationList) {
      map.set(invitation.id, invitation);
    }

    return map;
  }, [globalEventInvitationList]);

  const bulkApproveInvitationList = useMemo(() => {
    const effectiveIds = bulkApproveIds ?? [];
    if (effectiveIds.length === 0) {
      return [];
    }

    return effectiveIds
      .map((id) => invitationById.get(id))
      .filter((invitation): invitation is NonNullable<typeof invitation> => Boolean(invitation));
  }, [bulkApproveIds, invitationById]);

  const selectedInvitations = useMemo(
    () => selected.map((id) => invitationById.get(id)).filter((invitation) => invitation != null),
    [invitationById, selected],
  );
  const stageableSelectedIds = useMemo(
    () =>
      selectedInvitations
        .filter((invitation) => isStageableInvitationStatus(invitation.status))
        .map((invitation) => invitation.id),
    [selectedInvitations],
  );
  const finalizableSelectedIds = useMemo(
    () =>
      selectedInvitations
        .filter((invitation) => isFinalizableInvitationStatus(invitation.status))
        .map((invitation) => invitation.id),
    [selectedInvitations],
  );

  /* -----------------------------------------------------------------------
   * Filtering
   * --------------------------------------------------------------------- */
  const filteredInvitations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!globalEventInvitationList) {
      return [];
    }

    return globalEventInvitationList.filter((invitation) => {
      if (eventFilter && invitation.eventId !== eventFilter) {
        return false;
      }

      if (typeFilter && invitation.type !== typeFilter) {
        return false;
      }

      if (statusFilter && invitation.status !== statusFilter) {
        return false;
      }

      if (selectedInvitedByFilter) {
        const invSelected = invitation.selectedInvitedBy ?? [];
        if (!invSelected.includes(selectedInvitedByFilter)) {
          return false;
        }
      }

      if (normalizedSearch) {
        const fullName = `${invitation.firstName ?? ""} ${invitation.lastName ?? ""}`.toLowerCase();

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
  }, [
    eventFilter,
    globalEventInvitationList,
    search,
    statusFilter,
    typeFilter,
    selectedInvitedByFilter,
  ]);

  /* -----------------------------------------------------------------------
   * Internal Seat Loader
   * --------------------------------------------------------------------- */
  function mapSeatOptions(seats: SeatListQuery["seats"]): SeatOption[] {
    return seats.map((seat) => ({
      ...seat,
      id: seat.id,
      label: `${seat.section.name} • ${seat.table?.name ?? "—"} • ${seat.number ?? "—"}`,
    }));
  }

  async function ensureSeatsLoaded(targetEventId: string): Promise<SeatOption[]> {
    if (seatOptionsByEventId[targetEventId]) {
      return seatOptionsByEventId[targetEventId];
    }

    const result = await loadSeatList({
      variables: {
        eventId: targetEventId,
      },
    });

    const seats = result.data?.seats ?? [];

    const mapped = mapSeatOptions(seats);

    setSeatOptionsByEventId((prev) => ({
      ...prev,
      [targetEventId]: mapped,
    }));

    return mapped;
  }

  async function refreshSeats(targetEventIds: string[]) {
    await Promise.all(
      [...new Set(targetEventIds)].map(async (targetEventId) => {
        const result = await refetchSeatList({ eventId: targetEventId });
        setSeatOptionsByEventId((prev) => ({
          ...prev,
          [targetEventId]: mapSeatOptions(result.data?.seats ?? []),
        }));
      }),
    );
  }

  /* -----------------------------------------------------------------------
   * General Actions
   * --------------------------------------------------------------------- */
  function toggleSelect(id: string) {
    setSelected((prev) => toggleInvitationSelection(prev, id));
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
      setSendingBulk(true);
      const selectedInvitations =
        globalEventInvitationList?.filter((invitation) => ids.includes(invitation.id)) ?? [];

      if (selectedInvitations.length === 0) {
        throw new Error("No invitations selected");
      }

      const guests = selectedInvitations.map((invitation) => {
        const eventNameResolved = eventNameById[invitation.eventId] ?? rootEventName;

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

      //TODO optimieren
      // await refetch();
    } catch (err) {
      logger.error("Bulk send failed", err);
      throw err;
    } finally {
      setSendingBulk(false);
    }
  }

  /* -----------------------------------------------------------------------
   * Bulk Approve Dialog Actions
   * --------------------------------------------------------------------- */
  async function openBulkApproveDialog(ids: string[], mode: ApprovalDialogMode = "stage") {
    const selectedInvitations = globalEventInvitationList?.filter((invitation) =>
      ids.includes(invitation.id),
    );

    if (!selectedInvitations || selectedInvitations?.length === 0) {
      throw new Error("No invitations selected");
    }

    const uniqueEventIds = Array.from(
      new Set(selectedInvitations.map((invitation) => invitation.eventId)),
    );
    const loadedSeats = await Promise.all(
      uniqueEventIds.map((targetEventId) => ensureSeatsLoaded(targetEventId)),
    );
    const seats = loadedSeats.flat();
    const defaults: Record<string, BulkApproveEntry> = {};

    for (const invitation of selectedInvitations) {
      const currentSeatId = seats.find((seat) => seat.invitationId === invitation.id)?.id ?? null;
      defaults[invitation.id] = {
        invitationId: invitation.id,
        eventId: invitation.eventId,
        seatId: currentSeatId,
        originalSeatId: currentSeatId,
      };
    }

    setApprovalDialogMode(mode);
    setBulkApproveIds(ids);
    setBulkApproveEntries(defaults);
    setApproveOpen(true);
  }

  function closeBulkApproveDialog() {
    setApproveOpen(false);
    setBulkApproveIds(null);
    setBulkApproveEntries({});
  }

  function setBulkApproveSeat(invitationId: string, seatId: string | null) {
    setBulkApproveEntries((prev) => {
      const existing = prev[invitationId];

      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [invitationId]: {
          ...existing,
          seatId,
        },
      };
    });
  }

  async function persistSeatChoices(effectiveIds: string[]) {
    for (const invitationId of effectiveIds) {
      const entry = bulkApproveEntries[invitationId];
      if (!entry || entry.seatId === entry.originalSeatId) continue;

      if (!entry.seatId && entry.originalSeatId) {
        await assignSeatMutation({
          variables: {
            input: { seatId: entry.originalSeatId, guestId: null, invitationId: null, note: null },
          },
        });
      }
      if (entry.seatId) {
        await assignSeatMutation({
          variables: {
            input: { seatId: entry.seatId, guestId: null, invitationId, note: null },
          },
        });
      }
    }
  }

  async function submitApprovalDialog(ids?: string[]) {
    const effectiveIds = ids ?? bulkApproveIds ?? [];
    const affectedEventIds = effectiveIds
      .map((invitationId) => bulkApproveEntries[invitationId]?.eventId)
      .filter((targetEventId): targetEventId is string => Boolean(targetEventId));

    try {
      if (effectiveIds.length === 0) {
        throw new Error("No invitations selected");
      }

      await persistSeatChoices(effectiveIds);

      await dispatchApprovalMutation(approvalDialogMode, effectiveIds, bulkApproveEntries, {
        stage: (input) => bulkStageMutation({ variables: { input } }),
        approve: (input) => bulkApproveMutation({ variables: { input } }),
      });

      await globalEventInvitationListRefetch();
      await refreshSeats(affectedEventIds);

      setApproveOpen(false);
      setBulkApproveIds(null);
      setBulkApproveEntries({});
      setSelected([]);
    } catch (err) {
      await Promise.allSettled([
        globalEventInvitationListRefetch(),
        refreshSeats(affectedEventIds),
      ]);
      logger.error("Approval workflow failed", err);
      throw err;
    }
  }

  /* -----------------------------------------------------------------------
   * Generic Helpers
   * --------------------------------------------------------------------- */
  async function reload() {
    // TODO optimieren
    await globalEventInvitationListRefetch();
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

    const res = await fetch(`${env.INVITATION_API}/upload`, {
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

    const res = await fetch(`${env.INVITATION_API}/preview`, {
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
      const result = await importInvitationsMutation({
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
    setUploadType("csv");
    setPreview(null);
    setImportProgress(0);
  }

  /* -----------------------------------------------------------------------
   * Return
   * --------------------------------------------------------------------- */
  return {
    eventId,
    events: subEvents,
    invitations: filteredInvitations,
    loading: globalEventInvitationListLoading || fullEventTreeLoading,
    canApprove,

    /* filters */
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    eventFilter,
    setEventFilter,
    selectedInvitedByFilter,
    setSelectedInvitedByFilter,

    /* event */
    rootEventId,
    rootEventName,
    subEvents,
    allEventOptions,
    eventNameById,
    selectedInvitedByOptions,

    /* selection */
    selected,
    stageableSelectedIds,
    finalizableSelectedIds,
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
    approveInvitationMutation,
    deleteInvitationMutation,
    importInvitationsMutation,
    createInvitationMutation,

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
    approvalDialogMode,
    bulkApproveEntries,
    bulkApproveInvitationList,
    seatOptionsByEventId,
    openBulkApproveDialog,
    closeBulkApproveDialog,
    setBulkApproveSeat,
    submitApprovalDialog,
    approvalMutationLoading: bulkApproveMutationLoading || bulkStageMutationLoading,

    /* data */
    reload,

    /* inbox */
    createdUsers,
    unreadCount,
    resetUserInbox,
    addCreatedUser,
  };
}

export type InvitationLogic = ReturnType<typeof useInvitationLogic>;
