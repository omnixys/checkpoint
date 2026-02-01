export enum KcRole {
  ADMIN = "ADMIN",
  SECURITY = "SECURITY",
  GUEST = "GUEST",
  EVENT_ADMIN = "EVENT_ADMIN",
  ANON = "ANON",
}

/**
 * Mappt rohe Keycloak-Rollen auf unser internes Rollen-Set.
 * - "ADMIN" bleibt kompatibel und wird zu "SUPER_ADMIN".
 * - Falls keine gültige Rolle vorhanden ist, geben wir KEINE Default-Rolle zurück
 *   (die Zuordnung zu "ANON" passiert in resolveUserRoles je nach Auth-Status).
 */
export function extractRoles(raw?: string[] | null): KcRole[] {
  const set = new Set((raw ?? []).map((r) => r.toUpperCase()));
  const roles: KcRole[] = [];
  if (set.has("ADMIN")) roles.push(KcRole.ADMIN);
  if (set.has("SECURITY")) roles.push(KcRole.SECURITY);
  if (set.has("EVENT_ADMIN")) roles.push(KcRole.EVENT_ADMIN);
  if (set.has("GUEST")) roles.push(KcRole.GUEST);

  return roles;
}

/**
 * Ermittelt die effektiven Rollen für den aktuellen Benutzer.
 * - Nicht eingeloggt  => ['ANON']
 * - Eingeloggt, aber keine Rollen => ['GUEST'] (falls du lieber streng sein willst, ändere auf ['ANON'])
 */
export function resolveUserRoles(
  isAuthenticated: boolean,
  raw?: string[] | null
): KcRole[] {
  if (!isAuthenticated) return [KcRole.ANON];
  const mapped = extractRoles(raw);
  if (mapped.length === 0) return [KcRole.GUEST];
  return mapped;
}

export function hasRole(roles: KcRole[], r: KcRole): boolean {
  return roles.includes(r);
}
