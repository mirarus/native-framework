import { manifest } from "./manifest";

export interface AppInfo {
  product: string;
  version: string;
  promise: string;
  targets: string[];
}

export interface Greeting {
  title: string;
  message: string;
}

export const appInfo: AppInfo = {
  product: manifest.name,
  version: manifest.version,
  promise: "Tek proje, coklu platform, ortak mantik.",
  targets: [
    "api",
    "web-react",
    "web-vue",
    "web-vanilla",
    "mobile",
    "mobile-capacitor",
    "desktop",
    "desktop-react",
    "desktop-vue"
  ]
};

export function createGreeting(platform: string): Greeting {
  return {
    title: `${appInfo.product} ${platform}`,
    message: `${platform} hedefi ayni shared contract uzerinden calisiyor.`
  };
}

export function listCapabilities(): string[] {
  return [
    "TypeScript core",
    "React UI",
    "Vue UI",
    "Vanilla JS UI",
    "Express API",
    "Electron desktop renderer",
    "Capacitor native mobile",
    "Mobile-first app hedefi",
    "Shared contracts",
    "Adapter-ready architecture"
  ];
}
