import type { RuntimeAdapter, StorageAdapter } from "./types";

export function createMemoryStorage(namespace: string): StorageAdapter {
  const values = new Map<string, unknown>();
  const prefix = `uniframe:${namespace}:`;

  return {
    get<TValue>(key: string, fallback: TValue): TValue {
      return values.has(prefix + key) ? (values.get(prefix + key) as TValue) : fallback;
    },
    set<TValue>(key: string, value: TValue): TValue {
      values.set(prefix + key, value);
      return value;
    }
  };
}

export const nodeAdapter: RuntimeAdapter = {
  name: "node",
  runtime: "node",
  storage(namespace) {
    return createMemoryStorage(namespace);
  }
};
