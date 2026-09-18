import { Nav } from "@/components/sections/Nav";
import { InnovationLabForm } from "@/components/sections/InnovationLabForm";
import { Footer } from "@/components/sections/Footer";

export default function InnovationLabPage() {
  return (
    <>
      <Nav />
      <section className="sec on-ink" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="sec-head" style={{ margin: "0 auto 8px", textAlign: "center", maxWidth: "60ch" }}>
            <span className="pill">Limited access · live preview</span>
            <span className="eyebrow" style={{ justifyContent: "center", marginTop: 16 }}>
              Innovation Lab
            </span>
            <h2>Welcome to the Innovation Lab</h2>
            <p style={{ margin: "18px auto 0" }}>
              A live, hands-on preview of our AI-driven process mining engine – not a deck, not a canned video, the
              real thing. Access is reviewed by hand and kept deliberately small, so tell us a bit about you and
              we&apos;ll be in touch.
            </p>
          </div>

          <div className="freebar">
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
