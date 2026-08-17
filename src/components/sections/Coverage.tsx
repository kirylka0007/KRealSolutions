"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { DotGridPast, DotGridNow } from "./DotGrid";

export function Coverage() {
  const [nowPct, setNowPct] = useState(100);
  const { ref: payoffRef, revealed: payoffRevealed } = useReveal<HTMLDivElement>();
  const payoffText = useCountUp(payoffRevealed, 53, { suffix: "%" });

  return (
    <section className="sec cov" id="coverage">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">The shift</span>
          <h2>From a 5% sample to 100% monitored</h2>
          <p>Continuous assurance doesn&apos;t test harder – it tests everything, all the time, and sends only the exceptions to a human. Same team, complete coverage.</p>
        </Reveal>

        <div className="cov-grid2">
          <Reveal as="div" className="cov-card past">
            <div className="cov-top">
              <span className="cov-kicker">Point-in-time sample</span>
              <span className="cov-pct">5%</span>
            </div>
            <DotGridPast />
            <div className="cov-note bad">
              <span className="tick">✕</span> One exception sat outside the sample – and was missed
            </div>
          </Reveal>
          <Reveal as="div" className="cov-card now">
            <div className="cov-top">
              <span className="cov-kicker">Continuous monitoring</span>
              <span className="cov-pct">{nowPct}%</span>
            </div>
            <DotGridNow onPctChange={setNowPct} />
            <div className="cov-note good">
              <span className="tick">✓</span> Every item checked. The same exception is caught and flagged.
            </div>
          </Reveal>
        </div>

        <div ref={payoffRef} className={`cov-payoff reveal${payoffRevealed ? " in" : ""}`}>
          <div className="big">{payoffText}</div>
          <div>
            <div className="txt">lower median fraud loss ($150,000 vs $70,000) at organisations that use proactive data monitoring, versus those that don&apos;t</div>
            <div className="src">ACFE · Report to the Nations 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}
