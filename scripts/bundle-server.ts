import { build } from "esbuild";

build({
  entryPoints: ["server/index-prod.ts"],
  platform: "node",
  format: "esm",
  outdir: "dist",
  bundle: true,
  external: ["express", "dotenv"], // add more if needed
}).catch(() => process.exit(1));2
