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

export type NotificationListItem = WhatsAppChat | EmailThread;

export interface WhatsAppMessage {
  id: string;
  channel: NotificationChannel.WHATSAPP;
  direction: "INBOUND" | "OUTBOUND";
  body: string;
  timestamp: string;
  delivered: boolean;
  seen: boolean;
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

export type NotificationMessage = WhatsAppMessage | EmailMessage;
