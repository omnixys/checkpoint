"use client";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
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
import React, { useMemo } from "react";
import ColorBubbleSwitcher from "@/checkpoint/components/ColorBubbleSwitcher";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import { env } from "@/checkpoint/lib/env";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { buildUserMenuItems } from "@/checkpoint/lib/experience/user-menu-builder";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

const CHECKPOINT_BASE_PATH = env.CHECKPOINT_BASE_PATH;

const ICON_MAP: Record<string, React.ElementType> = {
  "my-profile": Person,
  "my-ticket": BadgeIcon,
  "my-plus-ones": GroupsIcon,
  scanner: QrCodeScannerIcon,
  "admin-console": AdminPanelSettingsIcon,
  "my-support": SupportAgentIcon,
};

export default function UserMenu() {
  const router = useRouter();
  const { device } = useDevice();
  const { currentUser, isAuthenticated, currentUserLoading, logout } = useAuth();
  const { myRoles, myPermissions } = useActiveEvent();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const menuItems = useMemo(() => {
    const roleIds = myRoles.map((r) => r.key);
    const experience = resolveExperience(roleIds, myPermissions);
    return buildUserMenuItems(experience);
  }, [myRoles, myPermissions]);

  if (currentUserLoading) return null;
  if (!isAuthenticated || !currentUser) return null;

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

  const featureIcon = (featureId: string) => {
    const Icon = ICON_MAP[featureId] ?? Person;
    return <Icon fontSize="small" />;
  };

  return (
    <>
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

      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { elevation: 4, sx: { borderRadius: 3, mt: 1, minWidth: 240 } } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
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

        {menuItems.map((item) => (
          <MenuItem key={item.featureId} onClick={() => go(`${CHECKPOINT_BASE_PATH}${item.path}`)}>
            <ListItemIcon>{featureIcon(item.featureId)}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={doLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Abmelden
        </MenuItem>

        <Link href={`${env.NEXYS_HOME_URL}/home`}>
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
