import fs from "fs";

fs.renameSync("packages/frontend/build", "packages/electron/dist/public");
