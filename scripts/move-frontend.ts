import fs from "fs-extra";
import path from "path";

fs.copy(
  path.resolve("./packages/frontend/build"),
  path.resolve("./packages/application/dist/public")
);
