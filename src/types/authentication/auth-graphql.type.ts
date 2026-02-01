import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import {
  ChangeMyPasswordInput,
  GuestSignUpInput,
  LoginInput,
  UpdateMyProfileInput,
  UserSignUpInput,
} from "./auth-input.type";
import { GuestSigupPayload } from "./auth-payload.type";
import { AuthToken } from "./auth.type";

export type UserSignUpResult = {
  userSignUp: AuthToken;
  error?: GatewayGraphQLError;
};

export type UserSignUpRequest = {
  input: UserSignUpInput;
};

export type GuestSignUpResult = {
  guestSignUp: GuestSigupPayload;
  error?: GatewayGraphQLError;
};

export type GuestSignInRequest = {
  input: GuestSignUpInput;
};

export type LoginResult = {
  login: AuthToken;
  error?: GatewayGraphQLError;
};

export type LoginRequest = {
  input: LoginInput;
};

export type RefreshResult = {
  refresh: AuthToken;
  error?: GatewayGraphQLError;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type ChangeMyPasswordResult = {
  changeMyPassword: { ok: string; message: string };
  error?: GatewayGraphQLError;
};

export type ChangeMyPasswordRequest = {
  input: ChangeMyPasswordInput;
};

export type UpdateMyProfileResult = {
  updateMyProfile: { ok: string; message: string };
  error?: GatewayGraphQLError;
};

export type UpdateMyProfileRequest = {
  input: UpdateMyProfileInput;
};
