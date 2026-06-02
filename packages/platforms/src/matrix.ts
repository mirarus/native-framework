import { manifest } from "../../core/src/index.ts";
import { capacitorReactAdapter } from "./adapters/capacitor";
import { electronReactAdapter, electronVueAdapter } from "./adapters/electron";
import { nodeApiAdapter } from "./adapters/node";
import { viteReactAdapter, viteVanillaAdapter, viteVueAdapter } from "./adapters/vite";
import type { PlatformAdapterDefinition, PlatformMatrix, PlatformRuntime } from "./definitions";

export const platformMatrix = {
  name: `${manifest.name} Platform Matrix`,
  runtimeStack: ["@capacitor", "electron", "react", "vite", "vue", "node"],
  adapters: [
    nodeApiAdapter,
    viteReactAdapter,
    viteVueAdapter,
    viteVanillaAdapter,
    electronReactAdapter,
    electronVueAdapter,
    capacitorReactAdapter
  ]
} satisfies PlatformMatrix;

export function listPlatformAdapters(): PlatformAdapterDefinition[] {
  return [...platformMatrix.adapters];
}

export function getPlatformAdapter(id: string): PlatformAdapterDefinition | undefined {
  return platformMatrix.adapters.find((adapter) => adapter.id === id);
}

export function groupPlatformAdaptersByRuntime() {
  return platformMatrix.adapters.reduce(
    (groups, adapter) => {
      groups[adapter.runtime] ??= [];
      groups[adapter.runtime].push(adapter);
      return groups;
    },
    {} as Record<PlatformRuntime, PlatformAdapterDefinition[]>
  );
}

export function formatPlatformMatrix(matrix: PlatformMatrix = platformMatrix): string[] {
  return matrix.adapters.map(
    (adapter) =>
      `${adapter.id}: ${adapter.label} | runtime=${adapter.runtime} | ui=${adapter.ui} | dev="${adapter.devCommand}"`
  );
}
