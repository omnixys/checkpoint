import { gql } from "@apollo/client";

export const GET_SECURITY_QUESTIONS = gql`
  query GetSecurityVerificationQuestions {
    getSecurityVerificationQuestions {
      id
      question
    }
  }
`;

export const VERIFY_SECURITY_QUESTIONS = gql`
  mutation VerifySecurityQuestionsAndResetPassword(
    $answers: [VerifySecurityQuestionInput!]!
  ) {
    verifySecurityQuestionsAndResetPassword(answers: $answers) {
      success
      userId
      lockedUntil
    }
  }
`;


export const ADMIN_CHANGE_PASSWORD = gql`
  mutation AdminChangePassword($input: UpdateUserPasswordInput!) {
    adminChangePassword(input: $input)
  }
`;
