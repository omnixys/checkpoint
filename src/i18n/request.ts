import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["de-DE", "en-US", "it-IT", "ak-GH"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "de-DE";

function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectLocaleFromHeader(header: string | null): Locale {
  if (!header) {
    return DEFAULT_LOCALE;
  }

  const lang = header.toLowerCase();

  if (lang.startsWith("en")) {
    return "en-US";
  }

  return "de-DE";
}

export default getRequestConfig(async () => {
  // 1️⃣ Locale aus Cookie (primär)
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get("locale")?.value;
  const acceptLanguage = headerStore.get("accept-language");

  let locale: Locale;

  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    locale = detectLocaleFromHeader(acceptLanguage);
  }

  const language = locale.split("-")[0] ?? "en";
  // console.log({locale, language})

  const messages = {
    auth: (await import(`../../messages/${language}/auth.json`)).default,
    event: (await import(`../../messages/${language}/event.json`)).default,
    // calendar: (await import(`../../messages/${language}/calendar.json`)).default,
    invitation: (await import(`../../messages/${language}/invitation.json`)).default,
    // ticket: (await import(`../../messages/${language}/ticket.json`)).default,
    // security: (await import(`../../messages/${language}/security.json`)).default,
    // settings: (await import(`../../messages/${language}/settings.json`)).default,
    // seat: (await import(`../../messages/${language}/seat.json`)).default,
    // notification: (await import(`../../messages/${language}/notification.json`)).default,
    // user: (await import(`../../messages/${language}/user.json`)).default,
    layout: (await import(`../../messages/${language}/layout.json`)).default,
    home: (await import(`../../messages/${language}/home.json`)).default,
    error: (await import(`../../messages/${language}/error.json`)).default,
    rsvp: (await import(`../../messages/${language}/rsvp.json`)).default,
    common: (await import(`../../messages/${language}/common.json`)).default,
    create: (await import(`../../messages/${language}/create.json`)).default,
    onboarding: (await import(`../../messages/${language}/onboarding.json`)).default,
    scanner: (await import(`../../messages/${language}/scanner.json`)).default,
    qr: (await import(`../../messages/${language}/qr.json`)).default,
    ticket: (await import(`../../messages/${language}/ticket.json`)).default,
  };

  return {
    locale: language,
    messages,
  };
});
