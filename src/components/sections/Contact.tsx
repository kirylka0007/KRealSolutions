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
            <h4>Health check</h4>
            <p>Six quick questions – see where you stand and the single best-fit next step, instantly</p>
          </a>
          <div className="f">
            <span className="tag">No cost</span>
            <h4>Intro with your IA team</h4>
            <p>A conversation with your auditors to explore what&apos;s possible and answer the hard questions. No pitch.</p>
          </div>
          <div className="f">
            <span className="tag">Included</span>
            <h4>Training &amp; upskilling</h4>
            <p>Hands-on sessions so your auditors build and review analytics themselves – the capability stays in-house</p>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <EnquiryForm />
        </div>
        <div className="mailto">kiryl@krealsolutions.co.uk</div>
      </Reveal>
    </section>
  );
}
