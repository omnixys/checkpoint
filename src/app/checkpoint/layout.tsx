import Providers from "@/providers/Provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ReactNode } from "react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
// import { Analytics } from "@vercel/analytics/next";
import StartupVisionPro from "@/components/startup/StartupVisionPro";

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

export const metadata: Metadata = {
  title: "checkpoint",
  description: "QR Event & Ticketing – beautiful, fast, iOS-inspired.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "checkpoint" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <SpeedInsights />
        <Analytics /> */}
        <StartupVisionPro />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
