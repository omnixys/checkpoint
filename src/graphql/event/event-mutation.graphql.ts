import { gql } from '@apollo/client';

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      allowReEntry
      createdAt
      endsAt
      id
      maxSeats
      name
      rotateSeconds
      startsAt
      updatedAt
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) 
  }
`;

