import Link from "next/link";
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
            We design and build continuous, AI-driven assurance solutions for internal audit and
            wider assurance functions in regulated financial services – replacing manual,
            point-in-time testing with always-on coverage, built by an FCCA-qualified auditor with
            an MSc in Data Science
          </p>
          <div className="hero-cta">
            <Link href="/#contact" className="btn btn-primary">
              Book a conversation <span className="arrow">→</span>
            </Link>
            <Link href="/who-we-are" className="btn btn-ghost">
              See the work
            </Link>
          </div>
          <div className="creds">
            <span>Based in Edinburgh, UK</span>
            <span>FCCA qualified</span>
            <span>MSc Data Science (Distinction)</span>
            <span>15+ yrs financial services &amp; Big 4</span>
            <span>Production AI in a regulated financial-services firm</span>
          </div>
        </Reveal>
        <LiveConsole />
      </div>
    </header>
  );
}
