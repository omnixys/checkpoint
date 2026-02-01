import {
  Channel,
  NotificationStatus,
  Priority,
} from "./notification-enum.type";

export type Notification = {
  recipientUsername: string;
  recipientId: string;
  channel: Channel;
  priority: Priority;
  status: NotificationStatus;
  renderedTitle: string;
  renderedBody: string;
  linkUrl: string;
  read: string;
  createdAt: string;
  id: string;
};
