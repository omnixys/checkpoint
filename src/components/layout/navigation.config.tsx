import { JSX } from "react";
import {
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
  Dashboard as DashboardIcon,
  EventSeat as EventSeatIcon,
  Home as HomeIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Event as EventIcon,
  MailOutlined as MailOutlineIcon,
  Groups as GroupsIcon,
  ConfirmationNumberOutlined as ConfirmationNumberOutlinedIcon,
} from "@mui/icons-material";
import { env } from "@/checkpoint/lib/env";
import { UserRoleType } from "@/checkpoint/generated/graphql";

const basePath = env.CHECKPOINT_BASE_PATH;

export type NavItem = {
  label: string;
  icon: JSX.Element;
  path: string;
  disabled?: boolean;
};

export function createNavigation(role: UserRoleType, activeEventId?: string): NavItem[] {
  const hasEvent = Boolean(activeEventId);

  const NAV: Record<UserRoleType, NavItem[]> = {
    ADMIN: [
      { label: "Home", icon: <DashboardIcon />, path: `${basePath}` },
      {
        label: "Scanner",
        icon: <QrCodeScannerIcon />,
        path: `${basePath}scan`,
      },
      {
        label: "Active Event",
        icon: <EventIcon />,
        path: `${basePath}event/${activeEventId}`,
        disabled: !hasEvent,
      },
      {
        label: "Invitations",
        icon: <MailOutlineIcon />,
        path: `${basePath}event/${activeEventId}/invitation`,
        disabled: !hasEvent,
      },
      {
        label: "Seats",
        icon: <EventSeatIcon />,
        path: `${basePath}event/${activeEventId}/seat`,
        disabled: !hasEvent,
      },
      {
        label: "Guests",
        icon: <GroupsIcon />,
        path: `${basePath}event/${activeEventId}/guest`,
        disabled: !hasEvent,
      },
      {
        label: "Tickets",
        icon: <ConfirmationNumberOutlinedIcon />,
        path: `${basePath}event/${activeEventId}/ticket`,
        disabled: !hasEvent,
      },
      { label: "Profil", icon: <AccountCircleIcon />, path: `${basePath}me` },
    ],

    SECURITY: [
      { label: "Home", icon: <DashboardIcon />, path: `${basePath}` },
      {
        label: "Scanner",
        icon: <QrCodeScannerIcon />,
        path: `${basePath}scan`,
      },
      {
        label: "Guests",
        icon: <GroupsIcon />,
        path: `${basePath}event/${activeEventId}/guest`,
        disabled: !hasEvent,
      },
      { label: "Profil", icon: <AccountCircleIcon />, path: `${basePath}me` },
    ],

    GUEST: [
      { label: "Home", icon: <HomeIcon />, path: `${basePath}` },
      { label: "Mein Ticket", icon: <BadgeIcon />, path: `${basePath}my-qr` },
      {
        label: "Mein Sitzplatz",
        icon: <EventSeatIcon />,
        path: `${basePath}my-seat`,
      },
      {
        label: "Plus-Ones",
        icon: <GroupsIcon />,
        path: `${basePath}my-plus-ones`,
        disabled: true,
      },
      { label: "Profil", icon: <AccountCircleIcon />, path: `${basePath}me` },
    ],
  };

  return NAV[role];
}
