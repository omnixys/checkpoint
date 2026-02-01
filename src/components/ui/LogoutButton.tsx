// /frontend/src/app/components/user/LogoutButton.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LogoutButton(){
  const router = useRouter();
  const { logout } = useAuth();

  const onClick = async () => {
    try {
      await logout();
      router.replace('/login');
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
