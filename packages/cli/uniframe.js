#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const configPath = resolve(root, "framework.config.js");
const config = existsSync(configPath)
  ? (await import(pathToFileURL(configPath))).default
  : {};

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const target = args[1];

const getFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const isWindows = process.platform === "win32";

function run(cmd, cmdArgs, options = {}) {
  const command = isWindows ? "cmd.exe" : cmd;
  const commandArgs = isWindows ? ["/d", "/s", "/c", quoteCommand([cmd, ...cmdArgs])] : cmdArgs;
  const child = spawn(command, commandArgs, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ...options.env },
    shell: false,
    stdio: "inherit"
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

function quoteCommand(parts) {
  return parts
    .map((part) => {
      const value = String(part);
      return /[\s&()^|<>"]/u.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
    })
    .join(" ");
}

function runMany(commands) {
  run(npxCmd, ["concurrently", "-k", "--names", commands.map((item) => item.name).join(","), ...commands.flatMap((item) => ["-c", item.color]), ...commands.map((item) => item.cmd)]);
}

function viteArgs(app, mode, port) {
  const appRoot = resolve(root, "apps", app);
  const base = ["vite", appRoot, "--host", "0.0.0.0"];
  return mode === "build" ? ["vite", "build", appRoot] : [...base, "--port", String(port)];
}

function appFor(flavor) {
  return flavor === "vanilla" ? "web-vanilla" : "web-react";
}

function dev(targetName) {
  if (!targetName) {
    runMany([
      { name: "api", color: "cyan", cmd: `${npmCmd} run dev:api` },
      { name: "react", color: "green", cmd: `${npmCmd} run dev:web:react` },
      { name: "vanilla", color: "yellow", cmd: `${npmCmd} run dev:web:vanilla` }
    ]);
    return;
  }

  if (targetName === "api") {
    run("node", [resolve(root, "apps/api/server.js")]);
    return;
  }

  if (targetName === "web") {
    const flavor = getFlag("flavor", config.targets?.web?.defaultFlavor ?? "react");
    const port = flavor === "vanilla" ? config.targets?.web?.vanillaPort ?? 5174 : config.targets?.web?.reactPort ?? 5173;
    run(npxCmd, viteArgs(appFor(flavor), "dev", port));
    return;
  }

  if (targetName === "mobile") {
    run(npxCmd, viteArgs("mobile-react", "dev", config.targets?.mobile?.port ?? 5175));
    return;
  }

  if (targetName === "desktop") {
    runMany([
      { name: "desktop-web", color: "green", cmd: `${npxCmd} vite apps/web-react --host 127.0.0.1 --port ${config.targets?.desktop?.webPort ?? 5176}` },
      { name: "electron", color: "magenta", cmd: `node apps/desktop/wait-and-open.js ${config.targets?.desktop?.webPort ?? 5176}` }
    ]);
    return;
  }

  fail(`Bilinmeyen hedef: ${targetName}`);
}

function build(targetName) {
  if (!targetName) {
    runMany([
      { name: "web-react", color: "green", cmd: `${npmCmd} run build:web -- --flavor react` },
      { name: "web-vanilla", color: "yellow", cmd: `${npmCmd} run build:web -- --flavor vanilla` },
      { name: "mobile", color: "blue", cmd: `${npxCmd} vite build apps/mobile-react` }
    ]);
    return;
  }

  if (targetName === "web") {
    const flavor = getFlag("flavor", config.targets?.web?.defaultFlavor ?? "react");
    run(npxCmd, viteArgs(appFor(flavor), "build"));
    return;
  }

  if (targetName === "mobile") {
    run(npxCmd, ["vite", "build", "apps/mobile-react"]);
    return;
  }

  if (targetName === "api") {
    console.log("API Node/Express olarak calisir; ayri derleme gerektirmez.");
    return;
  }

  if (targetName === "desktop") {
    console.log("Desktop dev wrapper hazir. Paketleme icin Electron Forge veya electron-builder adapter eklenebilir.");
    return;
  }

  fail(`Bilinmeyen hedef: ${targetName}`);
}

function check() {
  const required = [
    "apps/api/server.js",
    "apps/web-react/index.html",
    "apps/web-vanilla/index.html",
    "apps/mobile-react/index.html",
    "apps/desktop/main.cjs",
    "shared/contracts.js",
    "shared/platform.js"
  ];

  const missing = required.filter((file) => !existsSync(resolve(root, file)));
  if (missing.length) {
    console.error("Eksik dosyalar:");
    for (const file of missing) console.error(`- ${file}`);
    process.exit(1);
  }

  console.log("Uniframe kontrolu basarili.");
  console.log(`Framework: ${config.name ?? "Uniframe"}`);
  console.log("Hedefler: api, web react, web vanilla, mobile, desktop");
}

function help() {
  console.log(`
Uniframe CLI

Komutlar:
  npm run dev                 API + React web + vanilla web
  npm run dev:api             Express API
  npm run dev:web:react       React web
  npm run dev:web:vanilla     Vanilla JS web
  npm run dev:mobile          Mobile-first React hedefi
  npm run dev:desktop         Electron desktop wrapper
  npm run build               Web ve mobile build
  npm run check               Proje saglik kontrolu
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (command === "dev") dev(target);
else if (command === "build") build(target);
else if (command === "check") check();
else help();
