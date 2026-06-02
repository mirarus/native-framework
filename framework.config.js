export default {
  name: "Uniframe Starter",
  api: {
    port: 4100
  },
  targets: {
    web: {
      defaultFlavor: "react",
      reactPort: 5173,
      vanillaPort: 5174
    },
    mobile: {
      flavor: "react",
      port: 5175
    },
    desktop: {
      flavor: "react",
      webPort: 5176
    }
  }
};
