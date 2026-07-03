import type {
  EmailMessage,
  EmailThread,
  InAppChat,
  InAppMessage,
  NotificationListItem,
  NotificationMessage,
  WhatsAppChat,
  WhatsAppMessage,
} from "../types/notification.models";
import { NotificationChannel } from "../types/notification-channel.enum";

const whatsappChats: WhatsAppChat[] = [
  {
    id: "wa-1",
    channel: NotificationChannel.WHATSAPP,
    chatId: "wa-chat-1",
    contactName: "Sophia Laurent",
    phoneNumber: "+49 151 10000001",
    avatarColor: "#25D366",
    lastMessage: "Please confirm the final guest list for tonight.",
    lastMessageAt: "12:04",
    unreadCount: 3,
    isOnline: true,
    labels: ["VIP", "Event"],
  },
  {
    id: "wa-2",
    channel: NotificationChannel.WHATSAPP,
    chatId: "wa-chat-2",
    contactName: "Marcus Hill",
    phoneNumber: "+49 151 10000002",
    avatarColor: "#1FAA59",
    lastMessage: "Driver will arrive in 15 minutes.",
    lastMessageAt: "11:48",
    unreadCount: 0,
    isOnline: false,
    labels: ["Transport"],
  },
  {
    id: "wa-3",
    channel: NotificationChannel.WHATSAPP,
    chatId: "wa-chat-3",
    contactName: "Avery Collins",
    phoneNumber: "+49 151 10000003",
    avatarColor: "#2ECC71",
    lastMessage: "Can I bring one additional guest?",
    lastMessageAt: "10:57",
    unreadCount: 1,
    isOnline: true,
    labels: ["RSVP"],
  },
  {
    id: "wa-4",
    channel: NotificationChannel.WHATSAPP,
    chatId: "wa-chat-4",
    contactName: "Nina Moreau",
    phoneNumber: "+49 151 10000004",
    avatarColor: "#16A085",
    lastMessage: "The floral arrangement has been approved.",
    lastMessageAt: "09:31",
    unreadCount: 0,
    isOnline: false,
    labels: ["Vendor"],
  },
  {
    id: "wa-5",
    channel: NotificationChannel.WHATSAPP,
    chatId: "wa-chat-5",
    contactName: "Daniel Foster",
    phoneNumber: "+49 151 10000005",
    avatarColor: "#27AE60",
    lastMessage: "Security team is now on-site.",
    lastMessageAt: "08:52",
    unreadCount: 2,
    isOnline: false,
    labels: ["Security"],
  },
];

const inAppChats: InAppChat[] = [
  {
    id: "ia-1",
    channel: NotificationChannel.IN_APP,
    chatId: "ia-chat-1",
    userName: "Enterprise Onboarding",
    handle: "@system/onboarding",
    avatarColor: "#6C5CE7",
    title: "Contract review pending",
    preview: "Legal team requested one final approval before activation.",
    updatedAt: "12:10",
    unreadCount: 2,
    priority: "HIGH",
    status: "OPEN",
  },
  {
    id: "ia-2",
    channel: NotificationChannel.IN_APP,
    chatId: "ia-chat-2",
    userName: "VIP Guest Workflow",
    handle: "@workflow/vip",
    avatarColor: "#8E44AD",
    title: "Profile enrichment completed",
    preview: "Two additional data points were synced successfully.",
    updatedAt: "11:21",
    unreadCount: 0,
    priority: "MEDIUM",
    status: "RESOLVED",
  },
  {
    id: "ia-3",
    channel: NotificationChannel.IN_APP,
    chatId: "ia-chat-3",
    userName: "Support Escalation",
    handle: "@ops/support",
    avatarColor: "#5E35B1",
    title: "Priority escalation raised",
    preview: "A premium customer has requested direct callback support.",
    updatedAt: "10:42",
    unreadCount: 4,
    priority: "HIGH",
    status: "PENDING",
  },
  {
    id: "ia-4",
    channel: NotificationChannel.IN_APP,
    chatId: "ia-chat-4",
    userName: "Design Review",
    handle: "@team/design",
    avatarColor: "#7E57C2",
    title: "New luxury theme prototype",
    preview: "Updated spacing and ambient gradients were published.",
    updatedAt: "09:58",
    unreadCount: 1,
    priority: "LOW",
    status: "OPEN",
  },
  {
    id: "ia-5",
    channel: NotificationChannel.IN_APP,
    chatId: "ia-chat-5",
    userName: "Automation Center",
    handle: "@system/automation",
    avatarColor: "#512DA8",
    title: "Workflow execution completed",
    preview: "Scheduled email dispatch finished without delivery errors.",
    updatedAt: "08:36",
    unreadCount: 0,
    priority: "MEDIUM",
    status: "RESOLVED",
  },
];

const emailThreads: EmailThread[] = [
  {
    id: "em-1",
    channel: NotificationChannel.EMAIL,
    chatId: "em-chat-1",
    subject: "Final Sponsorship Agreement – Signature Required",
    fromName: "Helena Strauss",
    fromEmail: "helena.strauss@strausspartners.com",
    preview: "Please find the final version attached for executive approval.",
    updatedAt: "12:15",
    unreadCount: 1,
    hasAttachment: true,
    category: "Contracts",
  },
  {
    id: "em-2",
    channel: NotificationChannel.EMAIL,
    chatId: "em-chat-2",
    subject: "Board Dinner Seating Proposal",
    fromName: "Office of the Chairman",
    fromEmail: "office@chairman-group.com",
    preview: "We reviewed the proposed arrangement and suggest one adjustment.",
    updatedAt: "11:43",
    unreadCount: 0,
    hasAttachment: false,
    category: "VIP",
  },
  {
    id: "em-3",
    channel: NotificationChannel.EMAIL,
    chatId: "em-chat-3",
    subject: "Quarterly Partnership Review",
    fromName: "Aurora Capital",
    fromEmail: "partnerships@auroracapital.io",
    preview: "Thank you for the meeting. Here is the recap and next steps.",
    updatedAt: "10:18",
    unreadCount: 3,
    hasAttachment: true,
    category: "Business",
  },
  {
    id: "em-4",
    channel: NotificationChannel.EMAIL,
    chatId: "em-chat-4",
    subject: "Updated Venue Insurance Certificate",
    fromName: "Lakeside Grand Hotel",
    fromEmail: "compliance@lakesidegrand.com",
    preview: "Attached is the renewed insurance document for your records.",
    updatedAt: "09:14",
    unreadCount: 0,
    hasAttachment: true,
    category: "Primary",
  },
  {
    id: "em-5",
    channel: NotificationChannel.EMAIL,
    chatId: "em-chat-5",
    subject: "Executive Welcome Pack",
    fromName: "Maison Privé",
    fromEmail: "guest-relations@maisonprive.com",
    preview: "We prepared a luxury welcome experience overview for your guests.",
    updatedAt: "08:22",
    unreadCount: 2,
    hasAttachment: false,
    category: "VIP",
  },
];

const whatsappMessagesByChatId: Record<string, WhatsAppMessage[]> = {
  "wa-chat-1": [
    {
      id: "wa-msg-1",
      channel: NotificationChannel.WHATSAPP,
      direction: "INBOUND",
      body: "Good afternoon. Please confirm the final guest list for tonight.",
      timestamp: "11:57",
      delivered: true,
      seen: true,
    },
    {
      id: "wa-msg-2",
      channel: NotificationChannel.WHATSAPP,
      direction: "OUTBOUND",
      body: "We are doing the final reconciliation now. I will send the confirmed list shortly.",
      timestamp: "12:01",
      delivered: true,
      seen: true,
    },
    {
      id: "wa-msg-3",
      channel: NotificationChannel.WHATSAPP,
      direction: "INBOUND",
      body: "Perfect, thank you. We also need the VIP table update.",
      timestamp: "12:04",
      delivered: true,
      seen: false,
    },
  ],
  "wa-chat-2": [
    {
      id: "wa-msg-4",
      channel: NotificationChannel.WHATSAPP,
      direction: "INBOUND",
      body: "Driver will arrive in 15 minutes.",
      timestamp: "11:48",
      delivered: true,
      seen: true,
    },
    {
      id: "wa-msg-5",
      channel: NotificationChannel.WHATSAPP,
      direction: "OUTBOUND",
      body: "Understood. Please wait at the main reception gate.",
      timestamp: "11:50",
      delivered: true,
      seen: true,
    },
  ],
  "wa-chat-3": [
    {
      id: "wa-msg-6",
      channel: NotificationChannel.WHATSAPP,
      direction: "INBOUND",
      body: "Can I bring one additional guest?",
      timestamp: "10:57",
      delivered: true,
      seen: false,
    },
    {
      id: "wa-msg-7",
      channel: NotificationChannel.WHATSAPP,
      direction: "OUTBOUND",
      body: "Please send the full name. We need to verify capacity first.",
      timestamp: "10:59",
      delivered: true,
      seen: false,
    },
  ],
  "wa-chat-4": [
    {
      id: "wa-msg-8",
      channel: NotificationChannel.WHATSAPP,
      direction: "INBOUND",
      body: "The floral arrangement has been approved.",
      timestamp: "09:31",
      delivered: true,
      seen: true,
    },
  ],
  "wa-chat-5": [
    {
      id: "wa-msg-9",
      channel: NotificationChannel.WHATSAPP,
      direction: "INBOUND",
      body: "Security team is now on-site.",
      timestamp: "08:52",
      delivered: true,
      seen: false,
    },
    {
      id: "wa-msg-10",
      channel: NotificationChannel.WHATSAPP,
      direction: "OUTBOUND",
      body: "Please begin access checkpoint setup and share status once ready.",
      timestamp: "08:54",
      delivered: true,
      seen: false,
    },
  ],
};

const inAppMessagesByChatId: Record<string, InAppMessage[]> = {
  "ia-chat-1": [
    {
      id: "ia-msg-1",
      channel: NotificationChannel.IN_APP,
      actor: "SYSTEM",
      title: "Workflow Created",
      body: "Contract review workflow was created and assigned to legal operations.",
      timestamp: "11:54",
      eventType: "ALERT",
    },
    {
      id: "ia-msg-2",
      channel: NotificationChannel.IN_APP,
      actor: "AGENT",
      title: "Approval Request",
      body: "Legal team requested one final approval before activation.",
      timestamp: "12:10",
      eventType: "COMMENT",
    },
  ],
  "ia-chat-2": [
    {
      id: "ia-msg-3",
      channel: NotificationChannel.IN_APP,
      actor: "SYSTEM",
      title: "Enrichment Completed",
      body: "Two additional data points were synced successfully.",
      timestamp: "11:21",
      eventType: "STATUS_CHANGE",
    },
  ],
  "ia-chat-3": [
    {
      id: "ia-msg-4",
      channel: NotificationChannel.IN_APP,
      actor: "USER",
      title: "Escalation Note",
      body: "A premium customer has requested direct callback support.",
      timestamp: "10:42",
      eventType: "COMMENT",
    },
    {
      id: "ia-msg-5",
      channel: NotificationChannel.IN_APP,
      actor: "SYSTEM",
      title: "Routing Update",
      body: "The request has been routed to Level-2 operations.",
      timestamp: "10:46",
      eventType: "STATUS_CHANGE",
    },
  ],
  "ia-chat-4": [
    {
      id: "ia-msg-6",
      channel: NotificationChannel.IN_APP,
      actor: "AGENT",
      title: "Prototype Published",
      body: "Updated spacing and ambient gradients were published for review.",
      timestamp: "09:58",
      eventType: "INTERNAL_NOTE",
    },
  ],
  "ia-chat-5": [
    {
      id: "ia-msg-7",
      channel: NotificationChannel.IN_APP,
      actor: "SYSTEM",
      title: "Execution Completed",
      body: "Scheduled email dispatch finished without delivery errors.",
      timestamp: "08:36",
      eventType: "ALERT",
    },
  ],
};

const emailMessagesByChatId: Record<string, EmailMessage[]> = {
  "em-chat-1": [
    {
      id: "em-msg-1",
      channel: NotificationChannel.EMAIL,
      fromName: "Helena Strauss",
      fromEmail: "helena.strauss@strausspartners.com",
      toName: "Caleb Gyamfi",
      toEmail: "caleb@omnixys.com",
      subject: "Final Sponsorship Agreement – Signature Required",
      body: "Dear Caleb,\n\nPlease find the final version attached for executive approval. We would appreciate the signed version before 17:00 today.\n\nBest regards,\nHelena",
      timestamp: "12:15",
    },
  ],
  "em-chat-2": [
    {
      id: "em-msg-2",
      channel: NotificationChannel.EMAIL,
      fromName: "Office of the Chairman",
      fromEmail: "office@chairman-group.com",
      toName: "Caleb Gyamfi",
      toEmail: "caleb@omnixys.com",
      subject: "Board Dinner Seating Proposal",
      body: "We reviewed the proposed arrangement and suggest one adjustment for the chairman's table placement.",
      timestamp: "11:43",
    },
  ],
  "em-chat-3": [
    {
      id: "em-msg-3",
      channel: NotificationChannel.EMAIL,
      fromName: "Aurora Capital",
      fromEmail: "partnerships@auroracapital.io",
      toName: "Caleb Gyamfi",
      toEmail: "caleb@omnixys.com",
      subject: "Quarterly Partnership Review",
      body: "Thank you for the meeting. Here is the recap and the proposed next steps for the strategic partnership track.",
      timestamp: "10:18",
    },
  ],
  "em-chat-4": [
    {
      id: "em-msg-4",
      channel: NotificationChannel.EMAIL,
      fromName: "Lakeside Grand Hotel",
      fromEmail: "compliance@lakesidegrand.com",
      toName: "Caleb Gyamfi",
      toEmail: "caleb@omnixys.com",
      subject: "Updated Venue Insurance Certificate",
      body: "Attached is the renewed insurance document for your records and compliance review.",
      timestamp: "09:14",
    },
  ],
  "em-chat-5": [
    {
      id: "em-msg-5",
      channel: NotificationChannel.EMAIL,
      fromName: "Maison Privé",
      fromEmail: "guest-relations@maisonprive.com",
      toName: "Caleb Gyamfi",
      toEmail: "caleb@omnixys.com",
      subject: "Executive Welcome Pack",
      body: "We prepared a luxury welcome experience overview for your guests. Please review the concierge notes and arrival sequencing.",
      timestamp: "08:22",
    },
  ],
};

export function getNotificationItems(channel: NotificationChannel): NotificationListItem[] {
  switch (channel) {
    case NotificationChannel.WHATSAPP:
      return whatsappChats;
    case NotificationChannel.IN_APP:
      return inAppChats;
    case NotificationChannel.EMAIL:
      return emailThreads;
    default:
      return [];
  }
}

export function getNotificationMessages(
  channel: NotificationChannel,
  chatId: string | null,
): NotificationMessage[] {
  if (!chatId) {
    return [];
  }

  switch (channel) {
    case NotificationChannel.WHATSAPP:
      return whatsappMessagesByChatId[chatId] ?? [];
    case NotificationChannel.IN_APP:
      return inAppMessagesByChatId[chatId] ?? [];
    case NotificationChannel.EMAIL:
      return emailMessagesByChatId[chatId] ?? [];
    default:
      return [];
  }
}
