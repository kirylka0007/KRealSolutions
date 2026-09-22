/* Animated, decorative visuals for the Innovation Lab page.
   All motion is CSS-driven (see globals.css) so nothing runs on the main
   thread and prefers-reduced-motion can switch it all off in one place. */

export function AssuranceCore() {
  return (
    <div className="core" aria-hidden="true">
      <div className="core-glow" />
      <div className="core-ring core-ring-1">
        <span className="orbit-dot" />
      </div>
      <div className="core-ring core-ring-2">
        <span className="orbit-dot" />
        <span className="orbit-dot alt" />
      </div>
      <div className="core-ring core-ring-3" />
      <div className="core-arc" />
      <div className="core-arc core-arc-2" />
      <div className="core-center" />
    </div>
  );
}

const PM_NODES: Array<{ x: number; y: number; exc?: boolean; delay: number }> = [
  { x: 40, y: 180, delay: 0 },
  { x: 230, y: 105, delay: 0.6 },
  { x: 230, y: 180, delay: 0.2 },
  { x: 230, y: 285, delay: 1.1 },
  { x: 420, y: 120, delay: 1.4 },
  { x: 420, y: 180, delay: 0.9 },
  { x: 420, y: 245, exc: true, delay: 0 },
  { x: 600, y: 100, delay: 2.1 },
  { x: 600, y: 185, delay: 1.7 },
  { x: 600, y: 270, delay: 2.4 },
  { x: 770, y: 90, delay: 2.9 },
  { x: 770, y: 185, delay: 2.6 },
  { x: 770, y: 285, delay: 3.3 },
];

export function ProcessMiningVisual() {
  return (
    <svg
      viewBox="0 0 800 360"
      className="pm-svg"
      role="img"
      aria-label="An animated process graph: event data flows along multiple branching paths between process steps, with one step flagged as an exception and pulsing red"
    >
      <defs>
        <pattern id="pm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className="pm-grid-dot" />
        </pattern>
      </defs>
      <rect width="800" height="360" fill="url(#pm-grid)" />

      <path className="pm-edge pm-edge-a" d="M40,180 C170,70 300,60 420,120 C540,180 650,110 770,90" />
      <path className="pm-edge pm-edge-b" d="M40,180 C170,180 300,175 420,180 C540,185 650,180 770,185" />
      <path className="pm-edge pm-edge-c" d="M40,180 C170,290 300,300 420,245 C540,190 650,265 770,285" />

      {PM_NODES.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.exc ? 13 : 11}
            className={`pm-node${n.exc ? " exc" : ""}`}
            style={n.exc ? undefined : { animationDelay: `${n.delay}s` }}
          />
          {n.exc && <circle cx={n.x} cy={n.y} r="13" className="pm-pulse-ring" />}
        </g>
      ))}

      <circle r="6" className="pm-particle pm-particle-a" />
      <circle r="6" className="pm-particle pm-particle-b" />
      <circle r="6" className="pm-particle pm-particle-c" />
      <circle r="4" className="pm-particle pm-particle-b pm-particle-trail" />
    </svg>
  );
}

function Gear({ className }: { className?: string }) {
  const teeth = Array.from({ length: 10 });
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" opacity=".5" />
      {teeth.map((_, i) => (
        <rect key={i} x="18.6" y="1.5" width="2.8" height="6.5" rx="1" fill="currentColor" transform={`rotate(${i * 36} 20 20)`} />
      ))}
    </svg>
  );
}

const LANES = [
  { items: [0, 3.2], dur: 6.4 },
  { items: [1.4, 4.8], dur: 7.6 },
  { items: [2.3, 5.9], dur: 8.4 },
];

export function AutomationVisual() {
  return (
    <div className="auto-visual" aria-hidden="true">
      <div className="auto-machine">
        <Gear className="auto-gear auto-gear-lg" />
        <Gear className="auto-gear auto-gear-sm" />
      </div>
      <div className="auto-lanes">
        {LANES.map((lane, li) => (
          <div className="auto-lane" key={li}>
            <span className="auto-gate" />
            {lane.items.map((delay, ii) => (
              <span
                key={ii}
                className="auto-work"
                style={{ animationDuration: `${lane.dur}s`, animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="auto-out">
        <span className="auto-tick" style={{ animationDelay: "0.4s" }} />
        <span className="auto-tick" style={{ animationDelay: "1.9s" }} />
        <span className="auto-tick" style={{ animationDelay: "3.1s" }} />
      </div>
    </div>
  );
}

const AI_LAYERS = [5, 6, 4];
const AI_W = 760;
const AI_H = 340;

function aiNodes() {
  return AI_LAYERS.map((count, li) => {
    const x = 90 + li * ((AI_W - 180) / (AI_LAYERS.length - 1));
    return Array.from({ length: count }, (_, ni) => ({
      x,
      y: (AI_H / (count + 1)) * (ni + 1),
      li,
      ni,
    }));
  });
}

export function AiVisual() {
  const layers = aiNodes();
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number; on: boolean; delay: number }> = [];

  layers.slice(0, -1).forEach((layer, li) => {
    layer.forEach((from, fi) => {
      layers[li + 1].forEach((to, ti) => {
        const on = (fi + ti + li) % 3 === 0;
        edges.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, on, delay: li * 0.5 + (fi + ti) * 0.12 });
      });
    });
  });

  return (
    <svg
      viewBox={`0 0 ${AI_W} ${AI_H}`}
      className="ai-svg"
      role="img"
      aria-label="An animated neural network: signals cascade through connected layers of nodes while a scanning beam sweeps across the field"
    >
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          className={`ai-edge${e.on ? " live" : ""}`}
          style={e.on ? { animationDelay: `${e.delay}s` } : undefined}
        />
      ))}
      {layers.flat().map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="8"
          className="ai-node"
          style={{ animationDelay: `${n.li * 0.55 + n.ni * 0.18}s` }}
        />
      ))}
      <rect className="ai-beam" width="3" height={AI_H} />
    </svg>
  );
}

/* Compact marks used in the "how these are built" strip – small pieces lifted
   from AutomationVisual and AiVisual above, at supporting-cast scale rather
   than full showcase scale. The full visuals stay exported and untouched. */
export function AutomationMark() {
  return (
    <div className="strip-mark" aria-hidden="true">
      <div className="auto-machine">
        <Gear className="auto-gear auto-gear-lg" />
        <Gear className="auto-gear auto-gear-sm" />
      </div>
    </div>
  );
}

const AI_MARK_EDGES: Array<{ x1: number; y1: number; x2: number; y2: number; on: boolean; delay: number }> = [
  { x1: 14, y1: 16, x2: 56, y2: 28, on: true, delay: 0 },
  { x1: 14, y1: 44, x2: 56, y2: 28, on: false, delay: 0 },
  { x1: 14, y1: 44, x2: 56, y2: 62, on: true, delay: 0.9 },
  { x1: 14, y1: 72, x2: 56, y2: 62, on: false, delay: 0 },
];
const AI_MARK_NODES = [
  { x: 14, y: 16 },
  { x: 14, y: 44 },
  { x: 14, y: 72 },
  { x: 56, y: 28 },
  { x: 56, y: 62 },
];

export function AiMark() {
  return (
    <div className="strip-mark" aria-hidden="true">
      <svg viewBox="0 0 70 88" className="ai-svg">
        {AI_MARK_EDGES.map((e, i) => (
          <line
            key={i}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            className={`ai-edge${e.on ? " live" : ""}`}
            style={e.on ? { animationDelay: `${e.delay}s` } : undefined}
          />
        ))}
        {AI_MARK_NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="5" className="ai-node" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </svg>
    </div>
  );
}

const BP_LINE_X = 52;
const BP_LINE_ANCHOR_X = 330;
const BP_BASELINE = 310;

const BP_LINES: Array<{ y: number; w: number; mark?: "a" | "b" | "c" }> = [
  { y: 78, w: 210 },
  { y: 96, w: 180 },
  { y: 114, w: 225, mark: "a" },
  { y: 132, w: 140 },
  { y: 150, w: 205 },
  { y: 168, w: 190 },
  { y: 186, w: 235, mark: "b" },
  { y: 204, w: 165 },
  { y: 222, w: 200 },
  { y: 240, w: 120 },
  { y: 258, w: 215, mark: "c" },
  { y: 276, w: 175 },
  { y: 294, w: 195 },
];

const BP_BARS: Array<{ x: number; h: number; mark?: "a" | "b" | "c" }> = [
  { x: 452, h: 70 },
  { x: 512, h: 120, mark: "a" },
  { x: 572, h: 55 },
  { x: 632, h: 150, mark: "b" },
  { x: 692, h: 90, mark: "c" },
];

export function BoardPapersVisual() {
  const connections = BP_LINES.filter((l) => l.mark).map((line) => {
    const bar = BP_BARS.find((b) => b.mark === line.mark)!;
    const bx = bar.x + 15;
    const topY = BP_BASELINE - bar.h;
    const y1 = line.y - 3;
    return {
      mark: line.mark!,
      d: `M${BP_LINE_ANCHOR_X},${y1} C392,${y1} 408,${topY} ${bx},${topY}`,
    };
  });

  return (
    <svg
      viewBox="0 0 800 360"
      className="bp-svg"
      role="img"
      aria-label="An animated document: three highlighted passages in a dense page of text travel across to a bar chart, each becoming one accurately traceable figure"
    >
      <rect x="30" y="28" width="310" height="300" rx="8" className="bp-page" />
      <rect x={BP_LINE_X} y="44" width="100" height="8" rx="3" className="bp-heading" />
      <line x1={BP_LINE_X} y1="60" x2="316" y2="60" className="bp-rule" />
      {BP_LINES.map((l, i) => (
        <rect
          key={i}
          x={BP_LINE_X}
          y={l.y}
          width={l.w}
          height={l.mark ? 8 : 6}
          rx="3"
          className={`bp-line${l.mark ? ` mark-${l.mark}` : ""}`}
        />
      ))}

      <line x1="440" y1={BP_BASELINE} x2="780" y2={BP_BASELINE} className="bp-axis" />
      {BP_BARS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={BP_BASELINE - b.h}
          width="30"
          height={b.h}
          rx="3"
          className={`bp-bar${b.mark ? ` mark-${b.mark}` : ""}`}
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}

      {connections.map((c) => (
        <path key={c.mark} d={c.d} className={`bp-link mark-${c.mark}`} />
      ))}
      {connections.map((c) => (
        <circle key={c.mark} r="4" className={`bp-particle mark-${c.mark}`} style={{ offsetPath: `path("${c.d}")` }} />
      ))}

      <rect x="30" y="28" width="310" height="4" rx="2" className="bp-scan" />
    </svg>
  );
}

const CM_BAND = { x: 50, y: 96, w: 700, h: 64 };

const CM_POINTS: Array<{ x: number; y: number; exc?: boolean }> = [
  { x: 70, y: 124 },
  { x: 120, y: 132 },
  { x: 170, y: 120 },
  { x: 220, y: 60, exc: true },
  { x: 270, y: 126 },
  { x: 320, y: 134 },
  { x: 370, y: 118 },
  { x: 420, y: 178, exc: true },
  { x: 470, y: 128 },
  { x: 520, y: 122 },
  { x: 570, y: 130 },
  { x: 620, y: 182, exc: true },
  { x: 670, y: 124 },
  { x: 720, y: 120 },
];

const CM_GATES = [130, 310, 490, 670];
const CM_TRACK_Y = 300;

function cmLifecyclePath(ex: number, ey: number) {
  return `M${ex},${ey} Q${ex},${CM_TRACK_Y} ${CM_GATES[0]},${CM_TRACK_Y} L${CM_GATES[1]},${CM_TRACK_Y} L${CM_GATES[2]},${CM_TRACK_Y} L${CM_GATES[3]},${CM_TRACK_Y}`;
}

export function ContinuousMonitoringVisual() {
  const exceptions = CM_POINTS.filter((p) => p.exc);

  return (
    <svg
      viewBox="0 0 800 360"
      className="cm-svg"
      role="img"
      aria-label="An animated control chart: whole-population test results run against an expected band, with breaches flagged and carried one-way along a four-stage exception lifecycle from raised to approved"
    >
      <rect x={CM_BAND.x} y={CM_BAND.y} width={CM_BAND.w} height={CM_BAND.h} rx="8" className="cm-band" />
      <polyline
        points={CM_POINTS.map((p) => `${p.x},${p.y}`).join(" ")}
        className="cm-trend"
      />
      {CM_POINTS.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.exc ? 7 : 4} className={`cm-dot${p.exc ? " exc" : ""}`} />
          {p.exc && <circle cx={p.x} cy={p.y} r="7" className="cm-pulse-ring" />}
        </g>
      ))}

      <line x1="70" y1={CM_TRACK_Y} x2="730" y2={CM_TRACK_Y} className="cm-track" />
      {CM_GATES.map((gx, i) => (
        <rect key={i} x={gx - 6} y={CM_TRACK_Y - 6} width="12" height="12" rx="2" className="cm-gate" />
      ))}

      {exceptions.map((e, i) => (
        <path key={i} d={cmLifecyclePath(e.x, e.y)} className="cm-link" />
      ))}
      {exceptions.map((e, i) => (
        <circle
          key={i}
          r="5"
          className="cm-marker"
          style={{ offsetPath: `path("${cmLifecyclePath(e.x, e.y)}")`, animationDelay: `${i * 1.6}s` }}
        />
      ))}
    </svg>
  );
}

const SH_ENTITIES: Array<{
  cx: number;
  cy: number;
  breathe: number;
  stakeholders: Array<{ dx: number; dy: number; overdue?: boolean }>;
}> = [
  {
    cx: 150,
    cy: 110,
    breathe: 6,
    stakeholders: [
      { dx: -74, dy: -42 },
      { dx: -88, dy: 58 },
    ],
  },
  {
    cx: 430,
    cy: 68,
    breathe: 7.4,
    stakeholders: [
      { dx: -58, dy: -50 },
      { dx: 78, dy: 52 },
    ],
  },
  {
    cx: 650,
    cy: 172,
    breathe: 6.8,
    stakeholders: [
      { dx: 72, dy: -56 },
      { dx: 64, dy: 66, overdue: true },
    ],
  },
  {
    cx: 320,
    cy: 282,
    breathe: 8.2,
    stakeholders: [
      { dx: -92, dy: 38 },
      { dx: 84, dy: 46 },
    ],
  },
];

export function StakeholderVisual() {
  return (
    <svg
      viewBox="0 0 800 360"
      className="sh-svg"
      role="img"
      aria-label="An animated relationship network: stakeholder conversations on a cadence flow into the audit entity each person belongs to, with one relationship flagged as overdue and no meeting booked"
    >
      {SH_ENTITIES.map((e, ei) => (
        <g key={ei}>
          {e.stakeholders.map((s, si) => {
            const sx = e.cx + s.dx;
            const sy = e.cy + s.dy;
            const d = `M${sx},${sy} L${e.cx},${e.cy}`;
            return (
              <g key={si}>
                <path d={d} className={`sh-spoke${s.overdue ? " overdue" : ""}`} />
                {!s.overdue && (
                  <circle
                    r="3.2"
                    className="sh-particle"
                    style={{ offsetPath: `path("${d}")`, animationDelay: `${(ei * 2 + si) * 0.9}s` }}
                  />
                )}
                <circle cx={sx} cy={sy} r={s.overdue ? 7 : 5.5} className={`sh-node${s.overdue ? " overdue" : ""}`} />
                {s.overdue && <circle cx={sx} cy={sy} r="7" className="sh-warn-ring" />}
              </g>
            );
          })}
          <circle cx={e.cx} cy={e.cy} r="20" className="sh-hub-ring" style={{ animationDelay: `${ei * 0.6}s` }} />
          <circle
            cx={e.cx}
            cy={e.cy}
            r="16"
            className="sh-hub"
            style={{ animationDuration: `${e.breathe}s`, animationDelay: `${ei * 0.4}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

const MARQUEE_WORDS = [
  "Process mining",
  "Board papers",
  "Continuous controls monitoring",
  "Stakeholder relationships",
  "Robotic process automation",
  "Generative AI",
  "Next-gen audit innovation",
];

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <span key={rep} className="marquee-group">
            {MARQUEE_WORDS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
