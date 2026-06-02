import type { PlatformAdapterDefinition } from "../definitions";

export const electronReactAdapter = {
  id: "desktop-electron-react",
  label: "Electron + React desktop",
  runtime: "electron",
  ui: "react",
  directory: "playground/desktop/renderer-react",
  entry: "playground/desktop/main/desktop-main.cjs",
  packageNames: ["electron", "react", "vite"],
  devCommand: "npm run dev:desktop:react",
  buildCommand: "npm run build:desktop:react",
  description: "Electron main/preload yapisini React + Vite renderer ile calistirir."
} satisfies PlatformAdapterDefinition;

export const electronVueAdapter = {
  id: "desktop-electron-vue",
  label: "Electron + Vue desktop",
  runtime: "electron",
  ui: "vue",
  directory: "playground/desktop/renderer",
  entry: "playground/desktop/main/desktop-main.cjs",
  packageNames: ["electron", "vue", "vite"],
  devCommand: "npm run dev:desktop:vue",
  buildCommand: "npm run build:desktop:vue",
  description: "Electron main/preload yapisini Vue + Vite renderer ile calistirir."
} satisfies PlatformAdapterDefinition;
