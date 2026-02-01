import { gql } from "@apollo/client";

export const MARK_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId)
}
`;

export const ARCHIVE_NOTIFICATION = gql`
  mutation ArchiveNotification($notificationId: ID!) {
    archiveNotification(notificationId: $notificationId)
}
`;

export const MARK_AS_READ_BULK = gql`
  mutation MarkNotificationsAsReadBulk($notificationIds: [ID!]!) {
    markNotificationsAsReadBulk(notificationIds: $notificationIds)
  }
`;

export const ARCHIVE_BULK = gql`
  mutation ArchiveNotificationsBulk($notificationIds: [ID!]!) {
    archiveNotificationsBulk(notificationIds: $notificationIds)
  }
`;

export const MARK_AS_UN_READ = gql`
  mutation MarkNotificationAsUnread($notificationId: ID!) {
    markNotificationAsUnread(notificationId: $notificationId)
  }
`;

export const MARK_AS_UN_READ_BULK = gql`
  mutation MarkNotificationsAsUnreadBulk($notificationIds: [ID!]!) {
    markNotificationsAsUnreadBulk(notificationIds: $notificationIds)
  }
`;

export const UN_ARCHIVE = gql`
  mutation UnarchiveNotification($notificationId: ID!) {
    unarchiveNotification(notificationId: $notificationId)
  }
`;

export const MARK_AS_UN_ARCHIVE_BULK = gql`
  mutation UnarchiveNotificationsBulk($notificationIds: [ID!]!) {
    unarchiveNotificationsBulk(notificationIds: $notificationIds)
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotificationsBulk($notificationIds: [ID!]!) {
    deleteNotification(notificationIds: $notificationIds)
  }
`;


export const DELETE_NOTIFICATION_BULK = gql`
  mutation DeleteNotificationsBulk($notificationIds: [ID!]!) {
    deleteNotificationsBulk(notificationIds: $notificationIds)
  }
`;

