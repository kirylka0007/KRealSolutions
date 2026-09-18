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

const MARQUEE_WORDS = [
  "Process mining",
  "Robotic process automation",
  "Generative AI",
  "Continuous controls monitoring",
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
