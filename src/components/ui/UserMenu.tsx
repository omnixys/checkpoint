"use client";

import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { JSX } from "react";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Person from "@mui/icons-material/Person";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useDevice } from "@/providers/DeviceProvider";
import { useRouter } from "next/navigation";
import ColorBubbleSwitcher from "./ColorBubbleSwitcher";

/**
 * eventRoles:
 *  - ADMIN
 *  - SECURITY
 *  - GUEST
 */
type EventRole = "ADMIN" | "SECURITY" | "GUEST";

export default function UserMenu(): JSX.Element | null {
  const router = useRouter();
  const { device } = useDevice();

  const { user, isAuthenticated, loading, logout } = useAuth();
  const { activeEvent } = useActiveEvent();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const eventRole: EventRole = activeEvent?.myRole ?? "GUEST";

  if (loading) return null;
  if (!isAuthenticated || !user) return null;

  const displayName =
    [user?.personalInfo.firstName, user?.personalInfo.lastName]
      .filter(Boolean)
      .join(" ") ||
    user.username ||
    "User";

  const initials = displayName
    .split(" ")
    .map((x) => x[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const go = (href: string) => {
    handleClose();
    router.push(href);
  };

  const doLogout = async () => {
    handleClose();
    await logout();
    router.replace("/checkpoint/login");
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
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 3,
            mt: 1,
            minWidth: 240,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <MenuItem disabled>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {displayName}
          </Typography>
        </MenuItem>

        {device === "mobile" && (
          <MenuItem>
            <ColorBubbleSwitcher />
          </MenuItem>
        )}
        {/* Profile */}
        <MenuItem onClick={() => go("/checkpoint/me")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profil & Einstellungen
        </MenuItem>

        {/* Notifications */}
        <MenuItem onClick={() => go("/checkpoint/me/notifications")}>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          Benachrichtigungen
        </MenuItem>

        {/* My QR */}
        <MenuItem onClick={() => go("/checkpoint/my-qr")}>
          <ListItemIcon>
            <BadgeIcon fontSize="small" />
          </ListItemIcon>
          Mein QR / Ticket
        </MenuItem>

        {/* Plus-Ones → only for guests */}
        {eventRole === "GUEST" && (
          <MenuItem onClick={() => go("/checkpoint/my-plus-ones")}>
            <ListItemIcon>
              <GroupsIcon fontSize="small" />
            </ListItemIcon>
            Plus-Ones verwalten
          </MenuItem>
        )}

        {/* Security-only */}
        {eventRole === "SECURITY" && (
          <MenuItem onClick={() => go("/checkpoint/scan")}>
            <ListItemIcon>
              <QrCodeScannerIcon fontSize="small" />
            </ListItemIcon>
            Scanner öffnen
          </MenuItem>
        )}

        {/* Admin-only */}
        {eventRole === "ADMIN" && (
          <MenuItem onClick={() => go("/checkpoint/admin")}>
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
      </Menu>
    </>
  );
}
