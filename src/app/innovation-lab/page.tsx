import { Nav } from "@/components/sections/Nav";
import { InnovationLabForm } from "@/components/sections/InnovationLabForm";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import {
  AssuranceCore,
  Marquee,
  ProcessMiningVisual,
  BoardPapersVisual,
  ContinuousMonitoringVisual,
  CombinedAssuranceVisual,
  StakeholderVisual,
  ContractAssuranceVisual,
  AutomationMark,
  AiMark,
} from "@/components/sections/InnovationVisuals";

export const metadata: Metadata = pageMetadata({
  title: "Innovation Lab – AI tools for internal audit",
  description: "Preview access for internal audit, risk and compliance teams: process mining, board papers, continuous controls monitoring, combined assurance, stakeholder relationships and contract assurance.",
  path: "/innovation-lab",
  image: "/innovation-lab/opengraph-image",
});

const TITLE_WORDS: Array<{ t: string; em?: boolean }> = [
  { t: "Next-generation" },
  { t: "audit," },
  { t: "in", em: true },
  { t: "motion", em: true },
];

export default function InnovationLabPage() {
  return (
    <>
      <Nav />

      <section className="lab">
        <div className="lab-grain" />
        <div className="lab-aura lab-aura-1" />

        <div className="wrap">
          <div className="lab-hero">
            <AssuranceCore />
            <span className="pill">Preview access · selected internal audit, risk and compliance teams only</span>
            <h1 className="lab-title">
              {/* A real space after each word, so the heading reads as words to search
                  engines and screen readers. Zero-width and inside the word's box, so the
                  margin still sets the spacing and the line breaks are unchanged. */}
              {TITLE_WORDS.map((w, i) => (
                <span key={w.t} style={{ animationDelay: `${0.15 + i * 0.09}s` }}>
                  {w.em ? <em>{w.t}</em> : w.t}
                  {i < TITLE_WORDS.length - 1 && <b className="sp"> </b>}
                </span>
              ))}
            </h1>
            <p className="lab-lede">
              Process mining, board papers, continuous controls monitoring, combined assurance, stakeholder relationships and contract assurance, running
              together on real audit workflows. This is where we build what comes next – and a small number of
              internal audit, risk and compliance teams get to see it first.
            </p>
            <a href="#request" className="btn btn-primary lab-cta">
              Request access <span className="arrow">→</span>
            </a>
            <span className="lab-scroll">
              See it working
              <i />
            </span>
          </div>
        </div>

        <Marquee />

        <div className="wrap">
          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">01</span>
              <span className="tag">Process mining</span>
              <h3>Every event mapped. Every exception caught</h3>
              <p>
                Reconstructed from your event data, not your flowchart. Variants, rework loops and control gaps
                surface on their own – and anything that breaks the rules lights up the moment it happens.
              </p>
            </div>
            <div className="showcase-visual">
              <ProcessMiningVisual />
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">02</span>
              <span className="tag">Board papers</span>
              <h3>Forty pages in. One picture out</h3>
              <p>
                The dense passages of a routine committee paper, turned into figures a committee can read in
                seconds. Amplification, not summary – every number, reference and date traces straight back to the
                words that produced it.
              </p>
            </div>
            <div className="showcase-visual">
              <BoardPapersVisual />
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">03</span>
              <span className="tag">Continuous controls monitoring</span>
              <h3>Found stays found. Flagged the day it happens</h3>
              <p>
                Whole-population testing against an expected band for every control, on a cadence – no sampling, no
                smoothing. Each flag runs raised, investigated, reviewed, approved; approval is evidence someone
                looked, not that the count went down.
              </p>
            </div>
            <div className="showcase-visual">
              <ContinuousMonitoringVisual />
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">04</span>
              <span className="tag">Combined assurance</span>
              <h3>Every function scored twice. The gaps show themselves</h3>
              <p>
                The second line – risk and compliance – and internal audit score every function on the same scales.
                Where they disagree is a finding in its own right; where risk is high and neither is testing it is
                the gap audit exists to close; where both test the same ground is effort better spent elsewhere.
              </p>
            </div>
            <div className="showcase-visual">
              <CombinedAssuranceVisual />
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">05</span>
              <span className="tag">Stakeholder relationships</span>
              <h3>Assesses the entity. Never the individual</h3>
              <p>
                Cadence conversations with senior stakeholders feed straight into the risk assessment of the entity
                they belong to – never a rating on them. Agendas draft from what was left open last time; minutes
                become categorised insight, and overdue conversations surface on their own.
              </p>
            </div>
            <div className="showcase-visual">
              <StakeholderVisual />
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">06</span>
              <span className="tag">Contract assurance</span>
              <h3>Every amendment applied. Every answer sourced</h3>
              <p>
                Agreements, amendments, side letters, emails and scans – read in date order into one record of the
                terms in force today. Ask what an auditor would ask, from uncapped liabilities to a fee register that
                no longer matches the contract, and every answer names the document, clause and page it rests on.
              </p>
            </div>
            <div className="showcase-visual">
              <ContractAssuranceVisual />
            </div>
          </div>

          <div className="lab-substrip">
            <span className="eyebrow">How these are built</span>
            <p className="substrip-lede">
              Every product above runs on these two engines. Baked in by design, not offered on their own.
            </p>
            <div className="substrip-grid">
              <div className="substrip-item">
                <AutomationMark />
                <div>
                  <h4>Robotic automation</h4>
                  <p>Chasing, collection and reporting that runs itself, underneath every product above.</p>
                </div>
              </div>
              <div className="substrip-item">
                <AiMark />
                <div>
                  <h4>Generative AI</h4>
                  <p>Reads everything so the products above only ever surface what matters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lab on-ink" id="request">
        <div className="lab-aura lab-aura-2" />
        <div className="wrap" style={{ paddingTop: 88, paddingBottom: 96 }}>
          <div className="sec-head" style={{ margin: "0 auto", textAlign: "center", maxWidth: "52ch" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              Request access
            </span>
            <h2 style={{ marginTop: 14, fontSize: "clamp(1.9rem,4vw,2.9rem)", color: "#fff" }}>
              Get the keys to the Lab
            </h2>
            <p style={{ margin: "18px auto 0", color: "var(--paper-text-soft)" }}>
              Access is reviewed by hand and kept deliberately small. Tell us who you are and what you want to see –
              approved requests get a passcode and a direct link.
            </p>
          </div>

          <div style={{ marginTop: 44 }}>
            <InnovationLabForm />
          </div>

          <div className="lab-terms">
            <span className="eyebrow">Before you dive in</span>
            <ul className="disclaimer-list">
              <li>
                <b>Sample data only.</b> The Innovation Lab is a live technology preview provided for evaluation
                purposes. Please don&apos;t upload real client data, personal data, or anything commercially or
                legally sensitive – use sample, anonymised or synthetic data only.
              </li>
              <li>
                <b>No liability for your data.</b> K Real Solutions Ltd accepts no responsibility for any loss,
                corruption, or unauthorised access to data you upload to the Innovation Lab, however it arises.
              </li>
              <li>
                <b>Access is discretionary.</b> Access codes are personal to the recipient, must not be shared, and
                may be withdrawn or expire at any time at our discretion.
              </li>
              <li>
                <b>Provided as-is.</b> The Innovation Lab is made available on an &quot;as is&quot; and &quot;as
                available&quot; basis, without warranty of any kind, including as to availability, accuracy, or
                fitness for a particular purpose.
              </li>
              <li>
                <b>Not professional advice.</b> Nothing on this page or within the Innovation Lab constitutes
                professional, legal, audit, or investment advice.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
