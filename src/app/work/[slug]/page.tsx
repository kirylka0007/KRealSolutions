import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Contact } from "@/components/sections/Contact";
import { Crumbs } from "@/components/sections/Crumbs";
import { Reveal } from "@/components/Reveal";
import { CASES, caseBySlug, casePath } from "@/lib/cases";
import { SERVICES, servicePath } from "@/lib/services";
import { SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/site";

// One page per case study, from the same data as Who we are; see lib/cases.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: `${c.title} – case study`, description: c.challenge, path: casePath(c) });
}

export default async function CasePage({ params }: Props) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const services = SERVICES.filter((s) => s.caseIds.includes(c.id));
  const others = CASES.filter((o) => o.id !== c.id).slice(0, 3);
  const path = casePath(c);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.challenge,
      url: `${SITE_URL}${path}`,
      author: { "@id": `${SITE_URL}/who-we-are#kiryl-katushkin` },
      publisher: { "@id": `${SITE_URL}/#organisation` },
      about: c.cap,
      keywords: c.chips.join(", "),
    },
    breadcrumbJsonLd([
      { name: "Who we are", path: "/who-we-are" },
      { name: c.title, path },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <section className="sec cases on-ink">
        <div className="wrap">
          <Crumbs items={[{ name: "Who we are", href: "/who-we-are" }, { name: c.title }]} />
          <Reveal as="div" className="sec-head">
            <span className="eyebrow">Case study · {c.cap}</span>
            <h1>{c.title}</h1>
            <p>
              Drawn from delivery inside a large regulated financial-services firm and published in de-identified form
              only: no client, system, dataset or document is named; third-party platforms are.
            </p>
          </Reveal>

          <div className="case-grid case-grid--single">
            <Reveal as="article" className="case">
              <div className="case-top">
                <span className="case-cap">{c.cap}</span>
              </div>
              <div className="case-metric">
                <span className="m">{c.metric}</span>
                <span className="ml">{c.metricLabel}</span>
              </div>
              <dl>
                <dt>Challenge</dt>
                <dd>{c.challenge}</dd>
                <dt className="ok">Built</dt>
                <dd>{c.built}</dd>
              </dl>
              <div className="chips">
                {c.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="case-rel">
            {services.map((s) => (
              <p key={s.id}>
                The service: <Link href={servicePath(s)}>{s.title} →</Link>
              </p>
            ))}
            <p>
              More case studies:{" "}
              {others.map((o, i) => (
                <span key={o.id}>
                  {i > 0 && " · "}
                  <Link href={casePath(o)}>{o.title}</Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </>
  );
}
