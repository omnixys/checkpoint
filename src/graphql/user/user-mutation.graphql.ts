import { gql } from '@apollo/client';

export const UPDATE_ME = gql`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      id
      username
      firstName
      lastName
      email
      ticketIds
      invitationIds
      createdAt
      updatedAt
    }
  }
`;
