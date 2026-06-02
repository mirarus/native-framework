import type { PlatformAdapterDefinition } from "../definitions";

export const viteReactAdapter = {
  id: "web-vite-react",
  label: "Vite + React web",
  runtime: "vite",
  ui: "react",
  directory: "playground/web-react",
  entry: "playground/web-react/src/main.tsx",
  packageNames: ["vite", "react", "react-dom", "@vitejs/plugin-react"],
  devCommand: "npm run dev:web:react",
  buildCommand: "npm run build:web -- --flavor react",
  description: "React + TypeScript web hedefini Vite uzerinden calistirir."
} satisfies PlatformAdapterDefinition;

export const viteVueAdapter = {
  id: "web-vite-vue",
  label: "Vite + Vue web",
  runtime: "vite",
  ui: "vue",
  directory: "playground/web-vue",
  entry: "playground/web-vue/src/main.ts",
  packageNames: ["vite", "vue", "@vitejs/plugin-vue"],
  devCommand: "npm run dev:web:vue",
  buildCommand: "npm run build:web -- --flavor vue",
  description: "Vue + TypeScript web hedefini Vite uzerinden calistirir."
} satisfies PlatformAdapterDefinition;

export const viteVanillaAdapter = {
  id: "web-vite-vanilla",
  label: "Vite + vanilla TypeScript web",
  runtime: "vite",
  ui: "vanilla",
  directory: "playground/web-vanilla",
  entry: "playground/web-vanilla/src/main.ts",
  packageNames: ["vite", "typescript"],
  devCommand: "npm run dev:web:vanilla",
  buildCommand: "npm run build:web -- --flavor vanilla",
  description: "Framework kullanmadan vanilla TypeScript web hedefini Vite ile calistirir."
} satisfies PlatformAdapterDefinition;
