import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const appRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  plugins: [react(), tsconfigPaths()],
  build: {
    emptyOutDir: true,
    outDir: resolve(appRoot, "dist")
  }
});
