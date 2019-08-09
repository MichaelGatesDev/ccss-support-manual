import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = path.join(__dirname, "..");
const packagesDir = `${rootDir}/packages`;

const excludedDirectories: string[] = [
    "frontend"
];


// build frontend
console.log("==== TYPESCRIPT BUILD STARTED ====");
console.log("");

const packages = fs.readdirSync(packagesDir);
for (const item of packages) {
    if (excludedDirectories.includes(item)) continue;
    console.log(`Building typescript files in ${packagesDir}/${item}`);
    try {
        execSync(`cd ${packagesDir}/` + item + " && tsc --build");
    } catch (error) {
        // console.error(error);
        console.error("There was an building typescript files");
    }
}

console.log("");
console.log("==== TYPESCRIPT BUILD COMPLETE ====");
console.log("");