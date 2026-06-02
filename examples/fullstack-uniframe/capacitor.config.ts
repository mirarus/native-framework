import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mirarus.fullstackuniframe",
  appName: "Fullstack Uniframe",
  webDir: "apps/web/dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
