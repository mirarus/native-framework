const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const file = resolve(__dirname, "../dist/uniframe.js");
const content = readFileSync(file, "utf8").replace(/^#!\/usr\/bin\/env tsx\r?\n/u, "");

if (!content.startsWith("#!/usr/bin/env node")) {
  writeFileSync(file, `#!/usr/bin/env node\n${content}`);
}
