"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TOTAL = 100;
const EXC_IDX = 63;
const SAMPLE_IDX = [7, 24, 52, 71, 88];

type Cell = "" | "tested" | "missed" | "on" | "flagged";

export function DotGridPast() {
  const cells: Cell[] = Array.from({ length: TOTAL }, (_, i) =>
    i === EXC_IDX ? "missed" : SAMPLE_IDX.includes(i) ? "tested" : ""
  );
  return (
    <div className="dotgrid">
      {cells.map((c, i) => (
        <div key={i} className={`cell${c ? " " + c : ""}`} />
      ))}
    </div>
  );
}

export function DotGridNow({
  onPctChange,
}: {
  onPctChange: (pct: number) => void;
}) {
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState<Cell[]>(Array(TOTAL).fill(""));
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function fillNow() {
      if (reduced) {
        setFilled(Array.from({ length: TOTAL }, (_, i) => (i === EXC_IDX ? "flagged" : "on")));
        onPctChange(100);
        return;
      }
      for (let i = 0; i < TOTAL; i++) {
        setTimeout(() => {
          setFilled((prev) => {
            const next = [...prev];
            next[i] = i === EXC_IDX ? "flagged" : "on";
            return next;
          });
        }, i * 11);
      }
      const dur = TOTAL * 11 + 300;
      const start = performance.now();
      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        onPctChange(Math.round(p * 100));
        if (p < 1) requestAnimationFrame(tick);
        else onPctChange(100);
      }
      requestAnimationFrame(tick);
    }

    if (reduced) {
      fillNow();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            fillNow();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, onPctChange]);

  return (
    <div className="dotgrid" ref={ref}>
      {filled.map((c, i) => (
        <div key={i} className={`cell${c ? " " + c : ""}`} />
      ))}
    </div>
  );
}
