import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const createBin = resolve(root, "packages/create-uniframe/create-uniframe.js");
const tempRoots: string[] = [];

afterEach(() => {
  for (const directory of tempRoots.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("create-uniframe", () => {
  it("scaffolds a multi-target project for npx usage", () => {
    const cwd = mkdtempSync(join(tmpdir(), "uniframe-create-"));
    tempRoots.push(cwd);

    const output = execFileSync("node", [createBin, "sample-app"], {
      cwd,
      encoding: "utf8"
    });
    const project = join(cwd, "sample-app");
    const packageJson = JSON.parse(readFileSync(join(project, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
    };

    expect(output).toContain("Uniframe projesi olusturuldu: sample-app");
    expect(packageJson.scripts["dev:desktop:react"]).toContain("wait-and-open.ts");
    expect(packageJson.scripts["mobile:sync"]).toContain("cap sync");
    expect(packageJson.dependencies["@uniframe/core"]).toBe("0.1.0");
    expect(packageJson.dependencies.electron).toBeDefined();
    expect(existsSync(join(project, "apps/api/src/server.ts"))).toBe(true);
    expect(existsSync(join(project, "apps/web-react/src/app/App.tsx"))).toBe(true);
    expect(existsSync(join(project, "apps/web-vue/src/app/App.vue"))).toBe(true);
    expect(existsSync(join(project, "apps/mobile-react/vite.config.ts"))).toBe(true);
    expect(existsSync(join(project, "apps/desktop/renderer-react/src/app/App.tsx"))).toBe(true);
    expect(existsSync(join(project, "capacitor.config.ts"))).toBe(true);
  });
});
