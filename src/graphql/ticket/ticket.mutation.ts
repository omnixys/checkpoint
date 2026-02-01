import { gql } from '@apollo/client';

export const CREATE_TICKET = gql/* GraphQL */ `
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
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
      rotationSeconds
      lastRotatedAt
    }
  }
`;

export const ACTIVATE_DEVICE = gql`
  mutation ActivateDevice($input: ActivateDeviceInput!) {
    activateDevice(input: $input) {
      id
      deviceHash
      devicePublicKey
      deviceActivationAt
      deviceActivationIP
      nextNonce
      currentState
    }
  }
`;

export const CREATE_TOKEN = gql`
  mutation GenerateToken($input: GenerateTokenInput!) {
    generateToken(input: $input)
  }
`;

export const SCAN_TICKET = gql`
  mutation VerifyToken($input: VerifyTokenInput!) {
    verifyToken(input: $input) {
      ticket {
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
      payload {
        tid
        eid
        gid
        sid
        dn
        ts
        dh
      }
      verdict
      valid
      expectedNonce
      receivedNonce
      deviceMatched
    }
  }
`;

export const ROTATE_TOKEN = gql`
  mutation RotateNonce($input: RotateNonceInput!) {
    rotateNonce(input: $input) {
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
export const REVOKE_TICKET = gql`
mutation RevokeTicket($ticketId: ID!, $reason: String) {
    revokeTicket(ticketId: $ticketId, reason: $reason) {
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
