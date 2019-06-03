import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import rimraf from "rimraf";

let rootDir = path.join(__dirname, "..");
let frontendDir = path.join(rootDir, "packages", "frontend/");
let frontendBuildDir = path.join(frontendDir, "build/");
let backendDir = path.join(rootDir, "packages", "backend/");
let backendBuildDir = path.join(backendDir, "build/");

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

rimraf.sync("packages/backend/{build,dist}");