import type { NotificationChannel } from "./notification-channel.enum";

export interface WhatsAppChat {
  id: string;
  channel: NotificationChannel.WHATSAPP;
  chatId: string;
  contactName: string;
  phoneNumber: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isOnline: boolean;
  labels: string[];
}

export interface InAppChat {
  id: string;
  channel: NotificationChannel.IN_APP;
  chatId: string;
  userName: string;
  handle: string;
  avatarColor: string;
  title: string;
  preview: string;
  updatedAt: string;
  unreadCount: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "PENDING" | "RESOLVED";
}

export interface EmailThread {
  id: string;
  channel: NotificationChannel.EMAIL;
  chatId: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  preview: string;
  updatedAt: string;
  unreadCount: number;
  hasAttachment: boolean;
  category: "Primary" | "Business" | "Contracts" | "VIP";
}

export type NotificationListItem = WhatsAppChat | InAppChat | EmailThread;

export interface WhatsAppMessage {
  id: string;
  channel: NotificationChannel.WHATSAPP;
  direction: "INBOUND" | "OUTBOUND";
  body: string;
  timestamp: string;
  delivered: boolean;
  seen: boolean;
}

export interface InAppMessage {
  id: string;
  channel: NotificationChannel.IN_APP;
  actor: "SYSTEM" | "USER" | "AGENT";
  title?: string;
  body: string;
  timestamp: string;
  eventType: "COMMENT" | "STATUS_CHANGE" | "INTERNAL_NOTE" | "ALERT";
}

export interface EmailMessage {
  id: string;
  channel: NotificationChannel.EMAIL;
  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;
  body: string;
  timestamp: string;
  subject: string;
}

export type NotificationMessage = WhatsAppMessage | InAppMessage | EmailMessage;
