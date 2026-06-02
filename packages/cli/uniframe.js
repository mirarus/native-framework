#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const runner = process.platform === "win32" ? "npx.cmd" : "npx";
const runnerArgs = ["tsx", resolve(root, "packages/cli/src/uniframe.ts"), ...process.argv.slice(2)];
const command = process.platform === "win32" ? "cmd.exe" : runner;
const commandArgs =
  process.platform === "win32" ? ["/d", "/c", quoteCommand([runner, ...runnerArgs])] : runnerArgs;
const child = spawn(command, commandArgs, {
  cwd: root,
  shell: false,
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

function quoteCommand(parts) {
  return parts
    .map((part) => {
      const value = String(part);
      return /[\s&()^|<>"]/u.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    })
    .join(" ");
}
