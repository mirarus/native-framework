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
  targets: ["api", "web-react", "web-vanilla", "mobile", "desktop"]
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
    "Vanilla JS UI",
    "Express API",
    "Electron desktop wrapper",
    "Mobile-first app hedefi",
    "Shared contracts",
    "Adapter-ready architecture"
  ];
}
