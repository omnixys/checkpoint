export type UserSignedUpPayload = {
  password: string;
  userId: string;
  username: string;
  invitationId: string;
  lastName: string;
  firstName: string;
}

export type InvitationImportPayload = {
    imported: number;
    errors: number;
    total: number;
    skipped: string[];
    duplicates: string[];
  }