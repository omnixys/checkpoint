import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { Template } from "./template.type";

export type GetInvitationTemplatesResult = {
  invitationTemplates: Template[];
  error?: GatewayGraphQLError;
};
