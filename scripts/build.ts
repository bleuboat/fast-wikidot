import { build } from "esbuild";
import { exec } from "node:child_process";
import { copyFile, cp, mkdir } from "node:fs/promises";
import { stat } from "node:fs/promises";
import { promisify } from "node:util";
import { end, start } from "./timer";

const execAsync = promisify(exec);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

let works: Promise<void>[] = [];

function add(file: string | null, func: () => Promise<void>): Promise<void> {
  let work = func();
  if (file) {
    const distFile = `dist/${file}`;
    work = work.then(async () => {
      const distStat = await stat(distFile);
      if (distStat.isDirectory()) return;
      const size = formatBytes(distStat.size);
      console.log(`${distFile}${" ".repeat(40 - distFile.length - size.length)}${size}`);
    });
  }
  works.push(work);
  return work;
}

start("building...\n");

await mkdir("dist", { recursive: true });
add("core.cjs", async () => {
  await build({
    entryPoints: ["src/index.tsx"],
    outfile: "dist/core.cjs",
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
add("template", async () => {
  await cp("template", "dist/template", { recursive: true });
});

for (const os of ["windows", "darwin", "linux"]) {
  for (const arch of ["amd64", "arm64"]) {
    const file = `fastwd-${os}-${arch}`;
    add(file, async () => {
      await execAsync(
        `GOOS=${os} GOARCH=${arch} CGO_ENABLED=0 go build -o dist/${file} scripts/cli.go`,
      );
    });
  }
}

await Promise.all(works);
end("built");
