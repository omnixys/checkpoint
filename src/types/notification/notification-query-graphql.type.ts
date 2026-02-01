import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { Notification } from "./notification.type";

export type MyNotificationResult = {
  myNotifications: Notification[];
  error?: GatewayGraphQLError;
};

export type ArchiveNotificationResult = {
  myNotifications: Notification[];
  error?: GatewayGraphQLError;
};
