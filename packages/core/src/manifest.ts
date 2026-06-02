export type TargetRuntime = "node" | "vite" | "electron";
export type TargetFlavor = "api" | "react" | "vanilla" | "vue" | "desktop";

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
      entry: "playground/api/src/api-server.ts"
    },
    webReact: {
      runtime: "vite",
      flavor: "react",
      entry: "playground/web-react/src/main.tsx"
    },
    webVanilla: {
      runtime: "vite",
      flavor: "vanilla",
      entry: "playground/web-vanilla/src/main.ts"
    },
    webVue: {
      runtime: "vite",
      flavor: "vue",
      entry: "playground/web-vue/src/main.ts"
    },
    mobile: {
      runtime: "vite",
      flavor: "react",
      entry: "playground/mobile-react/src/main.tsx"
    },
    desktop: {
      runtime: "electron",
      flavor: "desktop",
      entry: "playground/desktop/main/desktop-main.cjs"
    }
  }
} satisfies FrameworkManifest;

export type TargetKey = keyof typeof manifest.targets;

export function listTargetKeys(): TargetKey[] {
  return Object.keys(manifest.targets) as TargetKey[];
}
