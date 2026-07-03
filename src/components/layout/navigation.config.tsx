import {
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
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

const basePath = env.CHECKPOINT_BASE_PATH;

export interface NavItem {
  label: string;
  icon: JSX.Element;
  path: string;
  tourId?: string;
  disabled?: boolean;
}

type TFunction = (key: any) => string;

export function createNavigation(
  role: UserRoleType,
  t: TFunction,
  activeEventId?: string,
): NavItem[] {
  const hasEvent = Boolean(activeEventId);

  const Nav: Record<UserRoleType, NavItem[]> = {
    ADMIN: [
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
      },
      {
        label: t("sidebar.scanner"),
        icon: <QrCodeScannerIcon />,
        path: `${basePath}scan`,
        tourId: "sidebar.scanner",
      },
      {
        label: t("sidebar.activeEvent"),
        icon: <EventIcon />,
        path: `${basePath}event/${activeEventId}`,
        disabled: !hasEvent,
        tourId: "sidebar.event",
      },
      {
        label: t("sidebar.invitations"),
        icon: <MailOutlineIcon />,
        path: `${basePath}event/${activeEventId}/invitation`,
        disabled: !hasEvent,
        tourId: "sidebar.invitations",
      },
      {
        label: t("sidebar.seats"),
        icon: <EventSeatIcon />,
        path: `${basePath}event/${activeEventId}/seat`,
        disabled: !hasEvent,
        tourId: "sidebar.seats",
      },
      {
        label: t("sidebar.guests"),
        icon: <GroupsIcon />,
        path: `${basePath}event/${activeEventId}/guest`,
        disabled: !hasEvent,
        tourId: "sidebar.guests",
      },
      {
        label: t("sidebar.tickets"),
        icon: <ConfirmationNumberOutlinedIcon />,
        path: `${basePath}event/${activeEventId}/ticket`,
        disabled: !hasEvent,
        tourId: "sidebar.tickets",
      },
      {
        label: t("sidebar.profile"),
        icon: <AccountCircleIcon />,
        path: `${basePath}me`,
        tourId: "sidebar.profile",
      },
    ],

    SECURITY: [
      {
        label: t("sidebar.home"),
        icon: <DashboardIcon />,
        path: `${basePath}`,
        tourId: "sidebar.home",
      },
      {
        label: t("sidebar.scanner"),
        icon: <QrCodeScannerIcon />,
        path: `${basePath}scan`,
        tourId: "sidebar.scanner",
      },
      {
        label: t("sidebar.guests"),
        icon: <GroupsIcon />,
        path: `${basePath}event/${activeEventId}/guest`,
        disabled: !hasEvent,
        tourId: "sidebar.guests",
      },
      {
        label: t("sidebar.profile"),
        icon: <AccountCircleIcon />,
        path: `${basePath}me`,
        tourId: "sidebar.profile",
      },
    ],

    GUEST: [
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
      },
      {
        label: t("sidebar.mySeat"),
        icon: <EventSeatIcon />,
        path: `${basePath}me/my-seat`,
        tourId: "sidebar.mySeat",
      },
      {
        label: t("sidebar.plusOnes"),
        icon: <GroupsIcon />,
        path: `${basePath}me/my-plus-ones`,
        tourId: "sidebar.plusOnes",
      },
      {
        label: t("sidebar.profile"),
        icon: <AccountCircleIcon />,
        path: `${basePath}me`,
        tourId: "sidebar.profile",
      },
    ],
  };

  return Nav[role];
}
