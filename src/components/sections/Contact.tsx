import { Reveal } from "@/components/Reveal";
import { EnquiryForm } from "./EnquiryForm";

export function Contact() {
  return (
    <section className="contact on-ink" id="contact">
      <Reveal as="div" className="wrap">
        <span className="eyebrow" style={{ justifyContent: "center" }}>
          Let&apos;s talk
        </span>
        <h2>Where could continuous assurance take your function?</h2>
        <p>A short, no-obligation conversation about your controls, your data, and where AI and automation would actually move the needle</p>
        <div className="free-lead">
          <span className="eyebrow" style={{ justifyContent: "center", color: "var(--assure)" }}>
            Free ways to start
          </span>
        </div>
        <div className="freebar">
          <a href="/health-check" className="f">
            <span className="tag">No cost</span>
            <h3>Health check</h3>
            <p>Six quick questions – see where you stand and the single best-fit next step, instantly</p>
          </a>
          <div className="f">
            <span className="tag">No cost</span>
            <h3>Intro with your IA team</h3>
            <p>A conversation with your auditors to explore what&apos;s possible and answer the hard questions. No pitch.</p>
          </div>
          <div className="f">
            <span className="tag">Included</span>
            <h3>Training &amp; upskilling</h3>
            <p>Hands-on sessions so your auditors build and review analytics themselves – the capability stays in-house</p>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <EnquiryForm />
        </div>
        <a href="mailto:kiryl@krealsolutions.co.uk" className="mailto">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
          kiryl@krealsolutions.co.uk
        </a>
      </Reveal>
    </section>
  );
}
