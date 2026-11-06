import { build } from "esbuild";
import { exec } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import { stat } from "node:fs/promises";
import { promisify } from "node:util";

const execAsync = promisify(exec);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

let works: Promise<void>[] = [];
let startTime: number | undefined;

function start(tip: string): void {
  console.log(`\ninfo: ${tip}`);
  startTime = performance.now();
}

function end(tip: string): void {
  if (!startTime) throw Error;
  console.log(`\n✔ ${tip} in ${Math.round(performance.now() - startTime)}ms`);
}

function add(file: string | null, func: () => Promise<void>): Promise<void> {
  let work = func();
  if (file) {
    file = `dist/${file}`;
    work = work.then(async () => {
      if (file) {
        const size = formatBytes((await stat(file)).size);
        console.log(`${file}${" ".repeat(30 - file.length - size.length)}${size}`);
      }
    });
  }
  works.push(work);
  return work;
}

start("building...\n");

await mkdir("dist", { recursive: true });
add("fastwd.cjs", async () => {
  await build({
    entryPoints: ["src/index.tsx"],
    outfile: "dist/fastwd.cjs",
    bundle: true,
    minify: true,
    platform: "node",
  });
});
add("install", async () => {
  await copyFile("scripts/install.sh", "dist/install");
});
add("install.ps1", async () => {
  await copyFile("scripts/install.ps1", "dist/install.ps1");
});
add("fastwd", async () => {
  await execAsync("cargo build --release --target x86_64-unknown-linux-musl");
  await copyFile("target/x86_64-unknown-linux-musl/release/fastwd", "dist/fastwd");
});
add("fastwd.exe", async () => {
  await execAsync("cargo build --release --target x86_64-pc-windows-gnu");
  await copyFile("target/x86_64-pc-windows-gnu/release/fastwd.exe", "dist/fastwd.exe");
});

await Promise.all(works);
end("built");
