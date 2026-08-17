"use client";
import { useCountUp } from "@/hooks/useCountUp";

const SNAPSHOT: Array<{ id: string; proc: string; isExc: boolean }> = [
  { id: "CTL-1478", proc: "Sanctions screening", isExc: false },
  { id: "CTL-1340", proc: "Data lineage check", isExc: false },
  { id: "CTL-7537", proc: "Access review", isExc: true },
  { id: "CTL-7894", proc: "Journal posting", isExc: false },
  { id: "CTL-7501", proc: "Expense claim", isExc: false },
  { id: "CTL-8815", proc: "Fee calculation", isExc: false },
];

export function LiveConsole() {
  const controls = useCountUp(true, 12840);
  const exceptions = useCountUp(true, 37);

  return (
    <div className="console reveal in" aria-hidden="true">
      <div className="console-bar">
        <span className="title">Continuous controls monitor</span>
        <span className="illustrative">Illustrative</span>
      </div>
      <div className="console-stats">
        <div className="cs">
          <div className="n">{controls}</div>
          <div className="l">Controls evaluated today</div>
        </div>
        <div className="cs exc">
          <div className="n">{exceptions}</div>
          <div className="l">Exceptions auto-flagged</div>
        </div>
      </div>
      <div className="feed">
        {SNAPSHOT.map((row) => (
          <div key={row.id} className={`feed-row${row.isExc ? " is-exc" : ""}`}>
            <span className="id">{row.id}</span>
            <span className="proc">{row.proc}</span>
            {row.isExc ? (
              <span className="st exc">⚑ EXCEPTION</span>
            ) : (
              <span className="st pass">✓ PASS</span>
            )}
          </div>
        ))}
      </div>
      <p className="console-caption">Illustrative view of a continuous controls monitoring scorecard. Not live data</p>
    </div>
  );
}
