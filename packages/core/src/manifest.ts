export type TargetRuntime = "node" | "vite" | "electron";
export type TargetFlavor = "api" | "react" | "vanilla" | "desktop";

export interface TargetDefinition {
  runtime: TargetRuntime;
  flavor?: TargetFlavor;
  entry: string;
}

export interface FrameworkManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  targets: Record<string, TargetDefinition>;
}

export const manifest = {
  id: "com.mirarus.uniframe",
  name: "Uniframe",
  version: "0.1.0",
  description: "Tek repo icinde API, web, mobile, desktop, React ve vanilla JS hedefleri.",
  targets: {
    api: {
      runtime: "node",
      flavor: "api",
      entry: "apps/api/src/server.ts"
    },
    webReact: {
      runtime: "vite",
      flavor: "react",
      entry: "apps/web-react/src/main.tsx"
    },
    webVanilla: {
      runtime: "vite",
      flavor: "vanilla",
      entry: "apps/web-vanilla/src/main.ts"
    },
    mobile: {
      runtime: "vite",
      flavor: "react",
      entry: "apps/mobile-react/src/main.tsx"
    },
    desktop: {
      runtime: "electron",
      flavor: "desktop",
      entry: "apps/desktop/main.cjs"
    }
  }
} satisfies FrameworkManifest;

export type TargetKey = keyof typeof manifest.targets;

export function listTargetKeys(): TargetKey[] {
  return Object.keys(manifest.targets) as TargetKey[];
}
