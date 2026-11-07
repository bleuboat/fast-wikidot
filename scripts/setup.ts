import home from "@/lib/home";
import { end, start } from "./timer";
import { copyFile, cp, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

import "./build";

start("installing...");

// 1. home
await mkdir(home, { recursive: true });

// 2. sandbox
const sandboxDir = join(home, "sandbox");
await mkdir(sandboxDir, { recursive: true });
if (!(await readdir(sandboxDir)).length) await cp("template", sandboxDir, { recursive: true });

// 3. bin
await copyFile("dist/core.cjs", join(home, "core.cjs"));
const target = `${process.platform}-${process.arch}` as const;
let src: string;
switch (target) {
  case "win32-x64":
    src = "windows-amd64";
    break;
  case "win32-arm64":
    src = "windows-arm64";
    break;
  case "darwin-x64":
    src = "darwin-amd64";
    break;
  case "darwin-arm64":
    src = "darwin-arm64";
    break;
  case "linux-x64":
    src = "linux-amd64";
    break;
  case "linux-arm64":
    src = "linux-arm64";
    break;
  default:
    throw Error(`不支持的平台: ${target}`);
}
await copyFile(
  `dist/fastwd-${src}`,
  join(home, process.platform === "win32" ? "fastwd.exe" : "fastwd"),
);

end("installed");
