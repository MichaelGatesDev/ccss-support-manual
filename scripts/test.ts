import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = path.join(__dirname, "..");
const packagesDir = `${rootDir}/packages`;

const excludedDirectories: string[] = [
];


// build frontend
console.log("==== TESTS STARTED ====");
console.log("");

const packages = fs.readdirSync(packagesDir);
for (const item of packages) {
    if (excludedDirectories.includes(item)) continue;
    console.log(`Running tests in ${packagesDir}/${item}`);
    try {
        execSync(`cd ${packagesDir}/` + item + " && yarn test");
    } catch (error) {
        console.error(error);
        console.error("There was an error running tests");
    }
}

console.log("");
console.log("==== TESTS COMPLETE ====");
console.log("");