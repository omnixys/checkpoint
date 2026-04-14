// /frontend/src/app/components/user/LogoutButton.tsx
"use client";

import { env } from "@/checkpoint/lib/env";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { IconButton, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const onClick = async () => {
    try {
      await logout();
      router.replace(`${env.CHECKPOINT_BASE_PATH}login`);
    } catch (e) {
      // Optional: in-app toast
      console.error(e);
    }
  };

  return (
    <Tooltip title="Logout">
      <IconButton color="error" onClick={onClick} aria-label="Logout">
        <LogoutRoundedIcon />
      </IconButton>
    </Tooltip>
  );
}
