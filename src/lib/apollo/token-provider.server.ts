"use server";

import { cookies } from "next/headers";

export async function getAccessTokenServer(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}
