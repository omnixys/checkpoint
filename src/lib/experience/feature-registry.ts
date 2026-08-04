import {
  AccountCircle as AccountCircleIcon,
  AddCircleOutlineRounded as AddCircleOutlineIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Badge as BadgeIcon,
  CalendarMonth as CalendarMonthIcon,
  Chat as ChatIcon,
  ConfirmationNumberOutlined as ConfirmationNumberOutlinedIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  EventSeat as EventSeatIcon,
  Groups as GroupsIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  ListAlt as ListAltIcon,
  Lock as LockIcon,
  MailOutlined as MailOutlineIcon,
  Map as MapIcon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import type { FeatureDefinition, FeatureId } from "./types";

const FEATURE_REGISTRY: Map<FeatureId, FeatureDefinition> = new Map([
  [
    "event-dashboard",
    {
      id: "event-dashboard",
      category: "event",
      label: "Dashboard",
      description: "Event overview and key metrics",
      icon: DashboardIcon,
      path: "event/{id}",
      requiredPermissions: [EventPermissionKey.ViewEvent],
      tourId: "sidebar.event",
    },
  ],
  [
    "notifications",
    {
      id: "notifications",
      category: "event",
      label: "Notifications",
      description: "Send and manage event notifications",
      icon: NotificationsIcon,
      path: "event/{id}/notification",
      requiredPermissions: [EventPermissionKey.ViewNotifications],
      tourId: "sidebar.notifications",
      disabledWithoutEvent: true,
    },
  ],
  [
    "support",
    {
      id: "support",
      category: "event",
      label: "Support",
      description: "Manage guest support conversations",
      icon: ChatIcon,
      path: "event/{id}/support",
      requiredPermissions: [EventPermissionKey.ViewSupport],
      tourId: "sidebar.support",
      disabledWithoutEvent: true,
    },
  ],
  [
    "guests",
    {
      id: "guests",
      category: "event",
      label: "Guests",
      description: "Manage guest list and approvals",
      icon: GroupsIcon,
      path: "event/{id}/guest",
      requiredPermissions: [EventPermissionKey.ViewGuests],
      tourId: "sidebar.guests",
      disabledWithoutEvent: true,
    },
  ],
  [
    "invitations",
    {
      id: "invitations",
      category: "event",
      label: "Invitations",
      description: "Create and manage event invitations",
      icon: MailOutlineIcon,
      path: "event/{id}/invitation",
      requiredPermissions: [EventPermissionKey.ViewInvitations],
      tourId: "sidebar.invitations",
      disabledWithoutEvent: true,
    },
  ],
  [
    "tickets",
    {
      id: "tickets",
      category: "event",
      label: "Tickets",
      description: "Manage ticket types and allocations",
      icon: ConfirmationNumberOutlinedIcon,
      path: "event/{id}/ticket",
      requiredPermissions: [EventPermissionKey.ViewTickets],
      tourId: "sidebar.tickets",
      disabledWithoutEvent: true,
    },
  ],
  [
    "seats",
    {
      id: "seats",
      category: "event",
      label: "Seats",
      description: "Seating plan and assignments",
      icon: EventSeatIcon,
      path: "event/{id}/seat",
      requiredPermissions: [EventPermissionKey.ViewSeats],
      tourId: "sidebar.seats",
      disabledWithoutEvent: true,
    },
  ],
  [
    "seat-map",
    {
      id: "seat-map",
      category: "event",
      label: "Seat Map",
      description: "Interactive seat map viewer",
      icon: MapIcon,
      path: "event/{id}/seat/map",
      requiredPermissions: [EventPermissionKey.ViewSeats],
      disabledWithoutEvent: true,
    },
  ],
  [
    "security",
    {
      id: "security",
      category: "event",
      label: "Security",
      description: "Security dashboard and monitoring",
      icon: SecurityIcon,
      path: "event/{id}/security",
      requiredPermissions: [EventPermissionKey.ViewGuests],
      disabledWithoutEvent: true,
    },
  ],
  [
    "settings",
    {
      id: "settings",
      category: "event",
      label: "Settings",
      description: "Event configuration and preferences",
      icon: SettingsIcon,
      path: "event/{id}/settings",
      requiredPermissions: [EventPermissionKey.ViewEventSettings],
      disabledWithoutEvent: true,
    },
  ],
  [
    "scans",
    {
      id: "scans",
      category: "event",
      label: "Scan Logs",
      description: "View ticket scan history for this event",
      icon: ListAltIcon,
      path: "event/{id}/scans",
      requiredPermissions: [EventPermissionKey.ScanTickets],
      disabledWithoutEvent: true,
    },
  ],
  [
    "scanner",
    {
      id: "scanner",
      category: "tools",
      label: "Scanner",
      description: "Scan tickets and verify guests",
      icon: QrCodeScannerIcon,
      path: "scan",
      requiredPermissions: [EventPermissionKey.ScanTickets],
      tourId: "sidebar.scanner",
    },
  ],
  [
    "scan-history",
    {
      id: "scan-history",
      category: "tools",
      label: "Scan History",
      description: "View all scan activity across events",
      icon: HistoryIcon,
      path: "scan/history",
      requiredPermissions: [EventPermissionKey.ScanTickets],
    },
  ],
  [
    "calendar",
    {
      id: "calendar",
      category: "tools",
      label: "Calendar",
      description: "Event calendar overview",
      icon: CalendarMonthIcon,
      path: "calendar",
      requiredPermissions: [],
    },
  ],
  [
    "event-list",
    {
      id: "event-list",
      category: "tools",
      label: "My Events",
      description: "Browse and select your events",
      icon: EventIcon,
      path: "event",
      requiredPermissions: [EventPermissionKey.ViewEvent],
    },
  ],
  [
    "create-event",
    {
      id: "create-event",
      category: "tools",
      label: "Create Event",
      description: "Set up a new event",
      icon: AddCircleOutlineIcon,
      path: "event/new",
      requiredPermissions: [EventPermissionKey.EditEvent],
    },
  ],
  [
    "my-dashboard",
    {
      id: "my-dashboard",
      category: "personal",
      label: "Home",
      description: "Your personal dashboard",
      icon: HomeIcon,
      path: "me",
      requiredPermissions: [],
      tourId: "sidebar.home",
    },
  ],
  [
    "my-profile",
    {
      id: "my-profile",
      category: "personal",
      label: "Profile",
      description: "Manage your profile",
      icon: AccountCircleIcon,
      path: "me/profile",
      requiredPermissions: [],
      tourId: "sidebar.profile",
    },
  ],
  [
    "my-security",
    {
      id: "my-security",
      category: "personal",
      label: "Security",
      description: "Password and security settings",
      icon: LockIcon,
      path: "me/security",
      requiredPermissions: [],
    },
  ],
  [
    "my-ticket",
    {
      id: "my-ticket",
      category: "personal",
      label: "My Ticket",
      description: "View your ticket and QR code",
      icon: BadgeIcon,
      path: "me/my-qr",
      requiredPermissions: [EventPermissionKey.ViewSelfTicket],
      tourId: "sidebar.myTicket",
    },
  ],
  [
    "my-seat",
    {
      id: "my-seat",
      category: "personal",
      label: "My Seat",
      description: "View your assigned seat",
      icon: EventSeatIcon,
      path: "me/my-seat",
      requiredPermissions: [EventPermissionKey.ViewSelfSeat],
      tourId: "sidebar.mySeat",
    },
  ],
  [
    "my-plus-ones",
    {
      id: "my-plus-ones",
      category: "personal",
      label: "Plus-Ones",
      description: "Manage your plus-one guests",
      icon: PersonAddIcon,
      path: "me/my-plus-ones",
      requiredPermissions: [EventPermissionKey.ManageSelfPlusOnes],
      tourId: "sidebar.plusOnes",
    },
  ],
  [
    "my-support",
    {
      id: "my-support",
      category: "personal",
      label: "My Support",
      description: "Contact event support",
      icon: SupportAgentIcon,
      path: "me/support",
      requiredPermissions: [],
    },
  ],
  [
    "admin-console",
    {
      id: "admin-console",
      category: "admin",
      label: "Admin Console",
      description: "Platform administration",
      icon: AdminPanelSettingsIcon,
      path: "admin",
      requiredPermissions: [EventPermissionKey.ManageEventSettings],
    },
  ],
]);

export function getFeature(id: FeatureId): FeatureDefinition | undefined {
  return FEATURE_REGISTRY.get(id);
}

export function getFeatures(): FeatureDefinition[] {
  return Array.from(FEATURE_REGISTRY.values());
}

export function getFeaturesByCategory(category: string): FeatureDefinition[] {
  return Array.from(FEATURE_REGISTRY.values()).filter((f) => f.category === category);
}

export function getFeaturesByPermissions(
  permissions: readonly EventPermissionKey[],
): FeatureDefinition[] {
  const permissionSet = new Set(permissions);
  return Array.from(FEATURE_REGISTRY.values()).filter(
    (f) =>
      f.requiredPermissions.length === 0 ||
      f.requiredPermissions.every((p) => permissionSet.has(p)),
  );
}

export function getFeaturesByIds(ids: FeatureId[]): FeatureDefinition[] {
  return ids
    .map((id) => FEATURE_REGISTRY.get(id))
    .filter((f): f is FeatureDefinition => f !== undefined);
}

export const FEATURE_COUNT = FEATURE_REGISTRY.size;
