import { Reveal } from "@/components/Reveal";
import { LiveConsole } from "./LiveConsole";

export function Hero() {
  return (
    <header className="hero on-ink" id="top">
      <div className="wrap hero-in">
        <Reveal className="in">
          <span className="eyebrow">Continuous assurance · GenAI · Analytics</span>
          <h1>
            From sample-based testing to{" "}
            <span className="em">continuous, AI-driven assurance</span>
          </h1>
          <p className="lede">
            We help internal audit and assurance teams in regulated financial services replace
            manual, point-in-time testing with continuous, AI-augmented assurance – built by a
            team that combines audit qualification with data science
          </p>
          <div className="hero-cta">
            <a href="/#contact" className="btn btn-primary">
              Book a conversation <span className="arrow">→</span>
            </a>
            <a href="/work" className="btn btn-ghost">
              See the work
            </a>
          </div>
          <div className="creds">
            <span>FCCA qualified</span>
            <span>MSc Data Science (Distinction)</span>
            <span>15+ yrs financial services &amp; Big 4</span>
            <span>Production AI in a regulated asset manager</span>
          </div>
        </Reveal>
        <LiveConsole />
      </div>
    </header>
  );
}
