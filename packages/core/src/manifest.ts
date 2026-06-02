export type TargetRuntime = "capacitor" | "node" | "vite" | "electron";
export type TargetFlavor = "api" | "react" | "vanilla" | "vue" | "desktop" | "mobile";

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
  description: "Tek repo icinde @capacitor, Electron, React, Vite, Vue ve Node hedefleri.",
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
    mobileCapacitor: {
      runtime: "capacitor",
      flavor: "mobile",
      entry: "capacitor.config.ts"
    },
    desktop: {
      runtime: "electron",
      flavor: "desktop",
      entry: "playground/desktop/main/desktop-main.cjs"
    },
    desktopReact: {
      runtime: "electron",
      flavor: "react",
      entry: "playground/desktop/renderer-react/src/main.tsx"
    },
    desktopVue: {
      runtime: "electron",
      flavor: "vue",
      entry: "playground/desktop/renderer/src/main.ts"
    }
  }
} satisfies FrameworkManifest;

export type TargetKey = keyof typeof manifest.targets;

export function listTargetKeys(): TargetKey[] {
  return Object.keys(manifest.targets) as TargetKey[];
}
