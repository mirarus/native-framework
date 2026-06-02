export interface StorageAdapter {
  get<TValue>(key: string, fallback: TValue): TValue;
  set<TValue>(key: string, value: TValue): TValue;
}

export interface HealthResponse {
  ok: boolean;
  service: string;
  framework?: string;
  timestamp?: string;
  note?: string;
}

export function createStorage(namespace: string): StorageAdapter {
  const prefix = `uniframe:${namespace}:`;

  return {
    get<TValue>(key: string, fallback: TValue): TValue {
      try {
        const value = globalThis.localStorage?.getItem(prefix + key);
        return value ? (JSON.parse(value) as TValue) : fallback;
      } catch {
        return fallback;
      }
    },
    set<TValue>(key: string, value: TValue): TValue {
      globalThis.localStorage?.setItem(prefix + key, JSON.stringify(value));
      return value;
    }
  };
}

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch("http://localhost:4100/health");
    return (await response.json()) as HealthResponse;
  } catch {
    return { ok: false, service: "api", note: "API calismiyor olabilir." };
  }
}
