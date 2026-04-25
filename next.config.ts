import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDocker = process.env.DOCKER === "true";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  output: isDocker ? "standalone" : undefined,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },

  // typescript: {
  //   ignoreBuildErrors: true,
  // },

  experimental: {
    // Required for Server Actions in iOS wrapper
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
