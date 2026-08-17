import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const TEASERS = [
  { id: "ccm", title: "Continuous Assurance & Controls Monitoring", blurb: "Always-on control monitoring instead of periodic samples" },
  { id: "genai", title: "GenAI for Internal Audit", blurb: "Governed LLM and vision AI across the audit lifecycle" },
  { id: "auto", title: "Audit & Analytics Automation", blurb: "Automate the audit operating model, not the judgement" },
  { id: "pm", title: "Process Mining & Process Intelligence", blurb: "See how a process actually runs, not how the flowchart says it does" },
  { id: "euc", title: "Self-Service Analytics Assurance", blurb: "Govern the Alteryx, Power BI and Python your business already built" },
  { id: "risk-intel", title: "Stakeholder & Risk Intelligence", blurb: "Turn everyday stakeholder contact into a live input for risk" },
];

export function ServicesTeaser() {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What we do</span>
          <h2>Six ways we modernise your assurance</h2>
          <p>Four delivery lines plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence.</p>
        </Reveal>
        <div className="teaser-grid">
          {TEASERS.map((t) => (
            <Reveal as="article" className="teaser-card" key={t.id}>
              <h3>{t.title}</h3>
              <p>{t.blurb}</p>
              <Link href={`/services#${t.id}`} className="teaser-link">
                Learn more →
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="teaser-cta">
          <Link href="/services" className="btn btn-ghost">
            See all services <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
