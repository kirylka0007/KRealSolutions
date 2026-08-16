"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

function fmt(v: number, decimals: number) {
  return v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function useCountUp(
  active: boolean,
  target: number,
  { decimals = 0, prefix = "", suffix = "", duration = 1500 } = {}
) {
  const reduced = useReducedMotion();
  const [text, setText] = useState(prefix + fmt(0, decimals) + suffix);

  useEffect(() => {
    if (!active || reduced) return;
    let raf = 0;
    const start = performance.now();
    function frame(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setText(prefix + fmt(target * eased, decimals) + suffix);
      if (p < 1) raf = requestAnimationFrame(frame);
      else setText(prefix + fmt(target, decimals) + suffix);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, target, decimals, prefix, suffix, duration, reduced]);

  if (active && reduced) return prefix + fmt(target, decimals) + suffix;
  return text;
}
