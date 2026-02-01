import { gql } from "@apollo/client";

export const GET_INVITATIONS = gql/* GraphQL */ `
  query Invitations {
    invitations {
      id
      firstName
      lastName
      phoneNumber
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
      plusOnes {
        id
        firstName
        lastName
        status
      }
    }
  }
`;

export const GET_INVITATION_BY_ID = gql/* GraphQL */ `
  query Invitation($invitationId: ID!) {
    invitation(id: $invitationId) {
      id
      firstName
      lastName
      eventId
      phoneNumber
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
      plusOnes {
        id
        firstName
        lastName
        status
      }
    }
  }
`;

export const GET_INVITATION_BY_EVENT = gql`
  query EventInvitation($eventId: ID!) {
    eventInvitation(eventId: $eventId) {
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
      phoneNumber
      rsvpAt
      approved
      approvedByUserId
      approvedAt
      maxInvitees
      invitedByInvitationId
      invitedByUserId
      plusOnes {
        id
        firstName
        lastName
        status
      }
    }
  }
`;

export const GET_PLUS_ONES_BY_INVITATION = gql`
  query GetPlusOnesByInvitation($invitationId: ID!) {
    getPlusOnesByInvitation(invitationId: $invitationId) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      phoneNumber
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
      plusOnes {
        id
        firstName
        lastName
        status
      }
    }
  }
`;




export const GET_INVITATION_BY_GUEST_AND_EVENT = gql`
  query GetPlusOnesByInvitation($invitationId: ID!) {
    getPlusOnesByInvitation(invitationId: $invitationId) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      createdAt
      phoneNumber
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
      plusOnes {
        id
        firstName
        lastName
        status
      }
    }
  }
`;



 
export const GET_TICKET_BY_GUEST_AND_EVENT = gql`
  query GetPlusOnesByInvitation($invitationId: ID!) {
    getPlusOnesByInvitation(invitationId: $invitationId) {
      id
      firstName
      lastName
      eventId
      guestProfileId
      status
      phoneNumber
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
      plusOnes {
        id
        firstName
        lastName
        status
      }
    }
  }
`;