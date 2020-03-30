import fs from "fs";

fs.renameSync("packages/frontend/build", "packages/application/dist/public");
