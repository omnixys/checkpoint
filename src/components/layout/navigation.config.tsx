import {
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
  Chat as ChatIcon,
  ConfirmationNumberOutlined as ConfirmationNumberOutlinedIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  EventSeat as EventSeatIcon,
  Groups as GroupsIcon,
  Home as HomeIcon,
  MailOutlined as MailOutlineIcon,
  Notifications as NotificationsIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";
import type { JSX } from "react";
import type { UserRoleType } from "@/checkpoint/generated/graphql";
import { env } from "@/checkpoint/lib/env";
import {
  EventPermissionKey,
  type EventPermissionKey as EventPermissionKeyType,
  hasEveryPermission,
  permissionsForLegacyRole,
} from "@/checkpoint/lib/rbac/event-permissions";

const basePath = env.CHECKPOINT_BASE_PATH;

export interface NavItem {
  label: string;
  icon: JSX.Element;
  path: string;
  tourId?: string;
  disabled?: boolean;
  requiredPermissions?: EventPermissionKeyType[];
}

type TFunction = (key: any) => string;

export function createNavigation(
  role: UserRoleType,
  t: TFunction,
  activeEventId?: string,
  permissions: readonly string[] = permissionsForLegacyRole(role),
): NavItem[] {
  const hasEvent = Boolean(activeEventId);

  const allItems: NavItem[] = [
    {
      label: t("sidebar.home"),
      icon: <DashboardIcon />,
      path: `${basePath}`,
      tourId: "sidebar.home",
    },
    {
      label: t("sidebar.notifications"),
      icon: <NotificationsIcon />,
      path: `${basePath}event/${activeEventId}/notification`,
      disabled: !hasEvent,
      tourId: "sidebar.notifications",
      requiredPermissions: [EventPermissionKey.ViewNotifications],
    },
    {
      label: t("sidebar.support"),
      icon: <ChatIcon />,
      path: `${basePath}event/${activeEventId}/support`,
      disabled: !hasEvent,
      tourId: "sidebar.support",
      requiredPermissions: [EventPermissionKey.ViewSupport],
    },
    {
      label: t("sidebar.scanner"),
      icon: <QrCodeScannerIcon />,
      path: `${basePath}scan`,
      tourId: "sidebar.scanner",
      requiredPermissions: [EventPermissionKey.ScanTickets],
    },
    {
      label: t("sidebar.activeEvent"),
      icon: <EventIcon />,
      path: `${basePath}event/${activeEventId}`,
      disabled: !hasEvent,
      tourId: "sidebar.event",
      requiredPermissions: [EventPermissionKey.ViewEvent],
    },
    {
      label: t("sidebar.invitations"),
      icon: <MailOutlineIcon />,
      path: `${basePath}event/${activeEventId}/invitation`,
      disabled: !hasEvent,
      tourId: "sidebar.invitations",
      requiredPermissions: [EventPermissionKey.ViewInvitations],
    },
    {
      label: t("sidebar.seats"),
      icon: <EventSeatIcon />,
      path: `${basePath}event/${activeEventId}/seat`,
      disabled: !hasEvent,
      tourId: "sidebar.seats",
      requiredPermissions: [EventPermissionKey.ViewSeats],
    },
    {
      label: t("sidebar.guests"),
      icon: <GroupsIcon />,
      path: `${basePath}event/${activeEventId}/guest`,
      disabled: !hasEvent,
      tourId: "sidebar.guests",
      requiredPermissions: [EventPermissionKey.ViewGuests],
    },
    {
      label: t("sidebar.tickets"),
      icon: <ConfirmationNumberOutlinedIcon />,
      path: `${basePath}event/${activeEventId}/ticket`,
      disabled: !hasEvent,
      tourId: "sidebar.tickets",
      requiredPermissions: [EventPermissionKey.ViewTickets],
    },
    {
      label: t("sidebar.profile"),
      icon: <AccountCircleIcon />,
      path: `${basePath}me`,
      tourId: "sidebar.profile",
    },
    {
      label: t("sidebar.home"),
      icon: <HomeIcon />,
      path: `${basePath}`,
      tourId: "sidebar.home",
    },
    {
      label: t("sidebar.myTicket"),
      icon: <BadgeIcon />,
      path: `${basePath}me/my-qr`,
      tourId: "sidebar.myTicket",
      requiredPermissions: [EventPermissionKey.ViewSelfTicket],
    },
    {
      label: t("sidebar.mySeat"),
      icon: <EventSeatIcon />,
      path: `${basePath}me/my-seat`,
      tourId: "sidebar.mySeat",
      requiredPermissions: [EventPermissionKey.ViewSelfSeat],
    },
    {
      label: t("sidebar.plusOnes"),
      icon: <GroupsIcon />,
      path: `${basePath}me/my-plus-ones`,
      tourId: "sidebar.plusOnes",
      requiredPermissions: [EventPermissionKey.ManageSelfPlusOnes],
    },
    {
      label: t("sidebar.profile"),
      icon: <AccountCircleIcon />,
      path: `${basePath}me`,
      tourId: "sidebar.profile",
    },
  ];

  const seen = new Set<string>();
  return allItems.filter((item) => {
    if (seen.has(item.path)) {
      return false;
    }
    seen.add(item.path);
    return hasEveryPermission(permissions, item.requiredPermissions);
  });
}
