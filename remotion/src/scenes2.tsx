import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {DrawIcon} from "./icons";
import {Bg, Card, Drift, GREEN, Heading, INK, leave, MUTED, pop, prog, progIO, RED, Words} from "./kit";
import {At, Chip} from "./scenes1";
import {BEAT, BODY, HEAD} from "./theme";

/** Little skyline whose buildings grow up from the ground line (reconstruction). */
const Skyline: React.FC<{at: number; y: number}> = ({at, y}) => {
  const f = useCurrentFrame();
  const B: [number, number, number][] = [
    [90, 120, 180], [220, 90, 260], [320, 140, 200], [470, 110, 320], [590, 130, 230], [730, 100, 290], [840, 150, 190],
  ];
  return (
    <svg width={1080} height={400} style={{position: "absolute", left: 0, top: y - 400}}>
      {B.map(([x, w, h], i) => {
        const p = progIO(f, at + i * 4, 26);
        const hh = h * p;
        const win = [];
        for (let r = 0; r < Math.floor(hh / 46); r++) for (let c = 0; c < Math.floor(w / 40); c++)
          win.push(<rect key={`${r}-${c}`} x={x + 14 + c * 40} y={400 - hh + 18 + r * 46} width={18} height={22} rx={3} fill="#fff" opacity={prog(f, at + 30 + i * 3 + r * 2, 10) * 0.9} />);
        return (
          <g key={i}>
            <rect x={x} y={400 - hh} width={w} height={hh} rx={8} fill={i % 3 === 1 ? GREEN : i % 3 === 2 ? RED : INK} opacity={0.9} />
            {win}
          </g>
        );
      })}
      <rect x={40} y={396} width={1000 * progIO(f, at - 10, 20)} height={6} rx={3} fill={INK} />
    </svg>
  );
};

const GAZA_ITEMS: [string, string, string][] = [
  ["crane", "إعادة إعمار غزة", RED],
  ["link", "توحيد المؤسسات الفلسطينية", GREEN],
  ["drop", "استعادة الخدمات الأساسية", GREEN],
  ["growth", "دعم التعافي الاقتصادي والاجتماعي", RED],
];

/* 5 — national recovery and rebuilding Gaza. */
export const Gaza: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tint="rgba(0,128,65,0.06)" />
      <Drift dur={dur}>
        <Heading title="التعافي الوطني وإعادة إعمار غزة" at={4} y={210} size={74} />
        <At y={520}>
          <Words text="أولوية وطنية وإنسانية ملحّة" at={2 * BEAT} size={52} weight={700} color={RED} stagger={4} />
        </At>
        {GAZA_ITEMS.map(([icon, label, c], i) => {
          const col = i % 2, row = Math.floor(i / 2);
          const at = 4 * BEAT + i * 2 * BEAT;
          return (
            <Card key={i} at={at} x={col === 0 ? 560 : 90} y={650 + row * 330} w={430} h={300} accent={c} from={col === 0 ? "right" : "left"}>
              <div style={{position: "absolute", top: 26, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
                <DrawIcon name={icon} at={at + 8} size={84} color={c} stroke={2.8} />
              </div>
              <div style={{position: "absolute", top: 128, left: 26, right: 36, textAlign: "center", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 36, lineHeight: 1.3, color: INK, opacity: prog(f, at + 12, 14)}}>{label}</div>
            </Card>
          );
        })}
        <Skyline at={13 * BEAT} y={1640} />
        <At y={1680}>
          <Words text="لمستقبل آمن ومستقر لأبناء القطاع" at={16 * BEAT} size={46} weight={700} color={INK} stagger={3} hi={{"آمن": GREEN, "ومستقر": GREEN}} />
        </At>
        <At y={1760}>
          <div style={{textAlign: "center", direction: "rtl", fontFamily: BODY, fontWeight: 500, fontSize: 32, color: MUTED, opacity: prog(f, 17 * BEAT, 14)}}>بحشد الدعم العربي والدولي اللازم</div>
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 6 — democratic governance: parliament built from three pillars, then legitimacy + public office. */
export const Democracy: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const B = 10 * BEAT, C = 16 * BEAT;
  const pillars = [["فصل", "السلطات"], ["سيادة", "القانون"], ["استقلال", "القضاء"]].map((p) => p.join("\n"));
  const roof = progIO(f, 2 * BEAT + 3 * BEAT, 24);
  const outA = leave(f, B - 10, 10);
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        <Heading title="الحكم الديمقراطي والحريات العامة" at={4} y={210} size={74} out={B - 10} />
        {/* A: parliament */}
        <div style={{opacity: outA}}>
          <At y={500}>
            <Words text="نظام برلماني ديمقراطي" at={BEAT + 6} size={60} weight={700} color={GREEN} stagger={4} />
          </At>
          <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
            <path d="M150 790 L540 640 L930 790 Z" fill={INK} opacity={roof} transform={`translate(0 ${(1 - roof) * -60})`} />
            <rect x={130} y={800} width={820 * progIO(f, 2 * BEAT, 18)} height={26} rx={6} fill={INK} />
            <rect x={110} y={1330} width={860 * progIO(f, 2 * BEAT, 18)} height={34} rx={6} fill={INK} />
          </svg>
          {pillars.map((p, i) => {
            const at = 2 * BEAT + 8 + i * BEAT;
            const g = progIO(f, at, 22);
            return (
              <div key={i} style={{position: "absolute", left: 730 - i * 280, top: 830, width: 200, height: 500, display: "flex", alignItems: "flex-end"}}>
                <div style={{width: 200, height: 500 * g, background: i === 1 ? RED : GREEN, borderRadius: "8px 8px 0 0", position: "relative", overflow: "hidden"}}>
                  <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div style={{whiteSpace: "pre-line", textAlign: "center", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 40, lineHeight: 1.35, color: "#fff", opacity: prog(f, at + 16, 12)}}>{p}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <At y={1420}>
            <Words text="الشرعية لا تُستمد إلا من إرادة الشعب" at={6 * BEAT} size={52} weight={700} stagger={3} hi={{"إرادة": RED, "الشعب": RED}} />
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 24, direction: "rtl"}}>
              <div style={{opacity: prog(f, 7 * BEAT, 12)}}><DrawIcon name="ballot" at={7 * BEAT} size={70} color={GREEN} /></div>
              <Words text="عبر انتخابات حرة ونزيهة" at={7 * BEAT + 4} size={46} weight={600} color={MUTED} font={BODY} stagger={3} />
            </div>
          </At>
        </div>
        {/* B: freedoms */}
        <div style={{opacity: leave(f, C - 10, 10)}}>
          <At y={460}>
            <Words text="ويدافع الحزب عن" at={B} size={54} weight={600} color={MUTED} font={BODY} />
          </At>
          {([["mic", "حرية التعبير والإعلام المستقل", GREEN], ["people", "التعددية السياسية", INK], ["handshake", "حق التنظيم والاحتجاج السلمي", RED]] as [string, string, string][]).map(([ic, t, c], i) => {
            const at = B + 8 + i * BEAT;
            const p = prog(f, at, 18);
            return (
              <div key={i} style={{position: "absolute", top: 650 + i * 300, left: 100, right: 100, height: 240, display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 36, opacity: p, transform: `translateY(${(1 - p) * 80}px)`}}>
                <div style={{width: 170, height: 170, borderRadius: 40, border: `5px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none"}}>
                  <DrawIcon name={ic} at={at + 4} size={100} color={c} stroke={2.8} />
                </div>
                <div style={{direction: "rtl", fontFamily: HEAD, fontWeight: 800, fontSize: 58, lineHeight: 1.25, color: INK}}>{t}</div>
              </div>
            );
          })}
        </div>
        {/* C: public office is a responsibility */}
        <At y={430}>
          <div style={{textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 260, lineHeight: 0.6, color: RED, opacity: prog(f, C, 12), transform: `scale(${pop(f, C, 18)})`}}>”</div>
          <Words text="المنصب العام" at={C + 6} size={88} weight={800} style={{marginTop: 40}} />
          <Words text="مسؤولية" at={C + 16} size={170} weight={800} color={GREEN} mode="scale" />
          <Words text="لا امتياز" at={C + 30} size={110} weight={800} color={RED} />
        </At>
        <At y={1310}>
          <Words text="تكافؤ الفرص على أساس الكفاءة لا الولاء" at={C + 2 * BEAT + 8} size={42} weight={600} color={MUTED} font={BODY} stagger={2} />
          <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, marginTop: 40, padding: "0 60px", direction: "rtl"}}>
            {["المرأة", "الشباب", "المجتمع المدني", "القطاع الخاص"].map((t, i) => (
              <Chip key={t} at={C + 4 * BEAT + i * 6} text={t} color={[GREEN, RED, INK, GREEN][i]} size={44} />
            ))}
          </div>
          <Words text="شركاء كاملون في القيادة وصنع القرار" at={C + 6 * BEAT} size={46} weight={700} color={INK} stagger={3} style={{marginTop: 34}} />
        </At>
      </Drift>
    </AbsoluteFill>
  );
};

/* 7 — social justice and development: growth chart with three milestones. */
export const Justice: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const chart = progIO(f, 5 * BEAT, 40);
  const pts: [number, number, string, string][] = [
    [790, 1250, "briefcase", "فرص العمل"],
    [540, 1080, "book", "التعليم"],
    [290, 880, "bulb", "الابتكار"],
  ];
  return (
    <AbsoluteFill>
      <Bg />
      <Drift dur={dur}>
        <Heading title="العدالة الاجتماعية والتنمية" at={4} y={210} size={76} />
        <At y={470}>
          <Words text="التحرر السياسي لا يكتمل دون عدالة اجتماعية" at={BEAT + 6} size={50} weight={700} stagger={3} hi={{"عدالة": GREEN, "اجتماعية": GREEN}} style={{padding: "0 70px"}} />
          <Words text="اقتصاد منتج وعادل" at={3 * BEAT + 6} size={84} weight={800} color={RED} stagger={5} style={{marginTop: 24}} />
        </At>
        <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
          <path d="M120 1420 L960 1420" stroke={INK} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progIO(f, 4 * BEAT, 16)} />
          <path d="M960 1380 C860 1320 820 1260 790 1250 S620 1120 540 1080 S360 960 290 880 L190 770" stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} />
          <path d="M190 770 l10 46 M190 770 l46 12" stroke={GREEN} strokeWidth={10} strokeLinecap="round" opacity={chart > 0.98 ? 1 : 0} />
        </svg>
        {pts.map(([x, y, ic, t], i) => {
          const at = 5 * BEAT + 10 + i * 13;
          const s = pop(f, at, 16);
          return (
            <div key={i} style={{position: "absolute", left: x - 85, top: y - 85, width: 170, height: 170, transform: `scale(${s})`}}>
              <div style={{width: 170, height: 170, borderRadius: 170, background: "#fff", border: `6px solid ${i === 1 ? RED : GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.12)"}}>
                <DrawIcon name={ic} at={at + 4} size={92} color={INK} stroke={2.6} />
              </div>
              <div style={{position: "absolute", top: 180, left: -60, right: -60, textAlign: "center", direction: "rtl", fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: INK}}>{t}</div>
            </div>
          );
        })}
        <At y={1520}>
          <Words text="لجميع الفلسطينيين" at={11 * BEAT} size={58} weight={800} color={GREEN} stagger={4} />
          <Words text="وإدارة نزيهة وشفافة للموارد العامة" at={12 * BEAT} size={42} weight={600} color={MUTED} font={BODY} stagger={2} style={{marginTop: 14}} />
        </At>
      </Drift>
    </AbsoluteFill>
  );
};
