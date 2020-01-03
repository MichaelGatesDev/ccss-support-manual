import rimraf from "rimraf";

console.log("Performing cleanup...");
console.log("");
rimraf.sync("tsconfig.tsbuildinfo");
rimraf.sync("packages/*/{tsconfig.tsbuildinfo,lib,dist,build,application-*}");
rimraf.sync("build");
