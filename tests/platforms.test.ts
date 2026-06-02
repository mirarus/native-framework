import { describe, expect, it } from "vitest";
import {
  formatPlatformMatrix,
  getPlatformAdapter,
  groupPlatformAdaptersByRuntime,
  platformMatrix
} from "@uniframe/platforms";

describe("platform matrix", () => {
  it("models the requested framework stack", () => {
    expect(platformMatrix.runtimeStack).toEqual([
      "@capacitor",
      "electron",
      "react",
      "vite",
      "vue",
      "node"
    ]);
  });

  it("exposes first-class adapters for native, desktop, web and api", () => {
    expect(getPlatformAdapter("mobile-capacitor-react")?.packageNames).toContain("@capacitor/core");
    expect(getPlatformAdapter("desktop-electron-react")?.packageNames).toContain("electron");
    expect(getPlatformAdapter("web-vite-react")?.packageNames).toContain("react");
    expect(getPlatformAdapter("web-vite-vue")?.packageNames).toContain("vue");
    expect(getPlatformAdapter("api-node-express")?.packageNames).toContain("express");
  });

  it("groups adapters by runtime", () => {
    const groups = groupPlatformAdaptersByRuntime();

    expect(groups.capacitor).toHaveLength(1);
    expect(groups.electron).toHaveLength(2);
    expect(groups.node).toHaveLength(1);
    expect(groups.vite).toHaveLength(3);
  });

  it("formats the matrix for the cli", () => {
    expect(formatPlatformMatrix().join("\n")).toContain("desktop-electron-vue");
  });
});
