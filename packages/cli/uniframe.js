#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { listTargetKeys, manifest } from "../../shared/manifest.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const configPath = resolve(root, "framework.config.js");
const config = existsSync(configPath) ? (await import(pathToFileURL(configPath).href)).default : {};
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const target = args[1];

const getFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const isWindows = process.platform === "win32";
const cliPath = resolve(root, "packages/cli/uniframe.js");

function run(cmd, cmdArgs, options = {}) {
  const command = isWindows ? "cmd.exe" : cmd;
  const commandArgs = isWindows ? ["/d", "/c", quoteCommand([cmd, ...cmdArgs])] : cmdArgs;
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
      return /[\s&()^|<>"]/u.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    })
    .join(" ");
}

async function runMany(commands) {
  const { concurrently } = await import("concurrently");
  const { result } = concurrently(
    commands.map((item) => ({
      command: item.cmd,
      name: item.name
    })),
    {
      cwd: root,
      killOthersOn: ["failure"],
      prefix: "name",
      prefixColors: commands.map((item) => item.color)
    }
  );

  try {
    await result;
  } catch {
    process.exit(1);
  }
}

function viteArgs(app, mode, port) {
  const appRoot = resolve(root, "apps", app);
  const base = ["vite", appRoot, "--host", "0.0.0.0"];
  return mode === "build" ? ["vite", "build", appRoot] : [...base, "--port", String(port)];
}

function appFor(flavor) {
  return flavor === "vanilla" ? "web-vanilla" : "web-react";
}

async function dev(targetName) {
  if (!targetName) {
    await runMany([
      { name: "api", color: "cyan", cmd: `node ${cliPath} dev api` },
      { name: "react", color: "green", cmd: `node ${cliPath} dev web --flavor react` },
      { name: "vanilla", color: "yellow", cmd: `node ${cliPath} dev web --flavor vanilla` }
    ]);
    return;
  }

  if (targetName === "api") {
    run("node", [resolve(root, "apps/api/server.js")]);
    return;
  }

  if (targetName === "web") {
    const flavor = getFlag("flavor", config.targets?.web?.defaultFlavor ?? "react");
    const port =
      flavor === "vanilla"
        ? (config.targets?.web?.vanillaPort ?? 5174)
        : (config.targets?.web?.reactPort ?? 5173);
    run(npxCmd, viteArgs(appFor(flavor), "dev", port));
    return;
  }

  if (targetName === "mobile") {
    run(npxCmd, viteArgs("mobile-react", "dev", config.targets?.mobile?.port ?? 5175));
    return;
  }

  if (targetName === "desktop") {
    await runMany([
      {
        name: "desktop-web",
        color: "green",
        cmd: `${npxCmd} vite apps/web-react --host 127.0.0.1 --port ${config.targets?.desktop?.webPort ?? 5176}`
      },
      {
        name: "electron",
        color: "magenta",
        cmd: `node apps/desktop/wait-and-open.js ${config.targets?.desktop?.webPort ?? 5176}`
      }
    ]);
    return;
  }

  fail(`Bilinmeyen hedef: ${targetName}`);
}

async function build(targetName) {
  if (!targetName) {
    await runMany([
      { name: "web-react", color: "green", cmd: `node ${cliPath} build web --flavor react` },
      { name: "web-vanilla", color: "yellow", cmd: `node ${cliPath} build web --flavor vanilla` },
      { name: "mobile", color: "blue", cmd: `node ${cliPath} build mobile` }
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
    console.log(
      "Desktop dev wrapper hazir. Paketleme icin Electron Forge veya electron-builder adapter eklenebilir."
    );
    return;
  }

  fail(`Bilinmeyen hedef: ${targetName}`);
}

function check() {
  const required = [
    ".github/workflows/ci.yml",
    ".editorconfig",
    ".gitattributes",
    "apps/api/server.js",
    "apps/web-react/index.html",
    "apps/web-vanilla/index.html",
    "apps/mobile-react/index.html",
    "apps/desktop/main.cjs",
    "shared/contracts.js",
    "shared/manifest.js",
    "shared/platform.js",
    "tests/contracts.test.js",
    "tests/cli.test.js",
    "tsconfig.json",
    "eslint.config.js",
    "vitest.config.js"
  ];

  const missing = required.filter((file) => !existsSync(resolve(root, file)));
  const missingScripts = ["ci", "lint", "typecheck", "test", "build", "check"].filter(
    (script) => !packageJson.scripts?.[script]
  );
  const missingDependencies = ["vite", "express", "electron", "react", "react-dom"].filter(
    (dependency) => !packageJson.dependencies?.[dependency]
  );

  if (missing.length) {
    console.error("Eksik dosyalar:");
    for (const file of missing) console.error(`- ${file}`);
    process.exit(1);
  }

  if (missingScripts.length || missingDependencies.length) {
    if (missingScripts.length) {
      console.error("Eksik npm scriptleri:");
      for (const script of missingScripts) console.error(`- ${script}`);
    }

    if (missingDependencies.length) {
      console.error("Eksik runtime dependency'leri:");
      for (const dependency of missingDependencies) console.error(`- ${dependency}`);
    }

    process.exit(1);
  }

  console.log("Uniframe kontrolu basarili.");
  console.log(`Framework: ${config.name ?? "Uniframe"}`);
  console.log(`Hedefler: ${listTargetKeys().join(", ")}`);
}

function clean() {
  const paths = [
    "apps/web-react/dist",
    "apps/web-vanilla/dist",
    "apps/mobile-react/dist",
    "dist",
    ".vite"
  ];

  for (const path of paths) {
    const targetPath = resolve(root, path);
    if (existsSync(targetPath)) {
      rmSync(targetPath, { force: true, recursive: true });
      console.log(`Silindi: ${path}`);
    }
  }
}

function info() {
  console.log(`${manifest.name} ${manifest.version}`);
  console.log(manifest.description);
  console.log("");
  console.log("Hedefler:");
  for (const [key, targetInfo] of Object.entries(manifest.targets)) {
    console.log(`- ${key}: ${targetInfo.runtime} -> ${targetInfo.entry}`);
  }
  console.log("");
  console.log("Portlar:");
  console.log(`- api: ${config.api?.port ?? 4100}`);
  console.log(`- web react: ${config.targets?.web?.reactPort ?? 5173}`);
  console.log(`- web vanilla: ${config.targets?.web?.vanillaPort ?? 5174}`);
  console.log(`- mobile: ${config.targets?.mobile?.port ?? 5175}`);
  console.log(`- desktop web: ${config.targets?.desktop?.webPort ?? 5176}`);
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
  npm run clean               Build ciktilarini temizle
  npm run check               Proje saglik kontrolu
  npm run info                Framework bilgisini yazdir
`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (command === "dev") await dev(target);
else if (command === "build") await build(target);
else if (command === "check") check();
else if (command === "clean") clean();
else if (command === "info") info();
else help();
