import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.omnixys.checkpoint",
  appName: "Checkpoint",

  // webDir: ".next/standalone",
  // webDir: 'public'
  webDir: ".next",

  // ⛳️ DEV: iPhone lädt direkt vom Next.js-Devserver (Hot Reload)
  server: {
    // url: "http://192.168.2.148:3000", // <— deine LAN-IP + Port vom `pnpm dev`
    url: "https://ui.omnixys.com",
    // hostname: "ui.omnixys.com",
    // iosScheme: "https",
    cleartext: true,
    // allowNavigation: ["ui.omnixys.com", "api.omnixys.com"],
  },

  ios: {
    // WICHTIG: AppBoundDomains nicht limitieren im Dev
    limitsNavigationsToAppBoundDomains: false,
    scheme: "app",

    scrollEnabled: true,
    allowsLinkPreview: false,
  },

  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
