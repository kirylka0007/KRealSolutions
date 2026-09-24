import { Reveal } from "@/components/Reveal";
import { CASES } from "@/lib/cases";
import { CaseCard } from "@/components/sections/CaseCard";

export function Cases() {
  return (
    <section className="sec cases">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Assurance problems, solved in production</h2>
          <p>Drawn from delivery inside a large regulated financial-services firm. No client, system, dataset or document is ever named, reused or repurposed. Case studies are published in de-identified form only; third-party platforms are named, internal systems are not.</p>
        </Reveal>

        <div className="case-grid">
          {CASES.map((c) => (
            <CaseCard c={c} key={c.id} />
          ))}
        </div>

        <Reveal as="div" className="further">
          <span className="lab">Further work</span>
          <span className="item">PDF authorisation &amp; SoD testing · Alteryx + Python</span>
          <span className="item">Control-test generator · LLM</span>
          <span className="item">Audit QA challenge &amp; sentiment · LLM</span>
          <span className="item">Automated risk assessment · LLM</span>
        </Reveal>
      </div>
    </section>
  );
}

