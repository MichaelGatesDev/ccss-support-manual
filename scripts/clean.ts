import rimraf from "rimraf";

console.log("==== PERFORMING CLEANUP ====");

rimraf.sync("tsconfig.tsbuildinfo");
rimraf.sync("packages/*/{tsconfig.tsbuildinfo,lib,dist,build,application-*}");
rimraf.sync("build");

console.log("==== CLEANUP COMPLETE ====");
console.log("");
