import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {DrawIcon} from "./icons";
import {Bg, Body, Drift, GREEN, Heading, INK, leave, MUTED, pop, prog, progIO, RED, Sheen, SwooshPair, Words, clamp} from "./kit";
import {BEAT, BODY, HEAD} from "./theme";

export const At: React.FC<{y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({y, children, style}) => (
  <div style={{position: "absolute", top: y, left: 0, right: 0, ...style}}>{children}</div>
);

/** Logo built from its three layers: calligraphy wipes in right→left, then the swooshes. */
export const Logo: React.FC<{at: number; width: number; cx?: number; cy: number; white?: boolean; glint?: number}> = ({at, width, cx = 540, cy, white, glint}) => {
  const f = useCurrentFrame();
  const h = (width * 500) / 1192;
  const pt = progIO(f, at, 30);
  const pr = progIO(f, at + 18, 22);
  const pg = progIO(f, at + 26, 22);
  const clip = (p: number) => `inset(0 0 0 ${(1 - p) * 100}%)`;
  const base: React.CSSProperties = {position: "absolute", left: 0, top: 0, width, height: h};
  return (
    <div style={{position: "absolute", left: cx - width / 2, top: cy - h / 2, width, height: h}}>
      <Img src={staticFile(white ? "logo_white.png" : "logo_text.png")} style={{...base, clipPath: clip(pt), filter: white ? "none" : undefined}} />
      <Img src={staticFile("logo_red.png")} style={{...base, clipPath: clip(pr)}} />
      <Img src={staticFile("logo_green.png")} style={{...base, clipPath: clip(pg)}} />
      {glint !== undefined && (
        <div style={{...base, WebkitMaskImage: `url(${staticFile("logo.png")})`, WebkitMaskSize: "100% 100%", overflow: "hidden"}}>
          <Sheen at={glint} dur={30} color="rgba(255,255,255,0.95)" />
        </div>
      )}
    </div>
  );
};

/* 1 — INTRO: a path is drawn across the dark, opens to paper, logo writes itself. */
export const Intro: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const open = progIO(f, 34, 26);
  const big = prog(f, 0, 34);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill style={{background: INK, clipPath: `circle(${(1 - open) * 140}% at 50% 50%)`}}>
        <SwooshPair cx={540} cy={960} w={900} p={big} tail={prog(f, 26, 24)} />
      </AbsoluteFill>
      <Drift dur={dur} to={1.06}>
        <Logo at={48} width={900} cy={860} glint={150} />
        <At y={1130}>
          <Words text="رؤية الحزب" at={104} size={64} weight={600} color={MUTED} stagger={6} />
        </At>
        <At y={1250}>
          <div style={{display: "flex", justifyContent: "center", gap: 18, opacity: prog(f, 124, 14)}}>
            {[GREEN, INK, RED].map((c, i) => (
              <div key={i} style={{width: 16, height: 16, borderRadius: 16, background: c, transform: `scale(${pop(f, 124 + i * 5)})`}} />
            ))}
          </div>
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 2 — "Palestine: democratic, secure, prosperous, open to the world" */
const QUALITIES: [string, string, string][] = [
  ["ديمقراطية", "ballot", GREEN],
  ["آمنة", "shield", RED],
  ["مزدهرة", "growth", GREEN],
  ["ومنفتحة على العالم", "globe", RED],
];
export const Tagline: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const t0 = 10;
  const pal = pop(f, t0, 20);
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        <At y={300}>
          <div style={{textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 190, color: INK, transform: `scale(${0.5 + 0.5 * pal})`, opacity: prog(f, t0, 10), letterSpacing: -2}}>فلسطين</div>
          <div style={{display: "flex", justifyContent: "center", marginTop: -10}}>
            <svg width={600} height={40}>
              <path d="M580 12 Q300 34 20 26" stroke={RED} strokeWidth={9} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progIO(f, t0 + 14, 22)} />
              <path d="M590 26 Q340 40 140 36" stroke={GREEN} strokeWidth={6} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progIO(f, t0 + 20, 22)} />
            </svg>
          </div>
        </At>
        {QUALITIES.map(([w, icon, c], i) => {
          const at = 2 * BEAT + 12 + i * 2 * BEAT;
          const p = prog(f, at, 20);
          return (
            <div key={w} style={{position: "absolute", top: 720 + i * 210, left: 130, right: 130, height: 170, display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 40, opacity: p, transform: `translateX(${(1 - p) * 160}px)`}}>
              <div style={{width: 150, height: 150, borderRadius: 150, background: c, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, at, 18)})`, flex: "none"}}>
                <DrawIcon name={icon} at={at + 6} size={84} color="#fff" stroke={3} />
              </div>
              <div style={{direction: "rtl", fontFamily: HEAD, fontWeight: 800, fontSize: i === 3 ? 66 : 96, color: INK, whiteSpace: "nowrap"}}>{w}</div>
            </div>
          );
        })}
      </Drift>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{at: number; text: string; color: string; size?: number}> = ({at, text, color, size = 52}) => {
  const f = useCurrentFrame();
  const s = pop(f, at, 16);
  return (
    <div style={{direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: size, color: "#fff", background: color, padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: 999, transform: `scale(${s})`, opacity: prog(f, at, 8)}}>{text}</div>
  );
};
export {Chip};

/* 3 — the premise: a system that serves the citizen, not the factions. */
export const Premise: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const A = 0, B = 7 * BEAT, C = 13 * BEAT;
  const strike = progIO(f, B + 40, 16);
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        {/* A */}
        <At y={470}>
          <Words text="ينطلق الحزب من قناعة راسخة بأن" at={A + 6} size={46} weight={500} font={BODY} color={MUTED} stagger={2} out={B - 12} />
          <Words text="الشعب الفلسطيني يستحق نظاماً سياسياً" at={A + 22} size={84} weight={800} stagger={4} hi={{"الفلسطيني": GREEN}} out={B - 12} style={{marginTop: 30, padding: "0 60px"}} />
        </At>
        <At y={1050} style={{opacity: leave(f, B - 12, 10)}}>
          <div style={{display: "flex", justifyContent: "center", gap: 26, direction: "rtl"}}>
            <Chip at={A + 3 * BEAT} text="ديمقراطياً" color={GREEN} />
            <Chip at={A + 4 * BEAT} text="عادلاً" color={INK} />
            <Chip at={A + 5 * BEAT} text="حديثاً" color={RED} />
          </div>
        </At>
        {/* B */}
        <At y={760} style={{opacity: leave(f, C - 12, 10)}}>
          <Words text="يخدم" at={B} size={70} weight={600} color={MUTED} />
          <Words text="المواطن" at={B + 6} size={190} weight={800} color={GREEN} mode="scale" style={{marginTop: -10}} />
          <div style={{position: "relative", display: "flex", justifyContent: "center", marginTop: 30}}>
            <div style={{position: "relative", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 96, color: INK, opacity: prog(f, B + 24, 12) * (1 - 0.55 * strike)}}>
              لا الفصائل
              <div style={{position: "absolute", left: -20, right: -20, top: "52%", height: 12, background: RED, borderRadius: 12, transform: `scaleX(${strike})`, transformOrigin: "right"}} />
            </div>
          </div>
        </At>
        {/* C */}
        <At y={560}>
          <Words text="يحمي الحريات" at={C} size={96} weight={800} stagger={5} />
          <Words text="ويفتح أفقاً واقعياً" at={C + 12} size={64} weight={600} color={MUTED} stagger={4} style={{marginTop: 16}} />
        </At>
        <At y={960}>
          {["للاستقلال", "والازدهار", "والسلام"].map((w, i) => {
            const at = C + 2 * BEAT + i * BEAT;
            const p = prog(f, at, 18);
            return (
              <div key={w} style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 26, opacity: p, transform: `translateY(${(1 - p) * 50}px)`}}>
                <div style={{direction: "rtl", fontFamily: HEAD, fontWeight: 800, fontSize: 110, color: [GREEN, INK, RED][i]}}>{w}</div>
              </div>
            );
          })}
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 4 — a unifying national identity (three overlapping circles). */
export const Identity: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const R = 215;
  const centres: [number, number, string, string, number][] = [
    [540, 880, GREEN, "المواطنة\nالمتساوية", 0],
    [420, 1080, INK, "الانتماء\nالوطني", 1],
    [660, 1080, RED, "احترام\nالتنوع", 2],
  ];
  const merge = progIO(f, 9 * BEAT, 24);
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        <Heading title="الهوية الوطنية الفلسطينية" at={4} y={250} size={80} />
        <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
          {centres.map(([x, y, c, , i]) => {
            const at = 2 * BEAT + i * BEAT;
            const p = progIO(f, at, 26);
            const mx = x + (540 - x) * merge * 0.35, my = y + (1013 - y) * merge * 0.35;
            return (
              <g key={i}>
                <circle cx={mx} cy={my} r={R} fill={c} opacity={0.1 * prog(f, at + 10, 20)} />
                <circle cx={mx} cy={my} r={R} fill="none" stroke={c} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-90 ${mx} ${my})`} />
              </g>
            );
          })}
        </svg>
        {centres.map(([x, y, c, label, i]) => {
          const at = 2 * BEAT + i * BEAT + 10;
          const ox = (x - 540) * 0.8, oy = y < 1000 ? -50 : 40;
          return (
            <div key={i} style={{position: "absolute", left: x + ox - 180, top: y + oy - 70, width: 360, textAlign: "center", whiteSpace: "pre-line", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 36, lineHeight: 1.3, color: c, opacity: prog(f, at, 14) * (1 - merge)}}>
              {label}
            </div>
          );
        })}
        <div style={{position: "absolute", top: 945, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: HEAD, fontWeight: 800, fontSize: 92, color: INK, opacity: merge, transform: `scale(${0.7 + 0.3 * merge})`}}>
          هوية جامعة
        </div>
        <At y={1440}>
          <Words text="ترفض كل أشكال" at={11 * BEAT} size={50} weight={600} color={MUTED} font={BODY} />
          <Words text="التمييز · الإقصاء · التحريض" at={11 * BEAT + 8} size={62} weight={800} color={RED} stagger={5} style={{marginTop: 8}} />
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

export const lerp = (f: number, a: number, b: number, x: number, y: number) => interpolate(f, [a, b], [x, y], clamp);
export {Body};
