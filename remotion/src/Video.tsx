import React from "react";
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from "remotion";
import {clamp, GREEN, INK, RED} from "./kit";
import {Identity, Intro, Premise, Tagline} from "./scenes1";
import {Democracy, Gaza, Justice} from "./scenes2";
import {Digital, Jerusalem, Outro, Pillars, Region, TwoState} from "./scenes3";
import {CUTS, Cut, useFonts} from "./theme";

const COMPONENTS: Record<string, React.FC<{dur: number}>> = {
  intro: Intro, tagline: Tagline, premise: Premise, identity: Identity, gaza: Gaza, democracy: Democracy,
  justice: Justice, pillars: Pillars, jerusalem: Jerusalem, twostate: TwoState, region: Region, digital: Digital, outro: Outro,
};

const T = 14; // half-length of a transition (frames); the cut is hidden at its midpoint

/** Zoom-through on scene edges: new scene settles from 1.08, old scene pushes to 1.06. */
const EdgeZoom: React.FC<{dur: number; first: boolean; last: boolean; children: React.ReactNode}> = ({dur, first, last, children}) => {
  const f = useCurrentFrame();
  const sIn = first ? 1 : interpolate(f, [0, T + 6], [1.08, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const sOut = last ? 1 : interpolate(f, [dur - T, dur], [1, 1.06], {...clamp, easing: (t) => t * t});
  return <AbsoluteFill style={{transform: `scale(${sIn * sOut})`}}>{children}</AbsoluteFill>;
};

/** Diagonal brand band (red/green leading edges + ink body) sweeping right→left. */
const Band: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 2 * T], [1500, -3300], {...clamp, easing: (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)});
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <div style={{position: "absolute", top: -600, height: 3100, left: x, width: 2300, transform: "rotate(-12deg)", display: "flex"}}>
        <div style={{width: 90, background: RED}} />
        <div style={{width: 50, background: GREEN}} />
        <div style={{flex: 1, background: INK}} />
        <div style={{width: 50, background: GREEN}} />
        <div style={{width: 90, background: RED}} />
      </div>
    </AbsoluteFill>
  );
};

/** Iris: red disc grows to cover, then a hole opens to the next scene with a green ring. */
const Iris: React.FC = () => {
  const f = useCurrentFrame();
  const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
  if (f < T) {
    const r = 1150 * ease(f / T);
    return (
      <AbsoluteFill>
        <svg width={1080} height={1920}>
          <circle cx={540} cy={960} r={r * 1.04} fill={GREEN} />
          <circle cx={540} cy={960} r={r} fill={RED} />
        </svg>
      </AbsoluteFill>
    );
  }
  const r = 1150 * ease(Math.min(1, (f - T) / T));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <defs>
          <mask id="hole">
            <rect width={1080} height={1920} fill="#fff" />
            <circle cx={540} cy={960} r={r} fill="#000" />
          </mask>
        </defs>
        <rect width={1080} height={1920} fill={RED} mask="url(#hole)" />
        <circle cx={540} cy={960} r={r} fill="none" stroke={GREEN} strokeWidth={30} opacity={r > 1 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};

/** Split: two ink shutters close from top/bottom along a red/green seam, then open. */
const Split: React.FC = () => {
  const f = useCurrentFrame();
  const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
  const c = f < T ? ease(f / T) : 1 - ease(Math.min(1, (f - T) / T));
  const h = 980 * c;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", top: 0, left: 0, right: 0, height: h, background: INK, borderBottom: `14px solid ${RED}`}} />
      <div style={{position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: INK, borderTop: `14px solid ${GREEN}`}} />
    </AbsoluteFill>
  );
};

const TRANSITIONS: Record<string, React.FC> = {band: Band, iris: Iris, split: Split};

export const Video: React.FC<{cut?: Cut}> = ({cut = "scenes"}) => {
  useFonts();
  const SCENES = CUTS[cut];
  return (
    <AbsoluteFill style={{background: "#fff"}}>
      {SCENES.map((s, i) => {
        const C = COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
            <EdgeZoom dur={s.dur} first={i === 0} last={i === SCENES.length - 1}>
              <C dur={s.dur} />
            </EdgeZoom>
          </Sequence>
        );
      })}
      {SCENES.map((s) => {
        const Tr = TRANSITIONS[s.transition];
        if (!Tr || s.from === 0) return null;
        return (
          <Sequence key={`t-${s.id}`} from={s.from - T} durationInFrames={2 * T} name={`→ ${s.id}`}>
            <Tr />
          </Sequence>
        );
      })}
      <Audio src={staticFile(cut === "short" ? "music_short.wav" : "music.wav")} />
    </AbsoluteFill>
  );
};
