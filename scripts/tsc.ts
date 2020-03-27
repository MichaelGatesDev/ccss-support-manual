import { execSync } from "child_process";

const ordered_packages = ["models", "utilities", "backend"];
for (const pkg of ordered_packages) {
  console.log(`Transpiling package: ${pkg}`);
  execSync(`cd packages/${pkg} && yarn run tsc`, {
    stdio: "inherit",
  });
}
