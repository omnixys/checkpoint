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
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { env } from "@/checkpoint/lib/env";
import { UserRoleType } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

const basePath = env.CHECKPOINT_BASE_PATH;

export type NavItem = {
  label: string;
  icon: JSX.Element;
  path: string;
  disabled?: boolean;
};
/**
 * Translation function contract.
 * Ensures type-safe and framework-agnostic usage.
 */
type TFunction = (key: any) => string;

export function createNavigation(
  role: UserRoleType,
  t: TFunction,
  activeEventId?: string,
): NavItem[] {
  const hasEvent = Boolean(activeEventId);

  const NAV: Record<UserRoleType, NavItem[]> = {
    ADMIN: [
      {
        label: t("sidebar.home"),
        icon: <DashboardIcon />,
        path: `${basePath}`,
      },
      {
        label: t("sidebar.notifications"),
        icon: <NotificationsIcon />,
        path: `${basePath}event/${activeEventId}/notification`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.scanner"),
        icon: <QrCodeScannerIcon />,
        path: `${basePath}scan`,
      },
      {
        label: t("sidebar.activeEvent"),
        icon: <EventIcon />,
        path: `${basePath}event/${activeEventId}`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.invitations"),
        icon: <MailOutlineIcon />,
        path: `${basePath}event/${activeEventId}/invitation`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.seats"),
        icon: <EventSeatIcon />,
        path: `${basePath}event/${activeEventId}/seat`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.guests"),
        icon: <GroupsIcon />,
        path: `${basePath}event/${activeEventId}/guest`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.tickets"),
        icon: <ConfirmationNumberOutlinedIcon />,
        path: `${basePath}event/${activeEventId}/ticket`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.profile"),
        icon: <AccountCircleIcon />,
        path: `${basePath}me`,
      },
    ],

    SECURITY: [
      {
        label: t("sidebar.home"),
        icon: <DashboardIcon />,
        path: `${basePath}`,
      },
      {
        label: t("sidebar.scanner"),
        icon: <QrCodeScannerIcon />,
        path: `${basePath}scan`,
      },
      {
        label: t("sidebar.guests"),
        icon: <GroupsIcon />,
        path: `${basePath}event/${activeEventId}/guest`,
        disabled: !hasEvent,
      },
      {
        label: t("sidebar.profile"),
        icon: <AccountCircleIcon />,
        path: `${basePath}me`,
      },
    ],

    GUEST: [
      { label: t("sidebar.home"), icon: <HomeIcon />, path: `${basePath}` },
      {
        label: t("sidebar.myTicket"),
        icon: <BadgeIcon />,
        path: `${basePath}my-qr`,
      },
      {
        label: t("sidebar.mySeat"),
        icon: <EventSeatIcon />,
        path: `${basePath}my-seat`,
      },
      {
        label: t("sidebar.plusOnes"),
        icon: <GroupsIcon />,
        path: `${basePath}my-plus-ones`,
      },
      {
        label: t("sidebar.profile"),
        icon: <AccountCircleIcon />,
        path: `${basePath}me`,
      },
    ],
  };

  return NAV[role];
}
