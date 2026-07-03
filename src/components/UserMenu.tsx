"use client";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { type JSX } from "react";
import ColorBubbleSwitcher from "@/checkpoint/components/ColorBubbleSwitcher";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import { env } from "@/checkpoint/lib/env";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

/**
 * eventRoles:
 *  - ADMIN
 *  - SECURITY
 *  - GUEST
 */
type EventRole = "ADMIN" | "SECURITY" | "GUEST";
const CHECKPOINT_BASE_PATH = env.CHECKPOINT_BASE_PATH;

export default function UserMenu(): JSX.Element | null {
  const router = useRouter();
  const { device } = useDevice();

  const { currentUser, isAuthenticated, currentUserLoading, logout } = useAuth();
  const { activeEvent } = useActiveEvent();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const eventRole: EventRole = activeEvent?.myRole ?? "GUEST";

  if (currentUserLoading) {
    return null;
  }
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  const displayName =
    [currentUser?.personalInfo?.firstName, currentUser?.personalInfo?.lastName]
      .filter(Boolean)
      .join(" ") ||
    currentUser.username ||
    "User";

  const initials = displayName
    .split(" ")
    .map((x) => x[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const go = (href: string) => {
    handleClose();
    router.push(href);
  };

  const doLogout = async () => {
    handleClose();
    await logout();
    router.replace(`${CHECKPOINT_BASE_PATH}login`);
  };

  return (
    <>
      {/* Avatar button */}
      <Tooltip title={displayName}>
        <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              borderRadius: 3,
              mt: 1,
              minWidth: 240,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <MenuItem disabled={true}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {displayName}
          </Typography>
        </MenuItem>

        {device === "mobile" && (
          <Stack direction="row">
            <MenuItem>
              <ColorBubbleSwitcher />
            </MenuItem>
            <MenuItem>
              <ThemeToggleButton />
            </MenuItem>
            <MenuItem>
              <LanguageSwitcher />
            </MenuItem>
          </Stack>
        )}
        {/* Profile */}
        <MenuItem onClick={() => go(`${CHECKPOINT_BASE_PATH}me`)}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profil & Einstellungen
        </MenuItem>

        {/* Notifications */}
        {/* <MenuItem onClick={() => go(`${CHECKPOINT_BASE_PATH}me/notifications`)}>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          Benachrichtigungen
        </MenuItem> */}

        {/* My QR */}
        <MenuItem onClick={() => go(`${CHECKPOINT_BASE_PATH}me/my-qr`)}>
          <ListItemIcon>
            <BadgeIcon fontSize="small" />
          </ListItemIcon>
          Mein QR / Ticket
        </MenuItem>

        {/* Plus-Ones → only for guests */}
        {eventRole === "GUEST" && (
          <MenuItem onClick={() => go(`${CHECKPOINT_BASE_PATH}me/my-plus-ones`)}>
            <ListItemIcon>
              <GroupsIcon fontSize="small" />
            </ListItemIcon>
            Plus-Ones verwalten
          </MenuItem>
        )}

        {/* Security-only */}
        {eventRole === "SECURITY" && (
          <MenuItem onClick={() => go(`${CHECKPOINT_BASE_PATH}/scan`)}>
            <ListItemIcon>
              <QrCodeScannerIcon fontSize="small" />
            </ListItemIcon>
            Scanner öffnen
          </MenuItem>
        )}

        {/* Admin-only */}
        {eventRole === "ADMIN" && (
          <MenuItem onClick={() => go(`${CHECKPOINT_BASE_PATH}/admin`)}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Admin-Konsole
          </MenuItem>
        )}

        <Divider />

        {/* Logout */}
        <MenuItem onClick={doLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Abmelden
        </MenuItem>

        <Link href={`${env.NEXYS_HOME_LINK}/home`}>
          <MenuItem>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Nexus
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
