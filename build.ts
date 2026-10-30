import { buildSync } from "esbuild";

buildSync({
  entryPoints: ["src/index.tsx"],
  outfile: "dist/cli.cjs",
  bundle: true,
  minify: true,
  platform: "node",
  banner: { js: "#!/usr/bin/env node" },
});
