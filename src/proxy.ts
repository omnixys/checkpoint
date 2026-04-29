import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/checkpoint/constants/cookie";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Locale = (typeof SUPPORTED_LOCALES)[number];

function detectLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const languages = header.split(",").map((l) => l.split(";")[0]?.trim().toLowerCase() ?? "");

  for (const lang of languages) {
    for (const supported of SUPPORTED_LOCALES) {
      if (lang.startsWith(supported.toLowerCase().split("-")[0] ?? "")) {
        return supported;
      }
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Edge proxy for route protection.
 *
 * Replaces legacy middleware.ts in newer setups.
 *
 * Responsibilities:
 * - Fast auth check (cookie presence)
 * - Early redirect (before rendering)
 *
 * IMPORTANT:
 * - This is NOT a security layer
 * - Backend + SSR remain the source of truth
 */
export function proxy(req: NextRequest): NextResponse {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  const cookieLocale = req.cookies.get("locale")?.value;
  if (!cookieLocale) {
    const header = req.headers.get("accept-language");
    const locale = detectLocale(header);
    const pathLocale = pathname.split("/")[1];

    console.log("-----------");
    console.log("Path:", pathname);
    console.log("URL locale:", pathLocale);
    console.log("Cookie locale:", cookieLocale);
    console.log("Accept-Language:", header);
    console.log("-----------");

    console.log("Detected locale:", locale);

    res.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  /**
   * Define protected routes
   */
  const isProtectedRoute =
    pathname.startsWith("/event") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/scan") ||
    pathname.startsWith("/me");

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return res;
  }

  if (!isProtectedRoute) {
    return res;
  }

  /**
   * Read auth cookie (set by your GraphQL gateway / Keycloak flow)
   */
  const accessToken = req.cookies.get("access_token")?.value;

  /**
   * If no cookie → redirect to login
   */
  if (!accessToken) {
    const loginUrl = new URL("/login", req.url);

    /**
     * Preserve redirect target
     */
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  /**
   * Continue request
   */
  return res;
}

/**
 * Route matcher configuration.
 *
 */
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
