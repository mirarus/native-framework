import { spawn } from "node:child_process";
import { resolve } from "node:path";

const port = process.argv[2] ?? "5176";
const url = `http://127.0.0.1:${port}`;
const electron = process.platform === "win32" ? "electron.cmd" : "electron";
const isWindows = process.platform === "win32";

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    }
  }

  throw new Error(`Desktop renderer acilmadi: ${url}`);
}

await waitForServer();

const child = spawn(electron, [resolve("playground/desktop/main/desktop-main.cjs")], {
  env: { ...process.env, UNIFRAME_DESKTOP_URL: url },
  shell: isWindows,
  stdio: "inherit"
});

child.on("exit", (code) => process.exit(code ?? 0));
