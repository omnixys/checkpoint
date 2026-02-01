export type MarkAsReadResult = {
  notificationId: string;
};

/* ---------------------------------------------
 * BULK SEND
 * ------------------------------------------- */
export type BulkSendInvitationsRequest = {
  input: {
    invitationIds: string[];
    templateId: string;
  };
};

export type BulkSendInvitationsResult = {
  bulkSendInvitations: {
    total: number;
    sent: number;
    skipped: number;
  };
};