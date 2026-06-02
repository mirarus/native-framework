import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineUniframeViteConfig } from "@uniframe/vite";

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineUniframeViteConfig(
  {
    build: {
      emptyOutDir: true,
      outDir: resolve(appRoot, "dist")
    }
  },
  {
    root: appRoot
  }
);
