"use client";
import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";

const STATS = [
  { target: 5, suffix: "%", desc: "of annual revenue lost to occupational fraud – every year", src: "ACFE · Report to the Nations 2026" },
  { target: 12, suffix: " mo", desc: "typical time a fraud runs before anyone detects it", src: "ACFE · Report to the Nations 2026" },
  { target: 43, suffix: "%", desc: "of frauds surface through a tip – 3× more than any control", src: "ACFE · Report to the Nations 2026" },
  { target: 3, suffix: "%", desc: "are caught by external audit. The rest are found some other way.", src: "ACFE / CAQ" },
];

function Stat({ target, suffix, desc, src }: (typeof STATS)[number]) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const text = useCountUp(revealed, target, { suffix });
  return (
    <div ref={ref} className={`stat reveal${revealed ? " in" : ""}`}>
      <div className="stat-num">{text}</div>
      <div className="stat-desc">{desc}</div>
      <div className="stat-src">{src}</div>
    </div>
  );
}

export function StatBand() {
  return (
    <section className="band" id="problem">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">The blind spot</span>
          <h2>Point-in-time testing misses what happens in between</h2>
          <p>Sample-based assurance checks a fraction of activity, months apart. Here is the cost of the gap, in numbers no audit committee can ignore.</p>
        </Reveal>
        <div className="stat-grid">
          {STATS.map((s) => (
            <Stat key={s.desc} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
