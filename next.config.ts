import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },

  experimental: {
    // Required for Server Actions in iOS wrapper
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

const withNextIntl = createNextIntlPlugin();

export default withSentryConfig(
  withNextIntl(nextConfig),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: !process.env.CI,
    telemetry: false,
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    webpack: {
      treeshake: {
        removeDebugLogging: true,
      },
      automaticVercelMonitors: true,
    },
  },
);
