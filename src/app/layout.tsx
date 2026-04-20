import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import StartupVisionPro from "@/checkpoint/components/startup/StartupVisionPro";
import Provider from "@/checkpoint/providers/Provider";
import { baseMetadata } from "@/checkpoint/lib/metadata/base.metadata";
import { env } from "@/checkpoint/lib/env";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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

  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),

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
    description:
      "QR-based event access, guest tracking, and admin tools in one platform.",
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

  themeColor: "#6A4BBC", // MUST match omnixys primary :contentReference[oaicite:0]{index=0}

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  
  return (
    <html lang="de" className={inter.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <Provider>
            {/* <StartupVisionPro /> */}
            {children}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
