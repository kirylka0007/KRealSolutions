import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { HealthCheckQuiz } from "@/components/sections/HealthCheckQuiz";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Audit analytics health check",
  description: "Six quick questions on your audit function's data, analytics and AI maturity, and the single best-fit next step.",
  path: "/health-check",
});

export default function HealthCheckPage() {
  return (
    <>
      <Nav />
      <section className="sec on-ink" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="sec-head" style={{ margin: "0 auto 8px", textAlign: "center", maxWidth: "48ch" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>
              Health check
            </span>
            <h1>Where does your audit function stand?</h1>
            <p style={{ margin: "18px auto 0" }}>
              Six quick questions. We&apos;ll tell you where you sit and the single best-fit next step – no
              sales call required to see it.
            </p>
          </div>
          <HealthCheckQuiz />
          <p style={{ textAlign: "center", marginTop: 24, fontSize: ".85rem" }}>
            <Link href="/health-check/lookup" style={{ color: "var(--paper-text-soft)" }}>
              Already completed this? Get your results resent →
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
