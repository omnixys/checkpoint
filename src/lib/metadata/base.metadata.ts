import { Metadata } from "next";

/**
 * -------------------------------------------------------------
 * Base Metadata (Global Defaults)
 * -------------------------------------------------------------
 * This defines the default metadata applied to ALL pages.
 * Individual pages can override this via buildMetadata().
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL("https://checkpoint.omnixys.com"),

  title: {
    default: "Checkpoint",
    template: "%s | Checkpoint",
  },

  description:
    "Secure event management platform with QR-based access control and real-time guest tracking.",

  applicationName: "Checkpoint",

  authors: [{ name: "Omnixys Technologies" }],

  generator: "Next.js",

  keywords: ["event", "qr code", "security", "invitation", "checkpoint", "guest management"],

  openGraph: {
    type: "website",
    siteName: "Checkpoint",
    title: "Checkpoint",
    description: "Modern QR-based event access system with real-time tracking.",
  },

  robots: {
    index: true,
    follow: true,
  },

  other: {
    "x-platform": "checkpoint",
    "x-version": "1.0.0",
  },
};
