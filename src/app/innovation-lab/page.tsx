import { Nav } from "@/components/sections/Nav";
import { InnovationLabForm } from "@/components/sections/InnovationLabForm";
import { Footer } from "@/components/sections/Footer";
import { Marquee, ProcessMiningVisual, AutomationVisual, AiVisual } from "@/components/sections/InnovationVisuals";

export default function InnovationLabPage() {
  return (
    <>
      <Nav />
      <section className="sec on-ink" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="sec-head lab-hero" style={{ margin: "0 auto 8px", textAlign: "center", maxWidth: "68ch" }}>
            <span className="pill">Next-gen audit innovation · preview access, by invitation</span>
            <span className="eyebrow" style={{ justifyContent: "center", marginTop: 16 }}>
              Innovation Lab
            </span>
            <h2>Welcome to the Innovation Lab</h2>
            <p style={{ margin: "18px auto 0" }}>
              Process mining, robotic automation and generative AI, working together on real audit workflows. This
              is a preview, not a product launch – access is limited to selected internal audit teams while we
              build with early partners.
            </p>
          </div>

          <Marquee />

          <div className="innovation-grid">
            <div className="iv-card">
              <span className="tag">Process mining</span>
              <h4>Every event, mapped and flagged live</h4>
              <div className="iv-stage">
                <ProcessMiningVisual />
              </div>
            </div>
            <div className="iv-card">
              <span className="tag">Robotic automation</span>
              <h4>Work moving through the pipeline, hands-free</h4>
              <div className="iv-stage">
                <AutomationVisual />
              </div>
            </div>
            <div className="iv-card">
              <span className="tag">Generative AI</span>
              <h4>Reading, scanning, flagging as it goes</h4>
              <div className="iv-stage">
                <AiVisual />
              </div>
            </div>
          </div>

          <div className="freebar" style={{ marginTop: 48 }}>
            <div className="f">
              <span className="tag">Step 1</span>
              <h4>Request access</h4>
              <p>Tell us who you are and what you&apos;re hoping to see</p>
            </div>
            <div className="f">
              <span className="tag">Step 2</span>
              <h4>We review it</h4>
              <p>Every request is read personally, usually within a couple of working days</p>
            </div>
            <div className="f">
              <span className="tag">Step 3</span>
              <h4>Explore live</h4>
              <p>Approved requests get a passcode and a link straight into the live environment</p>
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <InnovationLabForm />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Before you dive in</span>
          <h2 style={{ marginTop: 12 }}>A few important things first</h2>
          <ul className="disclaimer-list">
            <li>
              <b>Sample data only.</b> The Innovation Lab is a live technology preview provided for evaluation
              purposes. Please don&apos;t upload real client data, personal data, or anything commercially or legally
              sensitive – use sample, anonymised or synthetic data only.
            </li>
            <li>
              <b>No liability for your data.</b> K Real Solutions Ltd accepts no responsibility for any loss,
              corruption, or unauthorised access to data you upload to the Innovation Lab, however it arises.
            </li>
            <li>
              <b>Access is discretionary.</b> Access codes are personal to the recipient, must not be shared, and may
              be withdrawn or expire at any time at our discretion.
            </li>
            <li>
              <b>Provided as-is.</b> The Innovation Lab is made available on an &quot;as is&quot; and &quot;as
              available&quot; basis, without warranty of any kind, including as to availability, accuracy, or fitness
              for a particular purpose.
            </li>
            <li>
              <b>Not professional advice.</b> Nothing on this page or within the Innovation Lab constitutes
              professional, legal, audit, or investment advice.
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}
