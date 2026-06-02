const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("uniframeDesktop", {
  runtime: "electron",
  platform: process.platform
});
