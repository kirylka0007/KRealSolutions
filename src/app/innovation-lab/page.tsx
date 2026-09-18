import { Nav } from "@/components/sections/Nav";
import { InnovationLabForm } from "@/components/sections/InnovationLabForm";
import { Footer } from "@/components/sections/Footer";
import {
  AssuranceCore,
  Marquee,
  ProcessMiningVisual,
  AutomationVisual,
  AiVisual,
} from "@/components/sections/InnovationVisuals";

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
            <span className="pill">Preview access · selected internal audit teams only</span>
            <h1 className="lab-title">
              {TITLE_WORDS.map((w, i) => (
                <span key={w.t} style={{ animationDelay: `${0.15 + i * 0.09}s` }}>
                  {w.em ? <em>{w.t}</em> : w.t}
                </span>
              ))}
            </h1>
            <p className="lab-lede">
              Process mining, robotic automation and generative AI, running together on real audit workflows. This is
              where we build what comes next – and a small number of internal audit teams get to see it first.
            </p>
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
              <h3>Every event mapped. Every exception caught.</h3>
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
              <span className="tag">Robotic automation</span>
              <h3>Work that moves itself down the line.</h3>
              <p>
                Follow-ups, request chasing, evidence collection and reporting run without anyone pushing them along.
                Your auditors keep the judgement; the pipeline keeps the admin.
              </p>
            </div>
            <div className="showcase-visual">
              <AutomationVisual />
            </div>
          </div>

          <div className="showcase">
            <div className="showcase-copy">
              <span className="showcase-num">03</span>
              <span className="tag">Generative AI</span>
              <h3>Reads everything. Flags what matters.</h3>
              <p>
                Policies, contracts, tickets and notes, read end to end and scored against the risks you care about –
                governed, auditable, and with a human holding the pen on every conclusion.
              </p>
            </div>
            <div className="showcase-visual">
              <AiVisual />
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
