const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");

const targetUrl = process.env.UNIFRAME_DESKTOP_URL || "http://127.0.0.1:5176";

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 840,
    minHeight: 560,
    title: "Uniframe Desktop Playground",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, "../preload/desktop-preload.cjs")
    }
  });

  window.loadURL(targetUrl);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
