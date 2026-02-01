import { gql } from "@apollo/client";

export const GET_TICKET_BY_ID = gql/* GraphQL */ `
  query TicketById($ticketId: ID!) {
    ticketById(id: $ticketId) {
      id
      eventId
      invitationId
      seatId
      guestProfileId
      deviceHash
      devicePublicKey
      deviceActivationAt
      deviceActivationIP
      lastNonce
      nextNonce
      rotationSeconds
      lastRotatedAt
      currentState
      checkedInAt
      revoked
      createdAt
      updatedAt
    }
  }
`;

export const GET_TICKET_BY_ID_2 = gql/* GraphQL */ `
  query TicketById($ticketId: ID!) {
    ticketById2(id: $ticketId) {
      id
      eventId
      invitationId
      seatId
      guestProfileId
      deviceHash
      devicePublicKey
      deviceActivationAt
      deviceActivationIP
      lastNonce
      nextNonce
      rotationSeconds
      lastRotatedAt
      currentState
      revoked
      createdAt
      updatedAt
    }
  }
`;

export const GET_TICKETS_BY_EVENT = gql/* GraphQL */ `
  query GetTicketsByEvent($eventId: ID!) {
    ticketsByEvent(eventId: $eventId) {
      id
      eventId
      invitationId
      guestProfileId
      seatId
      currentState
      revoked
      createdAt
      updatedAt
      deviceHash
      devicePublicKey
      deviceActivationAt
      deviceActivationIP
      lastNonce
      nextNonce
      checkedInAt
      rotationSeconds
      lastRotatedAt
    }
  }
`;

export const GET_MY_TICKETS_BY_EVENT = gql/* GraphQL */ `
  query GetMyTickets {
    getMyTickets {
      id
      eventId
      invitationId
      seatId
      guestProfileId
      deviceHash
      devicePublicKey
      deviceActivationAt
      deviceActivationIP
      lastNonce
      nextNonce
      rotationSeconds
      lastRotatedAt
      currentState
      revoked
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_TICKETS = gql/* GraphQL */ `
  query GetMyTickets {
    getMyTickets {
      id
      eventId
      invitationId
      seatId
      guestProfileId
      deviceHash
      devicePublicKey
      deviceActivationAt
      deviceActivationIP
      lastNonce
      nextNonce
      rotationSeconds
      lastRotatedAt
      currentState
      revoked
      createdAt
      updatedAt
    }
  }
`;