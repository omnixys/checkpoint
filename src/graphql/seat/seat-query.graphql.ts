import { gql } from "@apollo/client";

export const GET_SEATS_BY_EVENT = gql`
  query EventSeats($eventId: ID!) {
    seats(eventId: $eventId) {
      id
      invitationId
      eventId
      status
      number
      note
      guestId
      section {
        name
        id
      }
      table {
        name
        id
      }
    }
  }
`;

export const GET_GUEST_SEAT_BY_EVENT = gql`
  query GetSeatByGuestAndEvent($input: GuestEventSeatInput!) {
    getSeatByGuestAndEvent(input: $input) {
      id
    
      invitationId
      eventId
      section {
        name
        id
      }
      table {
        name
        id
      }
      number
      note
      guestId
    }
  }
`;


export const GET_SEAT_BY_ID = gql`
  query Seat($seatId: ID!) {
    seat(id: $seatId) {
      id
      status
      eventId
      sectionId
      tableId
      number
      label
      note
      x
      y
      rotation
      seatType
      guestId
      invitationId
      meta
      createdAt
      updatedAt
      section {
        name
        id
      }
      table {
        name
        id
      }
    }
  }
`;


export const GET_SEAT_LIST = gql`
  query GetSeatList($seatIdList: [ID!]!) {
    getSeatList(seatIds: $seatIdList) {
      id
      number
      label
      guestId
      section {
        name
      }
      table {
        name
      }
    }
  }
`;