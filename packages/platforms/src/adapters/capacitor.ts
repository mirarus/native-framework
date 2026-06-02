import type { PlatformAdapterDefinition } from "../definitions";

export const capacitorReactAdapter = {
  id: "mobile-capacitor-react",
  label: "@capacitor + React mobile",
  runtime: "capacitor",
  ui: "react",
  directory: "playground/mobile-react",
  entry: "capacitor.config.ts",
  packageNames: ["@capacitor/core", "@capacitor/android", "@capacitor/cli", "react", "vite"],
  devCommand: "npm run dev:mobile",
  buildCommand: "npm run build:mobile",
  nativeCommand: "npm run mobile:sync",
  description: "React + Vite mobile hedefini Capacitor native Android kabuguna baglar."
} satisfies PlatformAdapterDefinition;
