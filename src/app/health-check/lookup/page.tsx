import { Nav } from "@/components/sections/Nav";
import { HealthCheckLookup } from "@/components/sections/HealthCheckLookup";
import { Footer } from "@/components/sections/Footer";

export default function HealthCheckLookupPage() {
  return (
    <>
      <Nav />
      <section className="sec on-ink" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="sec-head" style={{ margin: "0 auto 8px", textAlign: "center", maxWidth: "48ch" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              Health check
            </span>
            <h2>Get your results resent</h2>
            <p style={{ margin: "18px auto 0" }}>
              Enter the email you used and we&apos;ll send your most recent health-check result again
            </p>
          </div>
          <div style={{ maxWidth: 400, margin: "40px auto 0" }}>
            <HealthCheckLookup />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
