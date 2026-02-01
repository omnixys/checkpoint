import { gql } from "@apollo/client";

export const MY_NOTIFICATIONS = gql`
  query MyNotifications {
    myNotifications {
      recipientUsername
      recipientId
      channel
      priority
      status
      renderedTitle
      renderedBody
      linkUrl
      read
      createdAt
      id
    }
  }
`;

/* ---------------------------------------------------------------------------
 * GET_INVITATION_TEMPLATES
 * Returns all available invitation templates for bulk send
 * ------------------------------------------------------------------------- */
export const GET_INVITATION_TEMPLATES = gql`
  query InvitationTemplates {
    invitationTemplates {
      id
      key
      channel
      locale
      title
      body
      variables
      category
      isActive
      version
      tags
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTIFICATION_BY_ID = gql`
  query NotificationById($id: ID!) {
    notification(id: $id) {
      id
      recipientUsername
      recipientId
      channel
      priority
      status
      renderedTitle
      renderedBody
      linkUrl
      read
      createdAt
    }
  }
`;