const fs = require("fs");
const { bootstrapEnv } = require("./env.js");

fs.writeFileSync(
  ".npmrc",
  `@omnixys:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${bootstrapEnv.OMNIXYS_TOKEN}
always-auth=true
`
);
