export function createStorage(namespace) {
  const prefix = `uniframe:${namespace}:`;

  return {
    get(key, fallback = null) {
      try {
        const value = globalThis.localStorage?.getItem(prefix + key);
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      globalThis.localStorage?.setItem(prefix + key, JSON.stringify(value));
      return value;
    }
  };
}

export async function fetchHealth() {
  try {
    const response = await fetch("http://localhost:4100/health");
    return await response.json();
  } catch {
    return { ok: false, service: "api", note: "API calismiyor olabilir." };
  }
}
