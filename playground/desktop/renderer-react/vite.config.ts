import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineUniframeViteConfig } from "@uniframe/vite";

const rendererRoot = dirname(fileURLToPath(import.meta.url));

export default defineUniframeViteConfig(
  {
    build: {
      emptyOutDir: true,
      outDir: resolve(rendererRoot, "dist")
    }
  },
  {
    root: rendererRoot,
    plugins: [react()]
  }
);
