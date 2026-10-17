import {useEffect, useState} from "react";
import {continueRender, delayRender, staticFile} from "remotion";
import TL from "./timeline.json";

// Brand colours sampled from the supplied logo (median of the solid pixels).
export const RED = "#DF0006";
export const GREEN = "#008041";
export const INK = "#0B0B0C";
export const PAPER = "#F5F2EB";
export const PAPER_2 = "#ECE7DC";
export const MUTED = "#5E5A52";

export const W = 1080;
export const H = 1920;
export const FPS = TL.fps;
export const BEAT = TL.framesPerBeat;
export const BAR = BEAT * TL.beatsPerBar;

export type SceneDef = {id: string; bars: number; mood: string; transition: string; from: number; dur: number};
export type Cut = "scenes" | "short";
const build = (list: {id: string; bars: number; mood: string; transition: string}[]): SceneDef[] => {
  let from = 0;
  return list.map((s) => {
    const d = {...s, from, dur: s.bars * BAR};
    from += d.dur;
    return d;
  });
};
export const CUTS: Record<Cut, SceneDef[]> = {scenes: build(TL.scenes), short: build(TL.short)};
export const SCENES = CUTS.scenes;
export const totalOf = (cut: Cut) => CUTS[cut].reduce((a, s) => a + s.dur, 0);
export const TOTAL = totalOf("scenes");
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;

export const HEAD = "Alexandria";
export const BODY = "Readex Pro";

const FONTS: [string, string, string][] = [
  ...["400", "500", "600", "700", "800"].map((w) => [HEAD, `fonts/alexandria-arabic-${w}-normal.woff2`, w] as [string, string, string]),
  ...["400", "500", "600", "700", "800"].map((w) => [HEAD, `fonts/alexandria-latin-${w}-normal.woff2`, w] as [string, string, string]),
  [BODY, "fonts/readex-pro-arabic-500-normal.woff2", "500"],
  [BODY, "fonts/readex-pro-arabic-600-normal.woff2", "600"],
  [BODY, "fonts/readex-pro-latin-500-normal.woff2", "500"],
  [BODY, "fonts/readex-pro-latin-600-normal.woff2", "600"],
];

export const useFonts = () => {
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(FONTS.map(([fam, file, w]) => new FontFace(fam, `url(${staticFile(file)})`, {weight: w}).load().then((f) => document.fonts.add(f))))
      .catch((e) => console.error(e))
      .finally(() => continueRender(h));
  }, [h]);
};
