import { gql } from "@apollo/client";

export const USER_SIGN_UP = gql`
  mutation SignUp($input: UserSignUpInput!) {
    userSignUp(input: $input) {
      accessToken
      expiresIn
      refreshToken
      refreshExpiresIn
      idToken
      scope
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LogInInput!) {
    login(input: $input) {
      accessToken
      expiresIn
      refreshToken
      refreshExpiresIn
      idToken
      scope
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      ok
    }
  }
`;

export const REFRESH = gql`
  mutation Refresh{
    refresh {
      accessToken
      expiresIn
      refreshToken
      refreshExpiresIn
      idToken
      scope
    }
  }
`;

export const GUEST_SIGN_IN = gql`
  mutation GuestSignUp($input: GuestSignUpInput!) {
    guestSignUp(input: $input) {
      password
      username
      userId
      message
    }
  }
`;

export const CHANGE_MY_PASSWORD = gql`
  mutation ChangeMyPassword($input: ChangeMyPasswordInput!) {
    changeMyPassword(input: $input) {
      ok
      message
    }
  }
`;


export const UPDATE_MY_PROFILE = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      ok
      message
    }
  }
`;