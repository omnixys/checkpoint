const fs = require("fs");

if (!process.env.NPM_TOKEN) {
  throw new Error("NPM_TOKEN is missing");
}

fs.writeFileSync(
  ".npmrc",
  `@omnixys:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${process.env.NPM_TOKEN}
always-auth=true
`
);