import { execSync } from "child_process";
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

function transpile(str: string) {
    try {
        console.log(`Transpiling typescript files in ${str}`);
        const now = new Date().getMilliseconds();
        execSync(`cd ${str} && tsc --build`);
        const later = new Date().getMilliseconds();
        console.log(`Finished transpiling typescript files in ${str} in ${later - now} ms`);
    } catch (error) {
        console.error(`There was an transpiling typescript files  ${str}`);
    }
}
