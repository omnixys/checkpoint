import { gql } from "@apollo/client";

export const USER_SIGNED_UP_SUB = gql`
  subscription UserSignedUp {
    userSignedUp {
      password
      userId
      username
      invitationId
      lastName
      firstName
    }
  }
`;
