const fs = require("fs");

const args = process.argv.slice(2);
const shouldRemove = args.includes("--remove");

const NPMRC_PATH = ".npmrc";

function removeNpmrc() {
  if (fs.existsSync(NPMRC_PATH)) {
    fs.rmSync(NPMRC_PATH);
    console.log(`[setup-npmrc] Removed ${NPMRC_PATH}`);
  }
}

if (shouldRemove) {
  removeNpmrc();
  process.exit(0);
}

let bootstrapEnv;
try {
  ({ bootstrapEnv } = require("./env.js"));
} catch (err) {
  console.error(
    `\n[setup-npmrc] ${err.message}\n` +
      `The private @omnixys/* packages are served from the GitHub Packages registry.\n` +
      `Export the token before installing, e.g.:\n\n` +
      `  export OMNIXYS_TOKEN=<your-github-token-with-read:packages>\n` +
      `  pnpm registry:setup\n\n` +
      `Then run pnpm install. The .npmrc is generated locally and is git-ignored.\n`
  );
  process.exit(1);
}

fs.writeFileSync(
  NPMRC_PATH,
  `@omnixys:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${bootstrapEnv.OMNIXYS_TOKEN}
always-auth=true
`
);

console.log(`[setup-npmrc] Wrote ${NPMRC_PATH} (git-ignored, never committed)`);
