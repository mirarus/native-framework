import { manifest } from "./manifest.js";

export const appInfo = {
  product: manifest.name,
  version: manifest.version,
  promise: "Tek proje, coklu platform, ortak mantik.",
  targets: ["api", "web-react", "web-vanilla", "mobile", "desktop"]
};

export function createGreeting(platform) {
  return {
    title: `${appInfo.product} ${platform}`,
    message: `${platform} hedefi ayni shared contract uzerinden calisiyor.`
  };
}

export function listCapabilities() {
  return [
    "React UI",
    "Vanilla JS UI",
    "Express API",
    "Electron desktop wrapper",
    "Mobile-first app hedefi",
    "Shared contracts"
  ];
}
