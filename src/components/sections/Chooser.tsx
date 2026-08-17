"use client";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { useIntent } from "@/context/IntentContext";
import type { IntentKey } from "@/types/intent";

type Panel = {
  key: IntentKey;
  ix: string;
  label: string;
  heading: string;
  desc: string;
  rel: React.ReactNode;
  offerTitle: string;
  offerDesc: string;
};

const PANELS: Panel[] = [
  {
    key: "genai",
    ix: "01",
    label: "Get value from GenAI in audit",
    heading: "You know GenAI could help audit. You need it to actually land – safely.",
    desc: "We find the highest-value uses across your audit lifecycle – document and policy review, fraud indicators, risk assessment, QA and reporting – and build them to run in a regulated environment, with a human in the loop",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#genai">GenAI for Internal Audit</a>
        <br />
        Proof: bulk document analysis · fake-receipt detection · automated briefings
      </>
    ),
    offerTitle: "GenAI-in-audit health check",
    offerDesc: "A working session mapping where GenAI would pay off first in your function",
  },
  {
    key: "starting",
    ix: "02",
    label: "Start our data-analytics journey",
    heading: "Your team is ready to start with analytics – but not sure where.",
    desc: "We help audit teams take the first steps: quick wins that build confidence, a practical roadmap, and hands-on training so the capability stays with your people, not with a contractor",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#auto">Audit &amp; Analytics Automation</a> ·{" "}
        <a href="/services#ccm">Continuous Assurance foundations</a>
        <br />
        Plus: training &amp; upskilling built into the engagement
      </>
    ),
    offerTitle: "Intro session for your IA team",
    offerDesc: "A no-pitch conversation with your auditors, plus a starter roadmap for where to begin",
  },
  {
    key: "tools",
    ix: "03",
    label: "Get more from tools we own",
    heading: "You've bought Alteryx, Power BI and Power Automate. Are they earning their keep?",
    desc: "We review what's already been built – for value, control weaknesses and key-person risk – govern the self-service estate, and unlock the use cases the licences were bought for in the first place",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#euc">Self-Service Analytics Assurance</a> ·{" "}
        <a href="/services#auto">Audit &amp; Analytics Automation</a>
        <br />
        Context: 88% of business spreadsheets contain errors (Panko / EuSpRIG)
      </>
    ),
    offerTitle: "Analytics-estate health check",
    offerDesc: "A review of what you've built and where the value – and the risk – is hiding",
  },
  {
    key: "continuous",
    ix: "04",
    label: "Move to continuous assurance",
    heading: "Point-in-time testing is leaving gaps. You want always-on coverage.",
    desc: "We design and build continuous controls monitoring – data feeds blended and scored, exceptions flagged and routed to the right auditor automatically – so you move from a sample to the full population",
    rel: (
      <>
        Where we&apos;d start: <a href="/services#ccm">Continuous Assurance &amp; Controls Monitoring</a>
        <br />
        Proof: continuous monitoring platform · unstructured email into a tested control
      </>
    ),
    offerTitle: "Continuous-assurance scoping call",
    offerDesc: "We pick one control and map exactly what always-on coverage would take",
  },
  {
    key: "exploring",
    ix: "05",
    label: "Not sure yet",
    heading: "Not sure what you need? That's a perfectly good place to start.",
    desc: "A short, no-obligation conversation about your controls, your data and your team. We'll tell you honestly where analytics and AI would move the needle – and, just as usefully, where they wouldn't.",
    rel: (
      <>
        We can look across any of it: <a href="/services">the full range of services</a>
      </>
    ),
    offerTitle: "Initial conversation",
    offerDesc: "Fifteen minutes to work out whether there's a fit. No slides, no pressure",
  },
];

export function Chooser() {
  const [active, setActive] = useState<IntentKey>("genai");
  const { setIntent } = useIntent();

  function handleBookIt(key: IntentKey) {
    setIntent(key);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="sec start" id="start">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Start here</span>
          <h2>What do you want to solve?</h2>
          <p>Pick the one that sounds most like you – we&apos;ll show you where we&apos;d start, and a no-cost way in</p>
        </Reveal>
        <Reveal as="div" className="chooser">
          <div className="chooser-btns" role="tablist">
            {PANELS.map((p) => (
              <button
                key={p.key}
                className={`chip-btn${active === p.key ? " active" : ""}`}
                role="tab"
                aria-selected={active === p.key}
                onClick={() => setActive(p.key)}
              >
                <span className="ix">{p.ix}</span> {p.label}
              </button>
            ))}
          </div>
          <div className="panel-wrap">
            {PANELS.map((p) => (
              <div key={p.key} className={`panel${active === p.key ? " active" : ""}`} id={`p-${p.key}`}>
                <div>
                  <h3>{p.heading}</h3>
                  <p className="desc">{p.desc}</p>
                  <div className="rel">{p.rel}</div>
                </div>
                <div className="offer">
                  <span className="free">Free to start</span>
                  <h4>{p.offerTitle}</h4>
                  <p>{p.offerDesc}</p>
                  <button className="btn btn-primary" onClick={() => handleBookIt(p.key)}>
                    Book it – free <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
