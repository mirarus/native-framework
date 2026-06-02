export default {
  name: "Uniframe Starter",
  api: {
    port: 4100
  },
  targets: {
    web: {
      defaultFlavor: "react",
      reactPort: 5173,
      vanillaPort: 5174,
      vuePort: 5177
    },
    mobile: {
      flavor: "react",
      port: 5175
    },
    desktop: {
      defaultFlavor: "react",
      reactPort: 5176,
      vuePort: 5178,
      webPort: 5176
    }
  }
};
