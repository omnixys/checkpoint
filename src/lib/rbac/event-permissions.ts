import type { UserRoleType } from "@/checkpoint/generated/graphql";

export const EventPermissionKey = {
  ViewEvent: "event.view",
  EditEvent: "event.edit",
  DeleteEvent: "event.delete",
  ViewGuests: "guests.view",
  ManageGuests: "guests.manage",
  ApproveGuests: "guests.approve",
  ExportGuests: "guests.export",
  ViewInvitations: "invitations.view",
  ManageInvitations: "invitations.manage",
  ViewSeats: "seats.view",
  ViewSelfSeat: "seats.self.view",
  ManageSeats: "seats.manage",
  ViewTickets: "tickets.view",
  ViewSelfTicket: "tickets.self.view",
  ManageTickets: "tickets.manage",
  ScanTickets: "tickets.scan",
  ManagePlusOnes: "plus_ones.manage",
  ManageSelfPlusOnes: "plus_ones.self.manage",
  ViewAnalytics: "analytics.view",
  ViewSupport: "support.view",
  ManageSupport: "support.manage",
  RespondSupport: "support.respond",
  ViewNotifications: "notifications.view",
  SendNotifications: "notifications.send",
  ViewTimeline: "timeline.view",
  ManageTimeline: "timeline.manage",
  ViewEventSettings: "settings.view",
  ManageEventSettings: "settings.manage",
  ViewRoles: "roles.view",
  ManageRoles: "roles.manage",
  ViewStaff: "staff.view",
  ManageStaff: "staff.manage",
  ViewMedia: "media.view",
  ManageMedia: "media.manage",
  ExportData: "data.export",
  ViewAuditLog: "audit.view",
} as const;

export type EventPermissionKey =
  (typeof EventPermissionKey)[keyof typeof EventPermissionKey];

export const EVENT_PERMISSION_KEYS = Object.values(EventPermissionKey);

const staffViewPermissions = [
  EventPermissionKey.ViewEvent,
  EventPermissionKey.ViewGuests,
  EventPermissionKey.ViewTickets,
  EventPermissionKey.ViewSeats,
  EventPermissionKey.ViewTimeline,
] as const;

const securityPermissions = [
  ...staffViewPermissions,
  EventPermissionKey.ScanTickets,
] as const;

const guestPermissions = [
  EventPermissionKey.ViewEvent,
  EventPermissionKey.ViewSelfTicket,
  EventPermissionKey.ViewSelfSeat,
  EventPermissionKey.ManageSelfPlusOnes,
  EventPermissionKey.ViewTimeline,
] as const;

const supportPermissions = [
  EventPermissionKey.ViewEvent,
  EventPermissionKey.ViewSupport,
  EventPermissionKey.RespondSupport,
  EventPermissionKey.ViewNotifications,
] as const;

export function permissionsForLegacyRole(
  role: UserRoleType | string | null | undefined,
): EventPermissionKey[] {
  switch (role) {
    case "ADMIN":
      return [...EVENT_PERMISSION_KEYS];
    case "SECURITY":
      return [...securityPermissions];
    case "SUPPORT":
      return [...supportPermissions];
    case "GUEST":
      return [...guestPermissions];
    default:
      return [];
  }
}

export function hasEveryPermission(
  actual: readonly string[],
  required: readonly EventPermissionKey[] | undefined,
): boolean {
  if (!required?.length) {
    return true;
  }

  const actualSet = new Set(actual);
  return required.every((permission) => actualSet.has(permission));
}

export function uniquePermissions(permissions: readonly string[]): EventPermissionKey[] {
  const allowed = new Set<string>(EVENT_PERMISSION_KEYS);
  return [...new Set(permissions)].filter((permission): permission is EventPermissionKey =>
    allowed.has(permission),
  );
}
