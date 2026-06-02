import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = resolve(root, "packages/cli/src/uniframe.ts");
const tsx = resolve(root, "node_modules/tsx/dist/cli.mjs");

function runCli(...args: string[]) {
  return execFileSync("node", [tsx, cli, ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

describe("uniframe cli", () => {
  it("passes repository health checks", () => {
    expect(runCli("check")).toContain("Uniframe kontrolu basarili.");
  });

  it("prints professional project metadata", () => {
    const output = runCli("info");

    expect(output).toContain("Uniframe 0.1.0");
    expect(output).toContain("webReact");
    expect(output).toContain("desktop react");
    expect(output).toContain("@capacitor + electron + react + vite + vue + node");
  });

  it("prints the platform matrix", () => {
    const output = runCli("platforms");

    expect(output).toContain("Uniframe Platform Matrix");
    expect(output).toContain("mobile-capacitor-react");
    expect(output).toContain("desktop-electron-react");
    expect(output).toContain("web-vite-vue");
  });
});
