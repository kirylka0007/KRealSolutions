import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Contact } from "@/components/sections/Contact";
import { Crumbs } from "@/components/sections/Crumbs";
import { CaseCard } from "@/components/sections/CaseCard";
import { WorkingWithUs } from "@/components/sections/WorkingWithUs";
import { Reveal } from "@/components/Reveal";
import { SERVICES, serviceBySlug, servicePath } from "@/lib/services";
import { caseById, type Case } from "@/lib/cases";
import { SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/site";

// One page per service line, from the same data as /services; see lib/services.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.seoTitle ?? s.title, description: s.summary, path: servicePath(s) });
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const cases = s.caseIds.map(caseById).filter((c): c is Case => Boolean(c));
  const path = servicePath(s);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      serviceType: s.title,
      description: s.summary,
      url: `${SITE_URL}${path}`,
      provider: { "@id": `${SITE_URL}/#organisation` },
      areaServed: { "@type": "Country", name: "United Kingdom" },
      audience: { "@type": "Audience", audienceType: "Internal audit, risk and compliance teams" },
    },
    breadcrumbJsonLd([
      { name: "Services", path: "/services" },
      { name: s.title, path },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <section className="sec">
        <div className="wrap">
          <Crumbs items={[{ name: "Services", href: "/services" }, { name: s.title }]} />
          <Reveal as="div" className="sec-head">
            <span className="eyebrow">{s.kind === "audit" ? "Internal audit" : s.kind === "delivery" ? "Delivery line" : "Advisory line"}</span>
            <h1>{s.title}</h1>
            <p>{s.body}</p>
          </Reveal>

          <Reveal as="article" className="svc svc--wide svc-detail">
            <div className="svc-wide-main">
              {s.stat && <div className="svc-stat">{s.stat}</div>}
              <h2>What you get</h2>
              <ul>
                {s.engagement.deliverables.split(" · ").map((d) => (
                  <li key={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</li>
                ))}
              </ul>
              <div className="svc-engagement">
                <p>
                  <b>Typical engagement:</b> {s.engagement.duration}
                </p>
                <p>
                  <b>Fee model:</b> {s.engagement.fee}
                </p>
              </div>
            </div>
            <div className="svc-wide-side">
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {s.lab && (
                <p className="svc-lab">
                  See it working: <Link href={`/innovation-lab#${s.lab.anchor}`}>{s.lab.name} in the Innovation Lab →</Link>
                </p>
              )}
            </div>
          </Reveal>

          <WorkingWithUs />
        </div>
      </section>

      {cases.length > 0 && (
        <section className="sec cases">
          <div className="wrap">
            <Reveal as="div" className="sec-head">
              <span className="eyebrow">Selected work</span>
              <h2>This line, in production</h2>
              <p>
                Drawn from delivery inside a large regulated financial-services firm and published in de-identified
                form only: no client, system, dataset or document is named.
              </p>
            </Reveal>
            <div className="case-grid">
              {cases.map((c) => (
                <CaseCard c={c} key={c.id} anchor={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact />
      <Footer />
    </>
  );
}
