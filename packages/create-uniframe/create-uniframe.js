#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const version = "0.1.0";

export function parseCreateArgs(argv) {
  const args = [...argv];
  const options = {
    force: args.includes("--force"),
    install: args.includes("--install"),
    target: args.find((arg) => !arg.startsWith("--"))
  };

  return options;
}

export function createProject(options) {
  const targetName = options.target ?? "uniframe-app";
  const targetDir = resolve(process.cwd(), targetName);
  const projectName = toPackageName(basename(targetDir));

  if (existsSync(targetDir)) {
    const entries = readdirSync(targetDir);
    if (entries.length > 0 && !options.force) {
      throw new Error(`${targetName} klasoru bos degil. Devam etmek icin --force kullan.`);
    }

    if (options.force) {
      rmSync(targetDir, { force: true, recursive: true });
    }
  }

  mkdirSync(targetDir, { recursive: true });

  for (const [filePath, content] of Object.entries(files(projectName))) {
    const destination = join(targetDir, filePath);
    mkdirSync(resolve(destination, ".."), { recursive: true });
    writeFileSync(destination, content);
  }

  if (options.install) {
    const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(npmCommand, ["install"], {
      cwd: targetDir,
      stdio: "inherit"
    });

    if (result.status !== 0) {
      throw new Error("npm install tamamlanamadi.");
    }
  }

  return { projectName, targetDir };
}

function toPackageName(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "uniframe-app";
}

function files(projectName) {
  return {
    "package.json": `${JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: 'concurrently -k --names api,web -c cyan,green "npm run dev:api" "npm run dev:web:react"',
          "dev:api": "tsx apps/api/src/server.ts",
          "dev:web:react": "vite --config apps/web-react/vite.config.ts --host 0.0.0.0 --port 5173",
          "dev:web:vue": "vite --config apps/web-vue/vite.config.ts --host 0.0.0.0 --port 5177",
          "dev:desktop:react":
            'concurrently -k --names desktop-react,desktop -c green,magenta "vite --config apps/desktop/renderer-react/vite.config.ts --host 127.0.0.1 --port 5176" "tsx apps/desktop/wait-and-open.ts 5176"',
          "build:web:react": "vite build --config apps/web-react/vite.config.ts",
          "build:web:vue": "vite build --config apps/web-vue/vite.config.ts",
          "build:mobile": "vite build --config apps/mobile-react/vite.config.ts",
          "mobile:add:android": "cap add android",
          "mobile:sync": "npm run build:mobile && cap sync",
          "mobile:open:android": "cap open android",
          build: "npm run build:web:react && npm run build:web:vue && npm run build:mobile",
          typecheck: "tsc --noEmit && vue-tsc --noEmit -p tsconfig.json"
        },
        dependencies: {
          "@capacitor/android": "^8.0.0",
          "@capacitor/core": "^8.0.0",
          "@uniframe/core": version,
          "@uniframe/vite": version,
          "@vitejs/plugin-react": "^5.0.0",
          "@vitejs/plugin-vue": "^6.0.7",
          concurrently: "^9.2.1",
          electron: "^42.3.2",
          express: "^5.1.0",
          react: "^19.1.1",
          "react-dom": "^19.1.1",
          vite: "^7.1.5",
          vue: "^3.5.35"
        },
        devDependencies: {
          "@capacitor/cli": "^8.0.0",
          "@types/express": "^5.0.6",
          "@types/node": "^25.9.1",
          "@types/react": "^19.2.16",
          "@types/react-dom": "^19.2.3",
          tsx: "^4.22.4",
          typescript: "^6.0.3",
          "vue-tsc": "^3.3.3"
        }
      },
      null,
      2
    )}\n`,
    "README.md": `# ${projectName}\n\nUniframe ile uretilmis coklu hedef proje.\n\n## Komutlar\n\n\`\`\`bash\nnpm install\nnpm run dev:api\nnpm run dev:web:react\nnpm run dev:web:vue\nnpm run dev:desktop:react\nnpm run mobile:sync\nnpm run build\n\`\`\`\n\n## Hedefler\n\n- Node + Express API: \`apps/api\`\n- React + Vite web: \`apps/web-react\`\n- Vue + Vite web: \`apps/web-vue\`\n- Electron + React desktop: \`apps/desktop\`\n- Capacitor + React mobile: \`apps/mobile-react\`\n`,
    "tsconfig.json": `${JSON.stringify(
      {
        compilerOptions: {
          allowImportingTsExtensions: true,
          baseUrl: ".",
          jsx: "react-jsx",
          lib: ["DOM", "DOM.Iterable", "ES2023"],
          module: "ESNext",
          moduleResolution: "Bundler",
          noEmit: true,
          strict: true,
          target: "ES2023",
          types: ["node", "react", "react-dom", "vite/client"]
        },
        include: ["apps/**/*.ts", "apps/**/*.tsx", "apps/**/*.vue", "capacitor.config.ts"]
      },
      null,
      2
    )}\n`,
    "capacitor.config.ts": `import type { CapacitorConfig } from "@capacitor/cli";\n\nconst config: CapacitorConfig = {\n  appId: "com.uniframe.${projectName.replace(/-/g, "")}",\n  appName: "${projectName}",\n  webDir: "apps/mobile-react/dist",\n  server: {\n    androidScheme: "https"\n  }\n};\n\nexport default config;\n`,
    "apps/api/src/server.ts": `import express from "express";\n\nconst app = express();\nconst port = Number(process.env.PORT ?? 4100);\n\napp.get("/health", (_request, response) => {\n  response.json({ ok: true, service: "${projectName}-api" });\n});\n\napp.listen(port, () => {\n  console.log(\`API http://localhost:\${port}\`);\n});\n`,
    "apps/web-react/index.html": html("root", "Uniframe React Web", "/src/main.tsx"),
    "apps/web-react/src/main.tsx": reactMain(),
    "apps/web-react/src/app/App.tsx": reactApp("React Web"),
    "apps/web-react/src/style.css": css("#f8fafc", "#0f172a", "#2563eb"),
    "apps/web-react/vite.config.ts": viteConfig("react"),
    "apps/web-vue/index.html": html("app", "Uniframe Vue Web", "/src/main.ts"),
    "apps/web-vue/src/main.ts": `import { createApp } from "vue";\nimport App from "./app/App.vue";\nimport "./style.css";\n\ncreateApp(App).mount("#app");\n`,
    "apps/web-vue/src/app/App.vue": vueApp("Vue Web"),
    "apps/web-vue/src/style.css": css("#f7fee7", "#1f2937", "#16a34a"),
    "apps/web-vue/vite.config.ts": viteConfig("vue"),
    "apps/mobile-react/index.html": html("root", "Uniframe Mobile", "/src/main.tsx"),
    "apps/mobile-react/src/main.tsx": reactMain(),
    "apps/mobile-react/src/app/App.tsx": reactApp("Mobile React"),
    "apps/mobile-react/src/style.css": css("#ecfeff", "#164e63", "#0891b2"),
    "apps/mobile-react/vite.config.ts": viteConfig("react"),
    "apps/desktop/main.cjs": `const { app, BrowserWindow } = require("electron");\nconst path = require("node:path");\n\nconst url = process.env.UNIFRAME_DESKTOP_URL || "http://127.0.0.1:5176";\n\nfunction createWindow() {\n  const win = new BrowserWindow({\n    width: 1200,\n    height: 780,\n    webPreferences: {\n      preload: path.join(__dirname, "preload.cjs")\n    }\n  });\n  win.loadURL(url);\n}\n\napp.whenReady().then(createWindow);\napp.on("window-all-closed", () => {\n  if (process.platform !== "darwin") app.quit();\n});\n`,
    "apps/desktop/preload.cjs": `const { contextBridge } = require("electron");\n\ncontextBridge.exposeInMainWorld("uniframeDesktop", {\n  platform: process.platform\n});\n`,
    "apps/desktop/wait-and-open.ts": `import { spawn } from "node:child_process";\n\nconst port = process.argv[2] ?? "5176";\nconst url = \`http://127.0.0.1:\${port}\`;\nconst electron = process.platform === "win32" ? "electron.cmd" : "electron";\n\nfor (let attempt = 0; attempt < 60; attempt += 1) {\n  try {\n    const response = await fetch(url);\n    if (response.ok) break;\n  } catch {\n    await new Promise((resolve) => setTimeout(resolve, 500));\n  }\n}\n\nconst child = spawn(electron, ["apps/desktop/main.cjs"], {\n  env: { ...process.env, UNIFRAME_DESKTOP_URL: url },\n  shell: process.platform === "win32",\n  stdio: "inherit"\n});\n\nchild.on("exit", (code) => process.exit(code ?? 0));\n`,
    "apps/desktop/renderer-react/index.html": html(
      "root",
      "Uniframe Desktop React",
      "/src/main.tsx"
    ),
    "apps/desktop/renderer-react/src/main.tsx": reactMain(),
    "apps/desktop/renderer-react/src/app/App.tsx": reactApp("Desktop React"),
    "apps/desktop/renderer-react/src/style.css": css("#f3f4f6", "#111827", "#0f766e"),
    "apps/desktop/renderer-react/vite.config.ts": viteConfig("react")
  };
}

function html(id, title, script) {
  return `<!doctype html>\n<html lang="tr">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${title}</title>\n  </head>\n  <body>\n    <div id="${id}"></div>\n    <script type="module" src="${script}"></script>\n  </body>\n</html>\n`;
}

function reactMain() {
  return `import { createRoot } from "react-dom/client";\nimport { App } from "./app/App";\nimport "./style.css";\n\nconst root = document.getElementById("root");\nif (!root) throw new Error("Root elementi bulunamadi.");\n\ncreateRoot(root).render(<App />);\n`;
}

function reactApp(label) {
  return `import { createGreeting, listCapabilities } from "@uniframe/core";\n\nexport function App() {\n  const greeting = createGreeting("${label}");\n\n  return (\n    <main className="shell">\n      <section className="hero">\n        <p>${label}</p>\n        <h1>{greeting.title}</h1>\n        <span>{greeting.message}</span>\n      </section>\n      <section className="grid">\n        {listCapabilities().slice(0, 6).map((item) => (\n          <article key={item}>{item}</article>\n        ))}\n      </section>\n    </main>\n  );\n}\n`;
}

function vueApp(label) {
  return `<script setup lang="ts">\nimport { createGreeting, listCapabilities } from "@uniframe/core";\n\nconst greeting = createGreeting("${label}");\nconst capabilities = listCapabilities().slice(0, 6);\n</script>\n\n<template>\n  <main class="shell">\n    <section class="hero">\n      <p>${label}</p>\n      <h1>{{ greeting.title }}</h1>\n      <span>{{ greeting.message }}</span>\n    </section>\n    <section class="grid">\n      <article v-for="item in capabilities" :key="item">{{ item }}</article>\n    </section>\n  </main>\n</template>\n`;
}

function css(background, color, accent) {
  return `:root {\n  background: ${background};\n  color: ${color};\n  font-family: Inter, ui-sans-serif, system-ui, sans-serif;\n}\n\nbody {\n  margin: 0;\n}\n\n.shell {\n  margin: 0 auto;\n  max-width: 1100px;\n  padding: 48px 24px;\n}\n\n.hero {\n  border-bottom: 1px solid color-mix(in srgb, ${color} 18%, transparent);\n  padding-bottom: 36px;\n}\n\n.hero p {\n  color: ${accent};\n  font-weight: 800;\n  margin: 0 0 12px;\n  text-transform: uppercase;\n}\n\nh1 {\n  font-size: clamp(2.2rem, 6vw, 4.8rem);\n  line-height: 1;\n  margin: 0 0 16px;\n}\n\n.grid {\n  display: grid;\n  gap: 14px;\n  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));\n  padding-top: 28px;\n}\n\narticle {\n  background: color-mix(in srgb, ${background} 72%, white);\n  border: 1px solid color-mix(in srgb, ${color} 15%, transparent);\n  border-radius: 8px;\n  padding: 18px;\n}\n`;
}

function viteConfig(kind) {
  const pluginImport =
    kind === "vue"
      ? 'import vue from "@vitejs/plugin-vue";'
      : 'import react from "@vitejs/plugin-react";';
  const plugin = kind === "vue" ? "vue()" : "react()";
  return `${pluginImport}\nimport { dirname, resolve } from "node:path";\nimport { fileURLToPath } from "node:url";\nimport { defineUniframeViteConfig } from "@uniframe/vite";\n\nconst appRoot = dirname(fileURLToPath(import.meta.url));\n\nexport default defineUniframeViteConfig(\n  {\n    build: {\n      emptyOutDir: true,\n      outDir: resolve(appRoot, "dist")\n    }\n  },\n  {\n    root: appRoot,\n    plugins: [${plugin}]\n  }\n);\n`;
}

function main() {
  const options = parseCreateArgs(process.argv.slice(2));
  const { projectName, targetDir } = createProject(options);

  console.log(`Uniframe projesi olusturuldu: ${projectName}`);
  console.log(targetDir);
  console.log("");
  console.log("Sonraki adimlar:");
  console.log(`  cd ${projectName}`);
  if (!options.install) console.log("  npm install");
  console.log("  npm run dev:web:react");
  console.log("  npm run dev:api");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
