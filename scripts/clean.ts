import rimraf from "rimraf";

console.log("Performing cleanup...");
console.log("");
rimraf.sync("packages/*/{*.tsbuildinfo,lib,dist,build,application-*}");