import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { UpdateMeInput } from "./user-input.type";
import { User } from "./user.type";

export type MeResult = {
  me: User;
  error?: GatewayGraphQLError;
};

export type GetUsersResult = {
  users: User[];
  error?: GatewayGraphQLError;
};

export type GetUserByIdResult = {
  user: User;
  error?: GatewayGraphQLError;
};

export type GetUserByIdRequest = {
  userId: string;
};

export type UpdateMeResult = {
  updateMe: User;
  error?: GatewayGraphQLError;
};

export type UpdateMeRequest = {
  input: UpdateMeInput;
};

export type GetUserListResult = {
  getUserList: User[];
  error?: GatewayGraphQLError;
};

export type GetUserListRequest = {
  guesIdList: string[];
};
