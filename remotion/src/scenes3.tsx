import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame} from "remotion";
import {DrawIcon} from "./icons";
import {Bg, clamp, Drift, GREEN, Heading, INK, leave, MUTED, pop, prog, progIO, RED, Sheen, SwooshPair, Words} from "./kit";
import {At, Chip, Logo} from "./scenes1";
import {BEAT, BODY, HEAD} from "./theme";

const GOLD = "#D6A93C";

/* 8 — the four pillars of the Palestinian state (dark, cards flip in). */
const PILLARS: [string, string, string, string][] = [
  ["shield", "آمنة", "تحتكر السلاح بيد المؤسسات الشرعية وتفرض سيادة القانون", RED],
  ["dove", "معتدلة", "ترفض التطرف والعنف والتحريض وتعزز قيم التسامح", GREEN],
  ["ballot", "ديمقراطية", "مؤسسات منتخبة وتداول سلمي للسلطة ومساءلة", RED],
  ["chip", "متطورة", "اقتصاد تنافسي حديث يستثمر في التعليم والابتكار والتكنولوجيا", GREEN],
];
export const Pillars: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg dark tint="rgba(0,128,65,0.12)" />
      <Drift dur={dur} to={1.03}>
        <At y={200}>
          <div style={{textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 210, lineHeight: 1, color: RED, opacity: prog(f, 0, 14), transform: `scale(${pop(f, 0, 20)})`}}>4</div>
        </At>
        <Heading title="ركائز الدولة الفلسطينية" at={6} y={400} size={68} dark />
        {PILLARS.map(([ic, t, d, c], i) => {
          const at = 3 * BEAT + i * 3 * BEAT;
          const p = progIO(f, at, 22);
          const rot = (1 - p) * -90;
          return (
            <div key={i} style={{position: "absolute", left: 80, right: 80, top: 630 + i * 255, height: 235, perspective: 1400}}>
              <div style={{position: "absolute", inset: 0, borderRadius: 28, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.14)", transform: `rotateX(${rot}deg)`, transformOrigin: "top", opacity: p > 0 ? 1 : 0, overflow: "hidden"}}>
                <div style={{position: "absolute", right: 0, top: 0, bottom: 0, width: 200, background: c, display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <DrawIcon name={ic} at={at + 10} size={110} color="#fff" stroke={2.8} />
                </div>
                <div style={{position: "absolute", right: 230, left: 40, top: 26, direction: "rtl"}}>
                  <div style={{display: "flex", alignItems: "baseline", gap: 18}}>
                    <span style={{fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: "#fff"}}>دولة {t}</span>
                    <span style={{fontFamily: HEAD, fontWeight: 700, fontSize: 30, color: c === RED ? "#ff6b6b" : "#4bd38a", opacity: 0.9}}>0{i + 1}</span>
                  </div>
                  <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 33, lineHeight: 1.4, color: "rgba(255,255,255,0.75)", opacity: prog(f, at + 16, 14), marginTop: 6}}>{d}</div>
                </div>
                <Sheen at={at + 3 * BEAT * (3 - i) + 6 * BEAT} dur={30} color="rgba(255,255,255,0.18)" />
              </div>
            </div>
          );
        })}
      </Drift>
    </AbsoluteFill>
  );
};

/** Line drawing of the Dome of the Rock, gold dome fills in. */
const Dome: React.FC<{at: number; cx: number; base: number; s?: number}> = ({at, cx, base, s = 1}) => {
  const f = useCurrentFrame();
  const d = (k: number, len = 30) => 1 - progIO(f, at + k, len);
  const fill = prog(f, at + 40, 30);
  const L = {stroke: "#fff", strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: 1};
  return (
    <svg width={1080} height={900} viewBox="0 0 1080 900" style={{position: "absolute", left: 0, top: base - 900}}>
      <g transform={`translate(${cx} 900) scale(${s}) translate(-540 -900)`}>
        {/* dome */}
        <path d="M380 470 C380 330 450 250 540 230 C630 250 700 330 700 470 Z" fill={GOLD} opacity={fill} />
        <path d="M380 470 C380 330 450 250 540 230 C630 250 700 330 700 470" {...L} strokeDashoffset={d(10)} />
        {/* finial + crescent */}
        <path d="M540 230 L540 175" {...L} strokeDashoffset={d(30, 12)} />
        <path d="M528 168 A14 14 0 1 0 552 160" {...L} strokeDashoffset={d(36, 12)} />
        {/* drum */}
        <path d="M370 470 H710 V560 H370 Z" {...L} strokeDashoffset={d(4)} />
        {[400, 450, 500, 550, 600, 650].map((x, i) => (
          <path key={x} d={`M${x + 10} 545 V505 a10 10 0 0 1 20 0 V545`} {...L} strokeWidth={4} strokeDashoffset={d(14 + i * 2, 16)} />
        ))}
        {/* octagon body */}
        <path d="M200 560 H880 V820 H200 Z" {...L} strokeDashoffset={d(0)} />
        <path d="M200 610 H880" {...L} strokeWidth={3} strokeDashoffset={d(8)} />
        {[240, 330, 420, 510, 600, 690, 780].map((x, i) => (
          <path key={x} d={`M${x + 15} 800 V690 a30 30 0 0 1 60 0 V800`} {...L} strokeWidth={4} strokeDashoffset={d(16 + i * 2, 18)} />
        ))}
        <path d="M120 830 H960" {...L} strokeWidth={6} strokeDashoffset={d(0, 20)} />
      </g>
    </svg>
  );
};

/* 9 — Jerusalem. */
export const Jerusalem: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg dark tint="rgba(214,169,60,0.16)" />
      <Drift dur={dur} to={1.05}>
        <Dome at={4} cx={540} base={1080} s={0.95} />
        <At y={1090}>
          <Words text="القدس" at={2 * BEAT} size={170} weight={800} color="#fff" mode="scale" />
          <Words text="قلب الهوية الوطنية الفلسطينية" at={3 * BEAT + 6} size={50} weight={700} color={GOLD} stagger={3} />
        </At>
        <At y={1440}>
          <Words text="القدس الشرقية عاصمة الدولة الفلسطينية" at={6 * BEAT} size={50} weight={800} color="#fff" stagger={3} hi={{"عاصمة": "#4bd38a"}} style={{padding: "0 60px"}} />
          <Words text="وحرية العبادة والوصول إلى الأماكن المقدسة للجميع" at={9 * BEAT} size={36} weight={500} font={BODY} color="rgba(255,255,255,0.7)" stagger={2} style={{marginTop: 22, padding: "0 70px"}} />
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 10 — political settlement & two-state solution (schematic map, not to scale). */
export const TwoState: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const B = 5 * BEAT, C = 15 * BEAT;
  const outA = leave(f, B - 8, 10);
  const year = Math.round(interpolate(f, [BEAT, 3 * BEAT], [1900, 1967], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)}));
  const map = progIO(f, B + 4, 30);
  const link = progIO(f, B + 3 * BEAT, 30);
  const outB = leave(f, C - 10, 10);
  const WB = "M640 650 C700 640 760 660 790 700 C820 760 800 830 815 900 C830 980 800 1060 760 1110 C720 1150 650 1150 610 1110 C570 1060 585 990 570 920 C555 840 560 760 585 700 C600 670 615 655 640 650 Z";
  const GZ = "M300 1170 C320 1150 345 1140 360 1150 C370 1160 340 1210 300 1260 C260 1310 225 1350 205 1345 C190 1340 205 1300 235 1255 C260 1220 285 1190 300 1170 Z";
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        <Heading title="التسوية السياسية وحل الدولتين" at={4} y={210} size={74} out={C - 10} />
        {/* A: 1967 */}
        <div style={{opacity: outA}}>
          <At y={560}>
            <Words text="حدود الرابع من حزيران / يونيو" at={BEAT} size={60} weight={700} color={MUTED} stagger={3} />
            <div style={{textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 280, color: INK, letterSpacing: 4, opacity: prog(f, BEAT, 10)}}>{year}</div>
            <Words text="مع تبادل أراضٍ متفق عليه" at={3 * BEAT + 4} size={56} weight={700} color={GREEN} stagger={3} />
          </At>
        </div>
        {/* B: map */}
        <div style={{opacity: outB}}>
          <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: map > 0 ? 1 : 0}}>
            <path d={WB} fill={GREEN} fillOpacity={0.14 * map} stroke={GREEN} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - map} />
            <path d={GZ} fill={GREEN} fillOpacity={0.14 * map} stroke={GREEN} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - map} />
            {Array.from({length: 22}, (_, k) => {
              const t = k / 21;
              const x = (1 - t) ** 3 * 335 + 3 * (1 - t) ** 2 * t * 420 + 3 * (1 - t) * t * t * 520 + t ** 3 * 600;
              const y = (1 - t) ** 3 * 1185 + 3 * (1 - t) ** 2 * t * 1120 + 3 * (1 - t) * t * t * 1020 + t ** 3 * 960;
              return <circle key={k} cx={x} cy={y} r={7 * pop(f, B + 3 * BEAT + k * 1.3, 10)} fill={k % 2 ? GREEN : RED} />;
            })}
            <circle cx={700} cy={930} r={16 * pop(f, B + 2 * BEAT, 16)} fill={RED} />
            <circle cx={700} cy={930} r={16 + 40 * ((f % 40) / 40)} fill="none" stroke={RED} strokeWidth={3} opacity={(f > B + 2 * BEAT ? 1 : 0) * (1 - (f % 40) / 40)} />
          </svg>
          <div style={{position: "absolute", left: 720, top: 905, direction: "rtl", fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: RED, opacity: prog(f, B + 2 * BEAT + 6, 12)}}>القدس</div>
          <div style={{position: "absolute", left: 600, top: 1170, width: 300, textAlign: "center", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: GREEN, opacity: prog(f, B + 24, 14)}}>الضفة الغربية</div>
          <div style={{position: "absolute", left: 100, top: 1370, width: 300, textAlign: "center", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: GREEN, opacity: prog(f, B + 30, 14)}}>قطاع غزة</div>
          <At y={500}>
            <Words text="تواصل جغرافي بين الضفة والقطاع" at={B + 3 * BEAT + 10} size={52} weight={800} stagger={3} hi={{"تواصل": RED, "جغرافي": RED}} />
          </At>
          <At y={1530}>
            <Words text="والقدس الشرقية عاصمة للدولة الفلسطينية" at={B + 6 * BEAT} size={46} weight={700} color={INK} stagger={3} />
          </At>
        </div>
        {/* C: right of return */}
        <At y={600}>
          <div style={{display: "flex", justifyContent: "center", opacity: prog(f, C, 10)}}>
            <DrawIcon name="key" at={C} size={190} color={RED} stroke={2.6} />
          </div>
          <Words text="حق العودة" at={C + 8} size={130} weight={800} color={INK} mode="scale" style={{marginTop: 20}} />
          <Words text="لكل فلسطيني إلى دولة فلسطين" at={C + 20} size={54} weight={700} color={GREEN} stagger={3} />
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 22, marginTop: 70}}>
            <Chip at={C + 3 * BEAT} text="تعويض عادل وكامل للاجئين" color={INK} size={44} />
            <Chip at={C + 4 * BEAT} text="وخيارات اندماج طوعية متفق عليها" color={GREEN} size={40} />
          </div>
          <Words text="وفق الاتفاقات الدولية" at={C + 5 * BEAT} size={38} weight={500} font={BODY} color={MUTED} style={{marginTop: 30}} />
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 11 — regional integration & peace: a network connects, violence rejected. */
export const Region: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const nodes = Array.from({length: 9}, (_, i) => {
    const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
    return [540 + Math.cos(a) * 330, 900 + Math.sin(a) * 300] as [number, number];
  });
  const edges: [number, number][] = [];
  nodes.forEach((_, i) => {
    edges.push([i, (i + 1) % 9]);
    edges.push([i, (i + 3) % 9]);
  });
  const outA = leave(f, 9 * BEAT, 10);
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        <Heading title="الاندماج الإقليمي والسلام" at={4} y={210} size={78} />
        <div style={{opacity: outA}}>
          <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
            {edges.map(([a, b], k) => {
              const p = progIO(f, BEAT + k * 2, 20);
              const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
              return <line key={k} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={k % 2 ? GREEN : INK} strokeWidth={3} opacity={0.35} />;
            })}
            {nodes.map(([x, y], i) => {
              const p = progIO(f, 2 * BEAT + i * 2, 18);
              return <line key={`c${i}`} x1={540} y1={900} x2={540 + (x - 540) * p} y2={900 + (y - 900) * p} stroke={RED} strokeWidth={4} opacity={0.6} />;
            })}
            {nodes.map(([x, y], i) => (
              <circle key={`n${i}`} cx={x} cy={y} r={22 * pop(f, BEAT + i * 3, 14)} fill={i % 2 ? GREEN : INK} />
            ))}
            <circle cx={540} cy={900} r={110 * pop(f, 2 * BEAT, 18)} fill="#fff" stroke={RED} strokeWidth={6} />
          </svg>
          <div style={{position: "absolute", left: 470, top: 830, opacity: prog(f, 2 * BEAT + 6, 12)}}>
            <DrawIcon name="handshake" at={2 * BEAT + 6} size={140} color={INK} stroke={2.4} />
          </div>
          <At y={1300}>
            <Words text="تعاون اقتصادي · أمني · دبلوماسي" at={4 * BEAT} size={52} weight={800} stagger={4} hi={{"اقتصادي": GREEN, "دبلوماسي": RED}} />
            <Words text="السلام والاستقرار أساس التنمية والازدهار المشترك" at={6 * BEAT} size={38} weight={500} font={BODY} color={MUTED} stagger={2} style={{marginTop: 20, padding: "0 60px"}} />
          </At>
        </div>
        <At y={680}>
          <Words text="يرفض الحزب العنف" at={10 * BEAT} size={84} weight={800} stagger={4} hi={{"العنف": RED}} />
          <Words text="كأداة سياسية" at={10 * BEAT + 10} size={60} weight={700} color={MUTED} />
          <Words text="ويؤمن بأن الطريق هو" at={11 * BEAT + 8} size={44} weight={500} font={BODY} color={MUTED} style={{marginTop: 60}} />
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 34}}>
            <Chip at={12 * BEAT} text="الحوار" color={GREEN} size={64} />
            <Chip at={12 * BEAT + 9} text="الإقناع" color={INK} size={64} />
            <Chip at={13 * BEAT} text="العمل السياسي والدبلوماسي السلمي" color={RED} size={46} />
          </div>
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 12 — good governance & digital transformation (dark, circuit traces + data rain). */
export const Digital: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const B = 8 * BEAT;
  const tiles: [string, string][] = [["check", "الكفاءة"], ["eye", "الشفافية"], ["scales", "المساءلة"], ["gavel", "مكافحة الفساد"]];
  const traces = Array.from({length: 14}, (_, i) => {
    const x = 60 + random(`x${i}`) * 960, y = 300 + random(`y${i}`) * 1400;
    const dx = (random(`d${i}`) > 0.5 ? 1 : -1) * (120 + random(`l${i}`) * 220);
    return `M${x} ${y} h${dx} l60 60 v${80 + random(`v${i}`) * 140}`;
  });
  return (
    <AbsoluteFill>
      <Bg dark tint="rgba(0,128,65,0.18)" />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {traces.map((d, i) => {
          const p = progIO(f, B - 20 + i * 4, 40);
          return (
            <g key={i} opacity={0.5}>
              <path d={d} stroke={i % 3 ? "#1e9e5c" : RED} strokeWidth={3} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
            </g>
          );
        })}
      </svg>
      <Drift dur={dur}>
        <Heading title="الحكم الرشيد والتحول الرقمي" at={4} y={210} size={74} dark />
        <div style={{opacity: leave(f, B - 10, 10)}}>
          <At y={500}>
            <Words text="مؤسسات عامة تقوم على" at={BEAT} size={48} weight={600} color="rgba(255,255,255,0.7)" font={BODY} />
          </At>
          {tiles.map(([ic, t], i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const at = 2 * BEAT + i * BEAT;
            const p = pop(f, at, 18);
            return (
              <div key={i} style={{position: "absolute", left: col === 0 ? 560 : 120, top: 640 + row * 420, width: 400, height: 380, borderRadius: 32, background: "rgba(255,255,255,0.06)", border: `2px solid ${i % 2 ? RED : "#1e9e5c"}`, transform: `scale(${p})`, opacity: prog(f, at, 8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26}}>
                <DrawIcon name={ic} at={at + 4} size={130} color="#fff" stroke={2.6} />
                <div style={{direction: "rtl", fontFamily: HEAD, fontWeight: 800, fontSize: 50, color: "#fff"}}>{t}</div>
              </div>
            );
          })}
        </div>
        <At y={520}>
          <div style={{display: "flex", justifyContent: "center", opacity: prog(f, B, 12)}}>
            <DrawIcon name="ai" at={B} size={220} color="#4bd38a" stroke={2.2} />
          </div>
          {["التكنولوجيا", "التحول الرقمي", "الذكاء الاصطناعي"].map((t, i) => (
            <Words key={t} text={t} at={B + 12 + i * BEAT} size={i === 2 ? 96 : 84} weight={800} color={i === 2 ? "#4bd38a" : "#fff"} style={{marginTop: i ? 6 : 50}} />
          ))}
          <Words text="أدوات لتطوير الإدارة العامة وتعزيز المشاركة الديمقراطية وتحقيق التنمية المستدامة" at={B + 4 * BEAT} size={40} weight={500} font={BODY} color="rgba(255,255,255,0.75)" stagger={2} style={{marginTop: 50, padding: "0 80px"}} />
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 13 — OUTRO: logo returns, tagline, all four qualities, fade. */
export const Outro: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const end = leave(f, dur - 20, 20);
  return (
    <AbsoluteFill>
      <Bg />
      <SwooshPair cx={540} cy={1600} w={1300} p={progIO(f, 0, 30)} />
      <Drift dur={dur} from={1.04} to={1}>
        <Logo at={10} width={940} cy={760} glint={4 * BEAT} />
        <At y={1040}>
          <Words text="لبناء مستقبل أفضل" at={3 * BEAT} size={76} weight={800} stagger={4} />
          <Words text="للأجيال القادمة" at={3 * BEAT + 14} size={76} weight={800} color={GREEN} stagger={4} />
        </At>
        <At y={1310}>
          <Words text="فلسطين ديمقراطية، آمنة، مزدهرة، ومنفتحة على العالم" at={6 * BEAT} size={38} weight={500} font={BODY} color={MUTED} stagger={2} style={{padding: "0 80px"}} />
        </At>
      </Drift>
      <AbsoluteFill style={{background: "#fff", opacity: 1 - end}} />
    </AbsoluteFill>
  );
};
