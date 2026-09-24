import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { casePath, type Case } from "@/lib/cases";

/** One case study card, as on Who we are; the title links to the case's own page. */
export function CaseCard({ c, anchor = true }: { c: Case; anchor?: boolean }) {
  return (
    <Reveal as="article" className="case" id={anchor ? c.id : undefined}>
      <div className="case-top">
        <span className="case-cap">{c.cap}</span>
      </div>
      <h3>
        <Link href={casePath(c)}>{c.title}</Link>
      </h3>
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
  );
}
