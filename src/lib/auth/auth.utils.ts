/**
 * Checks if user has at least one required role.
 */
export function hasRole(requiredRoles: string[], userRole?: string): boolean {
  if (!userRole) {
    return false;
  }
  if (requiredRoles?.length === 0) {
    return true;
  }

  return requiredRoles?.some((role) => userRole === role);
}
