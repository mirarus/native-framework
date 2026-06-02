export const manifest = {
  id: "com.mirarus.uniframe",
  name: "Uniframe",
  version: "0.1.0",
  description: "Tek repo icinde API, web, mobile, desktop, React ve vanilla JS hedefleri.",
  targets: {
    api: {
      runtime: "node",
      entry: "apps/api/server.js"
    },
    webReact: {
      runtime: "vite",
      flavor: "react",
      entry: "apps/web-react/src/App.jsx"
    },
    webVanilla: {
      runtime: "vite",
      flavor: "vanilla",
      entry: "apps/web-vanilla/src/main.js"
    },
    mobile: {
      runtime: "vite",
      flavor: "react",
      entry: "apps/mobile-react/src/App.jsx"
    },
    desktop: {
      runtime: "electron",
      entry: "apps/desktop/main.cjs"
    }
  }
};

export function listTargetKeys() {
  return Object.keys(manifest.targets);
}
