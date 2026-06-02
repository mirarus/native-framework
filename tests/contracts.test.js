import { describe, expect, it } from "vitest";
import { appInfo, createGreeting, listCapabilities } from "../shared/contracts.js";
import { listTargetKeys, manifest } from "../shared/manifest.js";

describe("shared contracts", () => {
  it("exposes stable application metadata", () => {
    expect(appInfo.product).toBe("Uniframe");
    expect(appInfo.version).toBe(manifest.version);
    expect(listTargetKeys()).toEqual(["api", "webReact", "webVanilla", "mobile", "desktop"]);
  });

  it("creates platform-specific greetings from shared logic", () => {
    expect(createGreeting("React Web")).toEqual({
      title: "Uniframe React Web",
      message: "React Web hedefi ayni shared contract uzerinden calisiyor."
    });
  });

  it("keeps core capabilities visible to all targets", () => {
    expect(listCapabilities()).toContain("React UI");
    expect(listCapabilities()).toContain("Vanilla JS UI");
    expect(listCapabilities()).toContain("Express API");
  });
});
