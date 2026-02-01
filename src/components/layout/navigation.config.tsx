import { JSX } from "react";
import {
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
  Dashboard as DashboardIcon,
  EventSeat as EventSeatIcon,
  Home as HomeIcon,
  QrCodeScanner as QrCodeScannerIcon,
  Event as EventIcon,
  MailOutline as MailOutlineIcon,
  Groups as GroupsIcon,
  ConfirmationNumberOutlined as ConfirmationNumberOutlinedIcon,
} from "@mui/icons-material";
import { EventRole } from "@/types/event/event-enum.type";

export type NavItem = {
  label: string;
  icon: JSX.Element;
  path: string;
  disabled?: boolean;
};

export function createNavigation(
  role: EventRole,
  activeEventId?: string
): NavItem[] {
  const hasEvent = Boolean(activeEventId);

  const NAV: Record<EventRole, NavItem[]> = {
    ADMIN: [
      { label: "Home", icon: <DashboardIcon />, path: "checkpoint/" },
      {
        label: "Scanner",
        icon: <QrCodeScannerIcon />,
        path: "checkpoint/scan",
      },
      {
        label: "Active Event",
        icon: <EventIcon />,
        path: `checkpoint/event/${activeEventId}`,
        disabled: !hasEvent,
      },
      {
        label: "Invitations",
        icon: <MailOutlineIcon />,
        path: `checkpoint/event/${activeEventId}/invitation`,
        disabled: !hasEvent,
      },
      {
        label: "Seats",
        icon: <EventSeatIcon />,
        path: `checkpoint/event/${activeEventId}/seat`,
        disabled: !hasEvent,
      },
      {
        label: "Guests",
        icon: <GroupsIcon />,
        path: `checkpoint/event/${activeEventId}/guest`,
        disabled: !hasEvent,
      },
      {
        label: "Tickets",
        icon: <ConfirmationNumberOutlinedIcon />,
        path: `checkpoint/event/${activeEventId}/ticket`,
        disabled: !hasEvent,
      },
      { label: "Profil", icon: <AccountCircleIcon />, path: "checkpoint/me" },
    ],

    SECURITY: [
      { label: "Home", icon: <DashboardIcon />, path: "checkpoint/" },
      {
        label: "Scanner",
        icon: <QrCodeScannerIcon />,
        path: "checkpoint/scan",
      },
      {
        label: "Guests",
        icon: <GroupsIcon />,
        path: `checkpoint/event/${activeEventId}/guest`,
        disabled: !hasEvent,
      },
      { label: "Profil", icon: <AccountCircleIcon />, path: "checkpoint/me" },
    ],

    GUEST: [
      { label: "Home", icon: <HomeIcon />, path: "checkpoint/" },
      { label: "Mein Ticket", icon: <BadgeIcon />, path: "checkpoint/my-qr" },
      {
        label: "Mein Sitzplatz",
        icon: <EventSeatIcon />,
        path: "checkpoint/my-seat",
      },
      {
        label: "Plus-Ones",
        icon: <GroupsIcon />,
        path: "checkpoint/my-plus-ones",
        disabled: true,
      },
      { label: "Profil", icon: <AccountCircleIcon />, path: "checkpoint/me" },
    ],
  };

  return NAV[role];
}
