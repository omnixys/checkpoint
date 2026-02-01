import type { NextConfig } from "next";

const isDocker = process.env.DOCKER === "true";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  output: isDocker ? "standalone" : undefined,

  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    // Required for Server Actions in iOS wrapper
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;
