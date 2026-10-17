// Render preview stills (scaled) for a list of frames: node stills.mjs <outdir> <scale> <frame> [frame...]
// Run from the remotion/ folder so node resolves its node_modules.
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import path from "node:path";

const [outdir, scale, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts")});
const composition = await selectComposition({serveUrl, id: "MasarJadid"});
for (const f of frames) {
  const out = path.join(outdir, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({serveUrl, composition, frame: Number(f), output: out, scale: Number(scale)});
  console.log(out);
}
