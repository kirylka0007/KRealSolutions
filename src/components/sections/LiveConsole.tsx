"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PROCS = [
  "Trade reconciliation", "Corporate action", "Access review", "PDF authorisation",
  "Expense claim", "Journal posting", "Vendor onboarding", "Client report",
  "Payment run", "Fund pricing", "Segregation of duties", "Sanctions screening",
  "Fee calculation", "Data lineage check",
];
const STATIC_SNAPSHOT: Array<[string, boolean]> = [
  ["Trade reconciliation", false], ["Corporate action", false], ["Access review", true],
  ["Journal posting", false], ["Fund pricing", false], ["Client report", false],
];
const MAX_ROWS = 6;

function fmt(v: number) {
  return v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function randomId() {
  return "CTL-" + String(Math.floor(Math.random() * 9999)).padStart(4, "0");
}

type Row = { id: string; proc: string; isExc: boolean; key: string };

export function LiveConsole() {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<Row[]>([]);
  const [controls, setControls] = useState(12840);
  const [exceptions, setExceptions] = useState(37);
  const keyCounter = useRef(0);

  useEffect(() => {
    if (reduced) {
      setRows(
        STATIC_SNAPSHOT.map(([proc, isExc]) => ({
          id: randomId(),
          proc,
          isExc,
          key: String(keyCounter.current++),
        }))
      );
      return;
    }

    function addRow() {
      const isExc = Math.random() < 0.16;
      setRows((prev) => [
        { id: randomId(), proc: PROCS[Math.floor(Math.random() * PROCS.length)], isExc, key: String(keyCounter.current++) },
        ...prev,
      ].slice(0, MAX_ROWS));
      setControls((c) => c + Math.floor(Math.random() * 7) + 3);
      if (isExc) setExceptions((e) => e + 1);
    }

    for (let i = 0; i < MAX_ROWS; i++) addRow();
    const id = setInterval(addRow, 1700);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="console reveal in" aria-hidden="true">
      <div className="console-bar">
        <span className="title">Continuous controls monitor</span>
        <span className="live">
          <i />
          LIVE
        </span>
      </div>
      <div className="console-stats">
        <div className="cs">
          <div className="n">{fmt(controls)}</div>
          <div className="l">Controls evaluated today</div>
        </div>
        <div className="cs exc">
          <div className="n">{fmt(exceptions)}</div>
          <div className="l">Exceptions auto-flagged</div>
        </div>
      </div>
      <div className="feed">
        {rows.map((row) => (
          <div key={row.key} className={`feed-row${row.isExc ? " is-exc" : ""}`}>
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
    </div>
  );
}
