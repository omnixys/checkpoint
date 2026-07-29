import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Lato, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { env } from "@/checkpoint/lib/env";
import { baseMetadata } from "@/checkpoint/lib/metadata/base.metadata";
import Provider from "@/checkpoint/providers/Provider";
import { readAnalyticsConsent } from "@/checkpoint/lib/analytics/consent";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StartupVisionPro from "@/checkpoint/components/startup/StartupVisionPro";

export const viewport: Viewport = {
  themeColor: "#6A4BBC", // MUST match omnixys primary :contentReference[oaicite:0]{index=0}
};

export const metadata: Metadata = {
  ...baseMetadata,

  title: {
    default: "Checkpoint",
    template: "%s | Checkpoint",
  },

  description:
    "Checkpoint is a secure QR-based event access platform. Manage invitations, scan guests, and track attendance in real time.",

  applicationName: "Checkpoint",

  authors: [{ name: "Omnixys" }],

  creator: "Omnixys",
  publisher: "Omnixys",

  metadataBase: new URL(env.APP_URL),

  openGraph: {
    title: "Checkpoint – Secure Access Platform",
    description:
      "Modern QR-based guest management system for events. Fast, secure, and mobile-first.",
    url: "/",
    siteName: "Checkpoint",
    type: "website",
    images: [
      {
        url: "/og/cover.png",
        width: 1200,
        height: 630,
        alt: "Checkpoint Platform Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Checkpoint – Secure Access Platform",
    description: "QR-based event access, guest tracking, and admin tools in one platform.",
    images: ["/og/cover.png"],
  },

  /**
   * -------------------------------------------------------------
   * Icons Configuration (Favicon + Apple + PWA)
   * -------------------------------------------------------------
   */
  icons: {
    icon: [
      { url: "/favico/favicon.ico" },
      { url: "/favico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],

    apple: [
      {
        url: "/favico/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],

    shortcut: ["/favico/favicon.ico"],
  },

  /**
   * -------------------------------------------------------------
   * PWA / Mobile App Feel
   * -------------------------------------------------------------
   */
  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const weddingSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-wedding-serif",
});

const weddingSans = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-wedding-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  const cookieStore = await cookies();
  const initialThemeProfile = cookieStore.get("theme")?.value === "wedding" ? "wedding" : null;
  const initialAnalyticsConsent = readAnalyticsConsent(cookieStore);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${weddingSerif.variable} ${weddingSans.variable}`}
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SpeedInsights />
        <NextIntlClientProvider messages={messages}>
          <Provider
            initialAnalyticsConsent={initialAnalyticsConsent}
            initialThemeProfile={initialThemeProfile}
          >
            <StartupVisionPro />
            {children}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
