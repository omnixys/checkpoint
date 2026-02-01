export enum Channel {
  IN_APP = "IN_APP",
  PUSH = "PUSH",
  EMAIL = "EMAIL",
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
}

export enum Priority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SENT = "SENT",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  ARCHIVED = "ARCHIVED",
}

export enum DeliveryAttemptStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum Category {
  WHATSAPP = "WHATSAPP",
  INFO = "INFO",
  WARNING = "WARNING",
}
