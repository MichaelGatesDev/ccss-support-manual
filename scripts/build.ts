import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import rimraf from "rimraf";

const rootDir = path.join(__dirname, "..");
const finalBuildDir = path.join(rootDir, "build");
const frontendDir = path.join(rootDir, "packages", "frontend/");
const frontendBuildDir = path.join(frontendDir, "build/");
const backendDir = path.join(rootDir, "packages", "backend/");
const backendBuildDir = path.join(backendDir, "build/");



// build frontend
console.log("==== FRONTEND BUILD STARTED ====");
execSync("yarn run build:frontend");
console.log("==== FRONTEND BUILD COMPLETE ====");
console.log("");



fs.renameSync(frontendBuildDir, path.join(backendBuildDir + "dist/"));



// build backend
console.log("==== BACKEND BUILD STARTED ====");
execSync("yarn run build:backend");
console.log("==== BACKEND BUILD COMPLETE ====");
console.log("");



// move files to project root
console.log("==== MOVING BUILD FILES ====");
if (!fs.existsSync(finalBuildDir)) {
    fs.mkdirSync(finalBuildDir);
}
fs.readdirSync(backendDir).forEach(file => {
    if (file.startsWith("application-")) {
        fs.renameSync(path.join(backendDir, file), path.join(finalBuildDir, file));
    }
});
console.log("==== MOVING BUILD FILES COMPLETE ====");
console.log("");



// clean up files
console.log("==== CLEAN UP STARTED ====");
rimraf.sync("packages/backend/{build,dist}");
console.log("==== CLEAN UP COMPLETE ====");
console.log("");