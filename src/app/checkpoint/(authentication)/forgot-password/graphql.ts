import { gql } from "@apollo/client";

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($input: SendPasswordResetInput!) {
    sendPasswordResetEmail(input: $input)
  }
`;
