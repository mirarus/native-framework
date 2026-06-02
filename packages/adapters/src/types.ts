import type { StorageAdapter } from "@uniframe/core";

export type { StorageAdapter };

export type AdapterRuntime = "browser" | "node" | "electron" | "native";

export interface RuntimeAdapter {
  name: string;
  runtime: AdapterRuntime;
  storage(namespace: string): StorageAdapter;
}
