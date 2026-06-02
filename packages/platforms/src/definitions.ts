export type PlatformRuntime = "capacitor" | "electron" | "node" | "vite";
export type PlatformUi = "react" | "server" | "vanilla" | "vue";

export interface PlatformAdapterDefinition {
  id: string;
  label: string;
  runtime: PlatformRuntime;
  ui: PlatformUi;
  directory: string;
  entry: string;
  packageNames: string[];
  devCommand: string;
  buildCommand: string;
  nativeCommand?: string;
  description: string;
}

export interface PlatformMatrix {
  name: string;
  runtimeStack: string[];
  adapters: PlatformAdapterDefinition[];
}
