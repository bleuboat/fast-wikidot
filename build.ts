import { buildSync } from "esbuild";
import { accessSync, copyFileSync, rmSync, statSync } from "node:fs";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

function done(file: string): void {
  const size = formatBytes(statSync(file).size);
  console.log(`${file}${" ".repeat(30 - file.length - size.length)}${size}`);
}

console.log();
const start = performance.now();

try {
  accessSync("dist");
  rmSync("dist", { recursive: true });
} catch {}
buildSync({
  entryPoints: ["index.tsx"],
  outfile: "dist/bin/cli.cjs",
  bundle: true,
  minify: true,
  platform: "node",
});
done("dist/bin/cli.cjs");
copyFileSync("scripts/cli.sh", "dist/bin/fastwd");
done("dist/bin/fastwd");
copyFileSync("scripts/cli.bat", "dist/bin/fastwd.bat");
done("dist/bin/fastwd.bat");
copyFileSync("scripts/cli.ps1", "dist/bin/fastwd.ps1");
done("dist/bin/fastwd.ps1");
copyFileSync("scripts/install.sh", "dist/install");
done("dist/install");
copyFileSync("scripts/install.ps1", "dist/install.ps1");
done("dist/install.ps1");

const end = performance.now();
console.log();

console.log(`✔ built in ${Math.round(end - start)}ms`);
