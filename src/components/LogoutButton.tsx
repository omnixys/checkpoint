// /frontend/src/app/components/user/LogoutButton.tsx
"use client";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { IconButton, Tooltip } from "@mui/material";
import { env } from "@/checkpoint/lib/env";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export default function LogoutButton() {
  const { logout } = useAuth();

  const onClick = async () => {
    try {
      await logout();
      window.location.assign(`${env.CHECKPOINT_BASE_PATH}login`);
    } catch (_e) {}
  };

  return (
    <Tooltip title="Logout">
      <IconButton color="error" onClick={onClick} aria-label="Logout">
        <LogoutRoundedIcon />
      </IconButton>
    </Tooltip>
  );
}
