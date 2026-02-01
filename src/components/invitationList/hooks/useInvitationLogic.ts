"use client";

import {
  APPROVE_INVITATION,
  BULK_APPROVE_AND_CREATE_TICKETS,
  BULK_APPROVE_INVITATIONS,
  BULK_SEND_INVITATIONS,
  CREATE_INVITATION,
  IMPORT_INVITATIONS,
  REMOVE_INVITATION,
} from "@/components/../graphql/invitation/invitation.mutation";
import { GET_INVITATION_BY_EVENT } from "@/components/../graphql/invitation/invitation.query";
import { USER_SIGNED_UP_SUB } from "@/components/../graphql/invitation/invitation.subscription";
import {
  ApproveRequest,
  ApproveResult,
  BulkApproveWithTicketRequest,
  BulkApproveWithTicketResult,
  CreateInvitationRequest,
  CreateInvitationResult,
  ImportInvitationRequest,
  ImportInvitationResult,
} from "@/components/../types/invitation/invitation-mutation.graphql.type";
import {
  GetInvitationByEventRequest,
  GetInvitationByEventResult,
} from "@/components/../types/invitation/invitation-query.graphql.type";
import { UserSignedUpResult } from "@/components/../types/invitation/invitation-subscription.graphql.type";
import { Invitation } from "@/components/../types/invitation/invitation.type";
import {
  BulkSendInvitationsRequest,
  BulkSendInvitationsResult,
} from "@/components/../types/notification/notification-mutation-graphql.type";
import { getLogger } from "@/components/../utils/logger";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useMemo, useState } from "react";

export type MutationFn<TVariables> = (options?: {
  variables?: TVariables;
}) => any;

type ExtractMutationFn<T> = T extends [infer FN, any] ? FN : never;

export type CreateInvitationFn = ExtractMutationFn<
  ReturnType<
    typeof useMutation<CreateInvitationResult, CreateInvitationRequest>
  >
>;

export type ApproveInvitationFn = ExtractMutationFn<
  ReturnType<typeof useMutation<ApproveResult, ApproveRequest>>
>;

export type DeleteInvitationFn = ExtractMutationFn<
  ReturnType<typeof useMutation<any, any>>
>;

export type BulkApproveFn = ExtractMutationFn<
  ReturnType<typeof useMutation<any, any>>
>;

export type ImportInvitationsFn = ExtractMutationFn<
  ReturnType<
    typeof useMutation<ImportInvitationResult, ImportInvitationRequest>
  >
>;

export type BulkApproveWithTicketFn = ExtractMutationFn<
  ReturnType<
    typeof useMutation<
      BulkApproveWithTicketResult,
      BulkApproveWithTicketRequest
    >
  >
>;

export type BulkSendInvitationsFn = ExtractMutationFn<
  ReturnType<
    typeof useMutation<BulkSendInvitationsResult, BulkSendInvitationsRequest>
  >
>;

// ★ INBOX: Typ für gespeicherte User
export interface UserCreatedEntry {
  invitationId: string;
  username: string;
  password: string;
  timestamp: number;
}

export interface UseInvitationLogicReturn {
  eventId: string;
  uploadId: string | null;
  uploadType: string | null;
  setUploadId: (id: string | null) => void;
  setUploadType: (id: string | null) => void;

  activeInvitation: Invitation | null;
  openInvitation: (inv: Invitation) => void;
  closeInvitation: () => void;

  invitations: GetInvitationByEventResult["eventInvitation"];
  loading: boolean;
  selected: string[];

  search: string;
  setSearch: (v: string) => void;

  statusFilter: string | null;
  setStatusFilter: (v: string | null) => void;

  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;

  importOpen: boolean;
  setImportOpen: (v: boolean) => void;

  createInvitation: CreateInvitationFn;
  approveInvitation: ApproveInvitationFn;
  deleteInvitation: DeleteInvitationFn;
  bulkApprove: BulkApproveFn;
  importInvitations: ImportInvitationsFn;

  toggleSelect: (id: string) => void;
  clearSelection: () => void;

  refetch: () => void | Promise<any>;
  reload: () => void | Promise<any>;

  /* ★ INBOX — neuer Rückgabeteil */
  createdUsers: UserCreatedEntry[];
  unreadCount: number;
  resetUserInbox: () => void;

  bulkApproveAndCreateTickets: BulkApproveWithTicketFn;
  bulkSendInvitations: BulkSendInvitationsFn;

  openBulkSendDialog: (ids: string[]) => void;

  bulkSendIds: string[] | null;
  closeBulkSendDialog: () => void;
}

/* ---------------------------------------------------------------------------
 * Custom Hook managing all state and mutations for Invitations
 * Keeps UI components clean.
 * ------------------------------------------------------------------------- */
export function useInvitationLogic(eventId: string): UseInvitationLogicReturn {
  const logger = getLogger("useInvitationLogic");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<string | null>(null);
  /* SELECTED INVITATION */
  const [activeInvitation, setActiveInvitation] = useState<Invitation | null>(
    null
  );

  const [bulkSendIds, setBulkSendIds] = useState<string[] | null>(null);

  function closeBulkSendDialog() {
    setBulkSendIds(null);
  }

  function openInvitation(inv: Invitation) {
    setActiveInvitation(inv);
  }

  function closeInvitation() {
    setActiveInvitation(null);
  }

  const { data, loading, refetch } = useQuery<
    GetInvitationByEventResult,
    GetInvitationByEventRequest
  >(GET_INVITATION_BY_EVENT, {
    variables: { eventId },
  });

  const invitations = data?.eventInvitation ?? [];

  const [createInvitation] = useMutation<
    CreateInvitationResult,
    CreateInvitationRequest
  >(CREATE_INVITATION);
  const [approveInvitation] = useMutation<ApproveResult, ApproveRequest>(
    APPROVE_INVITATION
  );

  const [deleteInvitation] = useMutation(REMOVE_INVITATION);
  const [bulkApprove] = useMutation(BULK_APPROVE_INVITATIONS);
  const [importInvitations] = useMutation<
    ImportInvitationResult,
    ImportInvitationRequest
  >(IMPORT_INVITATIONS);

  /* -----------------------------------------------------------------------
   * Filtering logic
   * --------------------------------------------------------------------- */
  const filtered = useMemo(() => {
    return invitations
      .filter((inv) =>
        `${inv.firstName} ${inv.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((inv) => (statusFilter ? inv.status === statusFilter : true));
  }, [invitations, search, statusFilter]);

  /* -----------------------------------------------------------------------
   * Bulk selection
   * --------------------------------------------------------------------- */
  function toggleSelect(id: string) {
    setSelected((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id]
    );
  }

  function clearSelection() {
    setSelected([]);
  }

  /* -----------------------------------------------------------------------
   * ★ INBOX — UserCreated State
   * --------------------------------------------------------------------- */
  const [createdUsers, setCreatedUsers] = useState<UserCreatedEntry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  function resetUserInbox() {
    setCreatedUsers([]);
    setUnreadCount(0);
  }

  function addCreatedUser(payload: any) {
    setCreatedUsers((old) => [
      {
        invitationId: payload.invitationId,
        username: payload.username,
        password: payload.password,
        timestamp: Date.now(),
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      ...old,
    ]);

    setUnreadCount((c) => c + 1);
  }

  /* -----------------------------------------------------------------------
   * ★ SUBSCRIPTION: USER_SIGNED_UP
   * --------------------------------------------------------------------- */
  useSubscription<UserSignedUpResult>(USER_SIGNED_UP_SUB, {
    onData: ({ data }) => {
      logger.debug({ data: data.data });
      const event = data.data?.userSignedUp;
      if (!event) return;
      addCreatedUser(event);
    },
  });

  function reload() {
    return refetch();
  }

  function openBulkSendDialog(ids: string[]) {
    setBulkSendIds(ids);
  }

  const [bulkApproveAndCreateTickets] = useMutation<
    BulkApproveWithTicketResult,
    BulkApproveWithTicketRequest
  >(BULK_APPROVE_AND_CREATE_TICKETS);

  const [bulkSendInvitations] = useMutation<
    BulkSendInvitationsResult,
    BulkSendInvitationsRequest
  >(BULK_SEND_INVITATIONS);

  return {
    eventId,
    uploadId,
    uploadType,
    setUploadId,
    setUploadType: setUploadType,

    activeInvitation,
    openInvitation,
    closeInvitation,

    /* Data */
    invitations: filtered,
    loading,
    selected,

    /* Filters */
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    /* Dialogs */
    createOpen,
    setCreateOpen,
    importOpen,
    setImportOpen,

    /* Actions */
    createInvitation,
    approveInvitation,
    deleteInvitation,
    bulkApprove,
    importInvitations,

    toggleSelect,
    clearSelection,

    refetch,
    reload,

    /* ★ INBOX */
    createdUsers,
    unreadCount,
    resetUserInbox,

    bulkApproveAndCreateTickets,
    bulkSendInvitations,
    openBulkSendDialog,
    bulkSendIds,
    closeBulkSendDialog,
  };
}
