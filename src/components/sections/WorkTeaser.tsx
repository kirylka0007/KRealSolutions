import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const TEASERS = [
  { id: "ccm-01", title: "Continuous controls monitoring platform", metric: "24/7", metricLabel: "Always-on monitoring" },
  { id: "genai-03", title: "Fake-receipt detection with vision AI", metric: "Every", metricLabel: "Receipt image inspected" },
  { id: "genai-01", title: "Bulk legal & document analysis", metric: "~3,000", metricLabel: "Documents analysed" },
];

export function WorkTeaser() {
  return (
    <section className="sec cases on-ink">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Assurance problems, solved in production</h2>
          <p>Drawn from delivery inside a large regulated financial-services firm. No client, system, dataset or document is ever named, reused or repurposed. Case studies are published in de-identified form only.</p>
        </Reveal>
        <div className="teaser-grid">
          {TEASERS.map((t) => (
            <Reveal as="article" className="teaser-card teaser-card--dark" key={t.id}>
              <div className="case-metric">
                <span className="m">{t.metric}</span>
                <span className="ml">{t.metricLabel}</span>
              </div>
              <h3>{t.title}</h3>
              <Link href={`/who-we-are#${t.id}`} className="teaser-link teaser-link--dark">
                Read the case →
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="teaser-cta">
          <Link href="/who-we-are" className="btn btn-ghost">
            See all work <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
