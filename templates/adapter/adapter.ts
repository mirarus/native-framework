import type { RuntimeAdapter } from "@uniframe/adapters";

export const customAdapter: RuntimeAdapter = {
  name: "custom",
  runtime: "native",
  storage(_namespace) {
    throw new Error("customAdapter.storage henuz uygulanmadi.");
  }
};
