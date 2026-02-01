import { gql } from "@apollo/client";

export const CREATE_INVITATION = gql/* GraphQL */ `
  mutation CreateInvitation($input: InvitationCreateInput!) {
    createInvitation(input: $input) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      pendingContactId
      rsvpChoice
      rsvpAt
      approved
      approvedByUserId
      approvedAt
      maxInvitees
      invitedByInvitationId
      invitedByUserId
      plusOnes
    }
  }
`;

export const APPROVE_INVITATION = gql/* GraphQL */ `
  mutation Approve($input: ApproveInvitationInput!) {
    approveInvitation(input: $input) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      rsvpChoice
      rsvpAt
      approved
      approvedByUserId
      approvedAt
      maxInvitees
      invitedByInvitationId
      invitedByUserId
      plusOnes
      pendingContactId
    }
  }
`;




export const APPROVE_INVITATION_AND_CREATE_TICKET = gql`
  mutation ApproveInvitation($input: ApproveInvitationWithSeatInput!) {
    approveInvitationAndCreateTicket(input: $input) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      pendingContactId
      rsvpChoice
      rsvpAt
      approved
      approvedAt
      approvedByUserId
      maxInvitees
      invitedByInvitationId
      invitedByUserId
    }
  }
`;

export const BULK_APPROVE_AND_CREATE_TICKETS = gql`
  mutation BulkApproveInvitationsAndCreateTickets(
    $input: BulkApproveInvitationWithTicketInput!
  ) {
    bulkApproveInvitationsAndCreateTickets(input: $input) {
      total
      approved
      ticketsCreated
    }
  }
`;

export const BULK_SEND_INVITATIONS = gql`
  mutation BulkSendInvitations($input: BulkSendInvitationsInput!) {
    bulkSendInvitations(input: $input) {
      total
      sent
      skipped
    }
  }
`;


export const REPLY_INVITATION = gql/* GraphQL */ `
  mutation replyInvitation($input: RSVPInput!) {
    replyInvitation(input: $input) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      pendingContactId
      rsvpChoice
      rsvpAt
      approved
      approvedAt
      approvedByUserId
      maxInvitees
      invitedByInvitationId
      invitedByUserId
    }
  }
`;

export const IMPORT_INVITATIONS = gql/* GraphQL */ `
  mutation ImportInvitations($input: ImportInvitationsInput!) {
    importInvitations(input: $input) {
      total
      imported
      skipped
      duplicates
      errors
    }
  }
`;

export const REMOVE_INVITATION = gql/* GraphQL */ `
  mutation RemoveInvitation($id: ID!) {
    removeInvitation(id: $id) {
      ok
      message
    }
  }
`;

export const BULK_APPROVE_INVITATIONS = gql`
  mutation RejectInvitation($id: ID!) {
    rejectInvitation(id: $id) {
      plusOnes
    }
  }
`;

/**
 * CREATE_PLUS_ONES_INVITATION
 * Creates a temporary plusOne entry in Valkey.
 * Not a real invitation until the parent guest is approved.
 */
export const CREATE_PLUS_ONES_INVITATION = gql`
  mutation CreatePlusOnesInvitation($input: InvitationCreateInput!) {
    createPlusOnesInvitation(input: $input) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      pendingContactId
      rsvpChoice
      rsvpAt
      approved
      approvedByUserId
      approvedAt
      maxInvitees
      invitedByInvitationId
      invitedByUserId
    }
  }
`;

/**
 * REMOVE_PLUS_ONE_INVITATION
 * Removes one temporary plusOne entry by ID.
 */
export const REMOVE_PLUS_ONE_INVITATION = gql`
  mutation RemovePlusOneInvitation($id: ID!) {
    removePlusOneInvitation(id: $id) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      pendingContactId
      rsvpChoice
      rsvpAt
      approved
      approvedByUserId
      approvedAt
      maxInvitees
      invitedByInvitationId
      invitedByUserId
    }
  }
`;

/**
 * REMOVE_ALL_PLUS_ONE
 * Cleans ALL temporary plusOnes attached to a parent invitation.
 * Used before accepting RSVP OR resetting the list.
 */
export const REMOVE_ALL_PLUS_ONE = gql`
  mutation RemoveAllPlusOnesByInvitationId($id: ID!) {
    removeAllPlusOnesByInvitationId(invitedByInvitationId: $id) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      updatedAt
      pendingContactId
      rsvpChoice
      rsvpAt
      approved
      approvedByUserId
      approvedAt
      maxInvitees
      invitedByInvitationId
      invitedByUserId
    }
  }
`;


export const UPDATE_USER_PHONE_NUMBERS = gql`
  mutation replyInvitation($input: RSVPInput!) {
    replyInvitation(input: $input) {
      id
      firstName
      lastName
      eventId
      guestProfileId

      status
      maxInvitees
      pendingContactId

      rsvpChoice
      rsvpAt

      approved
      approvedByUserId
      approvedAt

      invitedByInvitationId
      invitedByUserId

      createdAt
      updatedAt
    }
  }
`;