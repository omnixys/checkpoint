// lib/useRoleGuard.ts
import { useSession } from 'next-auth/react';

export function useRoleGuard(allowedRoles: string[]) {
  const { data: session, status } = useSession();
  const roles = session?.user?.roles || [];
  const isAllowed = allowedRoles.some((role) => roles.includes(role));

  return {
    session,
    loading: status === 'loading',
    isAllowed,
  };
}
