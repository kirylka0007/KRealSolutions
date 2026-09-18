const PM_PATH = "M20,100 Q90,40 160,100 Q230,160 300,100 Q370,40 440,100 Q510,160 580,100";
const PM_NODES = [
  { x: 20, y: 100, exc: false },
  { x: 160, y: 100, exc: false },
  { x: 300, y: 100, exc: true },
  { x: 440, y: 100, exc: false },
  { x: 580, y: 100, exc: false },
];

export function ProcessMiningVisual() {
  return (
    <svg viewBox="0 0 600 200" className="pm-svg" role="img" aria-label="Animated diagram of an event log flowing through a process, with an exception automatically flagged and highlighted">
      <path d={PM_PATH} className="pm-edge" />
      {PM_NODES.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="9" className={`pm-node${n.exc ? " exc" : ""}`} />
      ))}
      <circle cx={300} cy={100} r="9" className="pm-pulse-ring" />
      <circle r="5" className="pm-dot" />
    </svg>
  );
}

function Gear({ className }: { className?: string }) {
  const teeth = Array.from({ length: 8 });
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
      {teeth.map((_, i) => (
        <rect key={i} x="18" y="1" width="4" height="7" rx="1" fill="currentColor" transform={`rotate(${i * 45} 20 20)`} />
      ))}
    </svg>
  );
}

export function AutomationVisual() {
  const stages = [0, 0.4, 0.8, 1.2];
  return (
    <div className="auto-visual" aria-hidden="true">
      <Gear className="auto-gear auto-gear-a" />
      <div className="auto-track">
        {stages.map((delay, i) => (
          <span key={i} className="auto-stage" style={{ animationDelay: `${delay}s` }} />
        ))}
        <span className="auto-shuttle" />
      </div>
      <Gear className="auto-gear auto-gear-b" />
    </div>
  );
}

export function AiVisual() {
  const bars = [
    { w: "86%", flag: false },
    { w: "62%", flag: true },
    { w: "94%", flag: false },
    { w: "70%", flag: false },
    { w: "50%", flag: true },
    { w: "80%", flag: false },
  ];
  return (
    <div className="ai-visual" aria-hidden="true">
      <div className="ai-bars">
        {bars.map((b, i) => (
          <span key={i} style={{ width: b.w }} className={b.flag ? "flag" : undefined} />
        ))}
      </div>
      <div className="ai-scan" />
    </div>
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
          <span key={rep}>
            {MARQUEE_WORDS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
