import { execSync } from "child_process";
import fs from "fs";
import { compile } from "nexe";
import path from "path";

const rootDir = path.join(__dirname, "..");
const finalBuildDir = path.join(rootDir, "build");
const frontendDir = path.join(rootDir, "packages", "frontend");
const frontendBuildDir = path.join(frontendDir, "build");
const backendDir = path.join(rootDir, "packages", "backend");
const backendBuildDir = path.join(backendDir, "build");

// cleanup old files
console.log("Performing cleanup...");
execSync("yarn run clean");

// transpile files
console.log("Transpiling Typescript files...");
execSync("yarn run tsc");

// build frontend
console.log("Building frontend files...");
execSync("yarn run compile:frontend");
console.log("Moving frontend build files to backend dist folder...");
fs.renameSync(frontendBuildDir, path.join(backendBuildDir, "dist"));

// compile executable
console.log("Compiling binaries...");


function doCompile(platform: string) {
    compile({
        input: "packages/backend/build/main.js",
        output: `${finalBuildDir}/${require("../package.json").name}-${platform}`,
        resources: [
            "packages/backend/views/**/*",
            "packages/backend/build/dist/**/*",
            "node_modules/@ccss-support-manual/models/lib/**/*.js",
            "node_modules/@ccss-support-manual/models/package.json",
            "node_modules/@ccss-support-manual/utilities/lib/**/*.js",
            "node_modules/@ccss-support-manual/utilities/package.json",
        ],
        targets: [
            `${platform}`,
        ],
        verbose: true,
        debugBundle: true,
    }).then(() => {
        console.log(`Finished compiling binaries for ${platform}`);
    }).catch((error) => {
        console.error(error);
    });
}

const args = process.argv;
const target: string | undefined = args.find((arg) => arg.startsWith("--target"));
if (target !== undefined) {
    const targetOS = target.split("=")[1];
    switch (targetOS) {
        default:
            break;
        case "all":
            doCompile("windows");
            doCompile("linux");
            doCompile("mac");
            break;
        case "windows":
            doCompile("windows");
            break;
        case "linux":
            doCompile("linux");
            break;
        case "mac":
            doCompile("mac");
            break;
    }
} else {
    console.error("Specify a build target with --target={target}");
}
