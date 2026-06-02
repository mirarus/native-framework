#!/usr/bin/env tsx
import { spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { listTargetKeys, manifest } from "../../core/src/index";
import { createProject, parseCreateArgs } from "../../create-uniframe/create-uniframe.js";
import { formatPlatformMatrix, platformMatrix } from "../../platforms/src/index";

interface FrameworkConfig {
  name?: string;
  api?: {
    port?: number;
  };
  targets?: {
    web?: {
      defaultFlavor?: "react" | "vanilla" | "vue";
      reactPort?: number;
      vanillaPort?: number;
      vuePort?: number;
    };
    mobile?: {
      port?: number;
    };
    desktop?: {
      defaultFlavor?: "react" | "vue";
      flavor?: "react" | "vue";
      reactPort?: number;
      vuePort?: number;
      webPort?: number;
    };
  };
}

interface PackageJson {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface ParallelCommand {
  name: string;
  color: string;
  cmd: string;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const configPath = resolve(root, "framework.config.js");
const config: FrameworkConfig = existsSync(configPath)
  ? ((await import(pathToFileURL(configPath).href)).default as FrameworkConfig)
  : {};
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as PackageJson;

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const target = args[1];

const getFlag = (name: string, fallback: string): string => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? (args[index + 1] ?? fallback) : fallback;
};

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const isWindows = process.platform === "win32";
const cliPath = resolve(root, "packages/cli/src/uniframe.ts");

function run(
  cmd: string,
  cmdArgs: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}
) {
  const commandName = isWindows ? "cmd.exe" : cmd;
  const commandArgs = isWindows ? ["/d", "/c", quoteCommand([cmd, ...cmdArgs])] : cmdArgs;
  const child = spawn(commandName, commandArgs, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ...options.env },
    shell: false,
    stdio: "inherit"
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

function quoteCommand(parts: string[]) {
  return parts
    .map((part) => {
      const value = String(part);
      return /[\s&()^|<>"]/u.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
    })
    .join(" ");
}

async function runMany(commands: ParallelCommand[]) {
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

function viteArgs(app: string, mode: "dev" | "build", port?: number): string[] {
  const configFile = resolve(root, "playground", app, "vite.config.ts");
  const base = ["vite", "--config", configFile, "--host", "0.0.0.0"];
  return mode === "build"
    ? ["vite", "build", "--config", configFile]
    : [...base, "--port", String(port)];
}

function appFor(flavor: string) {
  if (flavor === "vanilla") return "web-vanilla";
  if (flavor === "vue") return "web-vue";
  return "web-react";
}

function desktopAppFor(flavor: string) {
  if (flavor === "vue") return "desktop/renderer";
  return "desktop/renderer-react";
}

function portForWebFlavor(flavor: string) {
  if (flavor === "vanilla") return config.targets?.web?.vanillaPort ?? 5174;
  if (flavor === "vue") return config.targets?.web?.vuePort ?? 5177;
  return config.targets?.web?.reactPort ?? 5173;
}

function desktopFlavor() {
  return getFlag(
    "flavor",
    config.targets?.desktop?.defaultFlavor ?? config.targets?.desktop?.flavor ?? "react"
  );
}

function portForDesktopFlavor(flavor: string) {
  if (flavor === "vue") return config.targets?.desktop?.vuePort ?? 5178;
  return config.targets?.desktop?.reactPort ?? config.targets?.desktop?.webPort ?? 5176;
}

async function dev(targetName?: string) {
  if (!targetName) {
    await runMany([
      { name: "api", color: "cyan", cmd: `tsx ${cliPath} dev api` },
      { name: "react", color: "green", cmd: `tsx ${cliPath} dev web --flavor react` },
      { name: "vue", color: "blue", cmd: `tsx ${cliPath} dev web --flavor vue` },
      { name: "vanilla", color: "yellow", cmd: `tsx ${cliPath} dev web --flavor vanilla` }
    ]);
    return;
  }

  if (targetName === "api") {
    run(npxCmd, ["tsx", resolve(root, "playground/api/src/api-server.ts")]);
    return;
  }

  if (targetName === "web") {
    const flavor = getFlag("flavor", config.targets?.web?.defaultFlavor ?? "react");
    run(npxCmd, viteArgs(appFor(flavor), "dev", portForWebFlavor(flavor)));
    return;
  }

  if (targetName === "mobile") {
    run(npxCmd, viteArgs("mobile-react", "dev", config.targets?.mobile?.port ?? 5175));
    return;
  }

  if (targetName === "desktop") {
    const flavor = desktopFlavor();
    const port = portForDesktopFlavor(flavor);
    await runMany([
      {
        name: `desktop-${flavor}`,
        color: "green",
        cmd: `${npxCmd} vite --config playground/${desktopAppFor(flavor)}/vite.config.ts --host 127.0.0.1 --port ${port}`
      },
      {
        name: "electron",
        color: "magenta",
        cmd: `tsx playground/desktop/main/wait-and-open.ts ${port}`
      }
    ]);
    return;
  }

  fail(`Bilinmeyen hedef: ${targetName}`);
}

async function build(targetName?: string) {
  if (!targetName) {
    await runMany([
      { name: "web-react", color: "green", cmd: `tsx ${cliPath} build web --flavor react` },
      { name: "web-vue", color: "blue", cmd: `tsx ${cliPath} build web --flavor vue` },
      { name: "web-vanilla", color: "yellow", cmd: `tsx ${cliPath} build web --flavor vanilla` },
      { name: "mobile", color: "blue", cmd: `tsx ${cliPath} build mobile` },
      { name: "desktop-react", color: "green", cmd: `tsx ${cliPath} build desktop --flavor react` },
      { name: "desktop-vue", color: "blue", cmd: `tsx ${cliPath} build desktop --flavor vue` }
    ]);
    return;
  }

  if (targetName === "web") {
    const flavor = getFlag("flavor", config.targets?.web?.defaultFlavor ?? "react");
    run(npxCmd, viteArgs(appFor(flavor), "build"));
    return;
  }

  if (targetName === "mobile") {
    run(npxCmd, viteArgs("mobile-react", "build"));
    return;
  }

  if (targetName === "api") {
    console.log("API tsx ile calisir; runtime derlemesi gerektirmez.");
    return;
  }

  if (targetName === "desktop") {
    const flavor = desktopFlavor();
    run(npxCmd, viteArgs(desktopAppFor(flavor), "build"));
    return;
  }

  fail(`Bilinmeyen hedef: ${targetName}`);
}

function check() {
  const required = [
    ".github/workflows/ci.yml",
    ".vscode/extensions.json",
    ".vscode/settings.json",
    "docs/platforms.md",
    "playground/api/src/api-server.ts",
    "playground/web-react/index.html",
    "playground/web-react/src/app/app-root.tsx",
    "playground/web-react/src/main.tsx",
    "playground/web-react/vite.config.ts",
    "playground/web-vue/index.html",
    "playground/web-vue/src/app/app-root.vue",
    "playground/web-vue/src/main.ts",
    "playground/web-vue/vite.config.ts",
    "playground/web-vanilla/index.html",
    "playground/web-vanilla/src/main.ts",
    "playground/web-vanilla/vite.config.ts",
    "playground/mobile-react/index.html",
    "playground/mobile-react/src/app/app-root.tsx",
    "playground/mobile-react/src/main.tsx",
    "playground/mobile-react/vite.config.ts",
    "playground/desktop/main/desktop-main.cjs",
    "playground/desktop/preload/desktop-preload.cjs",
    "playground/desktop/renderer-react/src/app/app-root.tsx",
    "playground/desktop/renderer-react/src/main.tsx",
    "playground/desktop/renderer-react/vite.config.ts",
    "playground/desktop/renderer/src/app/app-root.vue",
    "playground/desktop/renderer/vite.config.ts",
    "packages/adapters/src/index.ts",
    "packages/adapters/src/node.ts",
    "packages/adapters/src/types.ts",
    "packages/adapters/src/web.ts",
    "packages/create-uniframe/create-uniframe.js",
    "packages/create-uniframe/package.json",
    "packages/platforms/package.json",
    "packages/platforms/src/adapters/capacitor.ts",
    "packages/platforms/src/adapters/electron.ts",
    "packages/platforms/src/adapters/node.ts",
    "packages/platforms/src/adapters/vite.ts",
    "packages/platforms/src/definitions.ts",
    "packages/platforms/src/index.ts",
    "packages/platforms/src/matrix.ts",
    "packages/vite/src/index.ts",
    "packages/core/src/contracts.ts",
    "packages/core/src/index.ts",
    "packages/core/src/manifest.ts",
    "packages/core/src/platform.ts",
    "packages/cli/src/uniframe.ts",
    "tests/contracts.test.ts",
    "tests/cli.test.ts",
    "tests/create.test.ts",
    "tests/platforms.test.ts",
    "examples/hello-uniframe/package.json",
    "examples/hello-uniframe/src/app/app-root.vue",
    "examples/hello-uniframe/vite.config.ts",
    "examples/fullstack-uniframe/package.json",
    "examples/fullstack-uniframe/apps/api/src/api-server.ts",
    "examples/fullstack-uniframe/apps/web/src/app/app-root.vue",
    "examples/fullstack-uniframe/apps/web/vite.config.ts",
    "examples/fullstack-uniframe/apps/desktop/main.cjs",
    "examples/fullstack-uniframe/apps/desktop/renderer-react/src/app/app-root.tsx",
    "examples/fullstack-uniframe/apps/desktop/renderer-react/src/main.tsx",
    "examples/fullstack-uniframe/apps/desktop/renderer-react/vite.config.ts",
    "examples/fullstack-uniframe/apps/desktop/renderer/src/app/app-root.vue",
    "examples/fullstack-uniframe/apps/desktop/renderer/vite.config.ts",
    "examples/fullstack-uniframe/apps/android/README.md",
    "examples/fullstack-uniframe/capacitor.config.ts",
    "capacitor.config.ts",
    "templates/adapter/adapter.ts",
    "tsconfig.json",
    "eslint.config.js",
    "vitest.config.ts"
  ];

  const missing = required.filter((file) => !existsSync(resolve(root, file)));
  const missingScripts = [
    "ci",
    "lint",
    "typecheck",
    "test",
    "build",
    "build:mobile",
    "build:example",
    "build:packages",
    "check",
    "create",
    "mobile:sync",
    "platforms"
  ].filter((script) => !packageJson.scripts?.[script]);
  const missingDependencies = [
    "@capacitor/android",
    "@capacitor/core",
    "vite",
    "express",
    "electron",
    "react",
    "react-dom",
    "vue"
  ].filter((dependency) => !packageJson.dependencies?.[dependency]);
  const missingDevDependencies = [
    "@capacitor/cli",
    "@vitejs/plugin-vue",
    "tsx",
    "typescript",
    "vite-tsconfig-paths",
    "vue-tsc"
  ].filter((dependency) => !packageJson.devDependencies?.[dependency]);

  if (missing.length) {
    console.error("Eksik dosyalar:");
    for (const file of missing) console.error(`- ${file}`);
    process.exit(1);
  }

  if (missingScripts.length || missingDependencies.length || missingDevDependencies.length) {
    if (missingScripts.length) {
      console.error("Eksik npm scriptleri:");
      for (const script of missingScripts) console.error(`- ${script}`);
    }

    if (missingDependencies.length) {
      console.error("Eksik runtime dependency'leri:");
      for (const dependency of missingDependencies) console.error(`- ${dependency}`);
    }

    if (missingDevDependencies.length) {
      console.error("Eksik TypeScript tool dependency'leri:");
      for (const dependency of missingDevDependencies) console.error(`- ${dependency}`);
    }

    process.exit(1);
  }

  console.log("Uniframe kontrolu basarili.");
  console.log(`Framework: ${config.name ?? "Uniframe"}`);
  console.log(`Hedefler: ${listTargetKeys().join(", ")}`);
  console.log("TypeScript: aktif");
}

function clean() {
  const paths = [
    "playground/web-react/dist",
    "playground/web-vue/dist",
    "playground/web-vanilla/dist",
    "playground/mobile-react/dist",
    "playground/desktop/renderer-react/dist",
    "playground/desktop/renderer/dist",
    "examples/hello-uniframe/dist",
    "examples/fullstack-uniframe/apps/web/dist",
    "examples/fullstack-uniframe/apps/desktop/renderer-react/dist",
    "examples/fullstack-uniframe/apps/desktop/renderer/dist",
    "examples/fullstack-uniframe/dist",
    "packages/core/dist",
    "packages/adapters/dist",
    "packages/vite/dist",
    "packages/platforms/dist",
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
  console.log("Platform stack:");
  console.log(`- ${platformMatrix.runtimeStack.join(" + ")}`);
  console.log("");
  console.log("Portlar:");
  console.log(`- api: ${config.api?.port ?? 4100}`);
  console.log(`- web react: ${config.targets?.web?.reactPort ?? 5173}`);
  console.log(`- web vanilla: ${config.targets?.web?.vanillaPort ?? 5174}`);
  console.log(`- web vue: ${config.targets?.web?.vuePort ?? 5177}`);
  console.log(`- mobile: ${config.targets?.mobile?.port ?? 5175}`);
  console.log(`- desktop react: ${config.targets?.desktop?.reactPort ?? 5176}`);
  console.log(`- desktop vue: ${config.targets?.desktop?.vuePort ?? 5178}`);
}

function platforms() {
  console.log(platformMatrix.name);
  console.log(`Stack: ${platformMatrix.runtimeStack.join(" + ")}`);
  console.log("");

  for (const line of formatPlatformMatrix()) {
    console.log(`- ${line}`);
  }
}

function create() {
  const options = parseCreateArgs(args.slice(1));
  const { projectName, targetDir } = createProject(options);

  console.log(`Uniframe projesi olusturuldu: ${projectName}`);
  console.log(targetDir);
}

function help() {
  console.log(`
Uniframe CLI

Komutlar:
  npm run dev                 API + React web + Vue web + vanilla web
  npm run dev:api             TypeScript Express API
  npm run dev:web:react       React + TypeScript web
  npm run dev:web:vue         Vue + TypeScript web
  npm run dev:web:vanilla     Vanilla TypeScript web
  npm run dev:mobile          Mobile-first React + TypeScript hedefi
  npm run dev:desktop         Electron desktop wrapper (varsayilan React)
  npm run dev:desktop:react   React desktop renderer
  npm run dev:desktop:vue     Vue desktop renderer
  npm run build               Web ve mobile build
  npm run build:mobile        Mobile React build
  npm run mobile:sync         Capacitor native sync
  npm run platforms           Platform matrix bilgisini yazdir
  npx create-uniframe app     Yeni Uniframe projesi olustur
  uniframe create app         CLI uzerinden yeni proje olustur
  npm run clean               Build ciktilarini temizle
  npm run check               Proje saglik kontrolu
  npm run info                Framework bilgisini yazdir
`);
}

function fail(message: string) {
  console.error(message);
  process.exit(1);
}

if (command === "dev") await dev(target);
else if (command === "build") await build(target);
else if (command === "check") check();
else if (command === "clean") clean();
else if (command === "create") create();
else if (command === "info") info();
else if (command === "platforms") platforms();
else help();
