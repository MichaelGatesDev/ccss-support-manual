import { execSync } from "child_process";
import fs from "fs";
import { compile } from "nexe";
import path from "path";

import rootPackageJson from "../package.json";

const rootDir = path.join(__dirname, "..");
const finalBuildDir = path.join(rootDir, "build");
const frontendDir = path.join(rootDir, "packages", "frontend");
const frontendBuildDir = path.join(frontendDir, "build");
const backendDir = path.join(rootDir, "packages", "backend");
const backendBuildDir = path.join(backendDir, "build");

// cleanup old files
console.log("Performing cleanup...");
execSync("yarn run clean", { stdio: "inherit" });

// transpile files
console.log("Transpiling Typescript files...");
execSync("yarn run tsc", { stdio: "inherit" });

// build frontend
console.log("Building frontend files...");
execSync("yarn workspace @ccss-support-manual/frontend run build", { stdio: "inherit" });
console.log("Moving frontend build files to backend dist folder...");
fs.renameSync(frontendBuildDir, path.join(backendBuildDir, "dist"));


function compileNEXE(platform: string): Promise<void> {
    return compile({
        input: "packages/backend/build/main.js",
        output: `${finalBuildDir}/${rootPackageJson.name}-${platform}`,
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

function compilePKG(platform: string): void {
    const cmd = `yarn run pkg ${backendDir}`;
    const outputParam = `--output=${path.join(finalBuildDir, rootPackageJson.name)}-${platform}`;
    const targetParam = `--targets=node10-${platform}`;
    execSync(`${cmd} ${outputParam} ${targetParam}`, { stdio: "inherit" });
}

// compile executable
console.log("Compiling binaries...");

const args = process.argv;
const target: string | undefined = args.find((arg) => arg.startsWith("--target"));
if (target === undefined) { throw new Error("Specify a build target with --target={target}"); }
const system: string | undefined = args.find((arg) => arg.startsWith("--system"));
if (system === undefined) { throw new Error("Specify a build system with --system={system}"); }

const targetOS = target.split("=")[1];
const targetSystem = system.split("=")[1];
switch (targetOS) {
    default:
        break;
    case "all":
        targetSystem === "pkg" ? compilePKG("windows") : compileNEXE("windows");
        targetSystem === "pkg" ? compilePKG("linux") : compileNEXE("linux");
        targetSystem === "pkg" ? compilePKG("mac") : compileNEXE("mac");
        break;
    case "windows":
        targetSystem === "pkg" ? compilePKG("windows") : compileNEXE("windows");
        break;
    case "linux":
        targetSystem === "pkg" ? compilePKG("linux") : compileNEXE("linux");
        break;
    case "mac":
        targetSystem === "pkg" ? compilePKG("mac") : compileNEXE("mac");
        break;
}
