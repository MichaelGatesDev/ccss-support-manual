"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const rimraf_1 = __importDefault(require("rimraf"));
const rootDir = path_1.default.join(__dirname, "..");
const finalBuildDir = path_1.default.join(rootDir, "build");
const frontendDir = path_1.default.join(rootDir, "packages", "frontend/");
const frontendBuildDir = path_1.default.join(frontendDir, "build/");
const backendDir = path_1.default.join(rootDir, "packages", "backend/");
const backendBuildDir = path_1.default.join(backendDir, "build/");
// build frontend
console.log("==== FRONTEND BUILD STARTED ====");
child_process_1.execSync("yarn run build:frontend");
console.log("==== FRONTEND BUILD COMPLETE ====");
console.log("");
fs_1.default.renameSync(frontendBuildDir, path_1.default.join(backendBuildDir + "dist/"));
// build backend
console.log("==== BACKEND BUILD STARTED ====");
child_process_1.execSync("yarn run build:backend");
console.log("==== BACKEND BUILD COMPLETE ====");
console.log("");
// move files to project root
console.log("==== MOVING BUILD FILES ====");
if (!fs_1.default.existsSync(finalBuildDir)) {
    fs_1.default.mkdirSync(finalBuildDir);
}
fs_1.default.readdirSync(backendDir).forEach(file => {
    if (file.startsWith("application-")) {
        fs_1.default.renameSync(path_1.default.join(backendDir, file), path_1.default.join(finalBuildDir, file));
    }
});
console.log("==== MOVING BUILD FILES COMPLETE ====");
console.log("");
// clean up files
console.log("==== CLEAN UP STARTED ====");
rimraf_1.default.sync("packages/backend/{build,dist}");
console.log("==== CLEAN UP COMPLETE ====");
console.log("");
