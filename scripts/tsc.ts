import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const rootDir = path.join(__dirname, "..");
const packagesDir = `${rootDir}/packages`;

// transpile frontend
console.log("==== TYPESCRIPT TRANSPILE STARTED ====");
console.log("");

const packages = [
    "models",
    "utilities",
    "backend",
];
for (const pkg of packages) {
    transpile(`${packagesDir}/${pkg}`);
}

console.log("");
console.log("==== TYPESCRIPT TRANSPILE COMPLETE ====");
console.log("");

function transpile(path: string) {
    try {
        console.log(`Transpiling typescript files in ${path}`);
        const now = new Date().getMilliseconds();
        execSync(`cd ${path} && tsc --build`);
        const later = new Date().getMilliseconds();
        console.log(`Finished transpiling typescript files in ${path} in ${later - now} ms`);
    } catch (error) {
        console.error(`There was an transpiling typescript files  ${path}`);
    }
}
