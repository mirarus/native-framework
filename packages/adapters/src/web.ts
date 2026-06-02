import { createStorage } from "@uniframe/core";
import type { RuntimeAdapter } from "./types";

export const webAdapter: RuntimeAdapter = {
  name: "web",
  runtime: "browser",
  storage(namespace) {
    return createStorage(namespace);
  }
};
