import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side authentication check.
 *
 * IMPORTANT:
 * - This is the REAL security layer
 * - Runs on server (cannot be bypassed)
 */
export async function requireAuth() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return {
    accessToken,
  };
}
