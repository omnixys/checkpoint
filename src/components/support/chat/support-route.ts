export function isGuestSupportChatRoute(pathname: string, basePath = ""): boolean {
  const base = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const supportRoute = `${base}/me/support`;
  return pathname === supportRoute || pathname.startsWith(`${supportRoute}/`);
}
