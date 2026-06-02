#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const runner = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(
  runner,
  ["tsx", resolve(root, "packages/cli/src/uniframe.ts"), ...process.argv.slice(2)],
  {
    cwd: root,
    shell: false,
    stdio: "inherit"
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
