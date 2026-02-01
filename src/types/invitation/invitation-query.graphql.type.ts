import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { Invitation } from "./invitation.type";

export type GetPlusOnesByInvitationResult = {
  getPlusOnesByInvitation: Invitation[];
  error?: GatewayGraphQLError;
};

export type GetPlusOnesByInvitationRequest = {
  invitationId: string;
};

export type GetInvitationByEventResult = {
  eventInvitation: Invitation[];
  error?: GatewayGraphQLError;
};

export type GetInvitationByEventRequest = {
  eventId: string;
};

export type GetInvitationByIdResult = {
  invitation: Invitation;
  error?: GatewayGraphQLError;
};

export type GetInvitationByIdRequest = {
  invitationId: string;
};
