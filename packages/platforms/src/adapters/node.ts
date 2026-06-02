import type { PlatformAdapterDefinition } from "../definitions";

export const nodeApiAdapter = {
  id: "api-node-express",
  label: "Node + Express API",
  runtime: "node",
  ui: "server",
  directory: "playground/api",
  entry: "playground/api/src/api-server.ts",
  packageNames: ["node", "express", "tsx", "typescript"],
  devCommand: "npm run dev:api",
  buildCommand: "npm run build -- api",
  description: "TypeScript Node API hedefini shared contract paketleriyle calistirir."
} satisfies PlatformAdapterDefinition;
