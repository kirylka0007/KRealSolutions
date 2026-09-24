import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SERVICES, servicePath } from "@/lib/services";
import { WorkingWithUs } from "@/components/sections/WorkingWithUs";

const DELIVERY = SERVICES.filter((s) => s.kind === "delivery");
const ADVISORY = SERVICES.filter((s) => s.kind === "advisory");

export function Services() {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What we do</span>
          <h1>Four delivery lines, two advisory lines</h1>
          <p>Capabilities that modernise your assurance – plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence. Every engagement includes knowledge transfer, so your team owns what we deliver.</p>
        </Reveal>
        <WorkingWithUs />
        <div className="svc-grid">
          {DELIVERY.map((s) => (
            <Reveal as="article" className="svc" id={s.id} key={s.id}>
              <h3>
                <Link href={servicePath(s)}>{s.title}</Link>
              </h3>
              <p>{s.body}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="svc-engagement">
                <p>
                  <b>Typical engagement:</b> {s.engagement.duration}
                </p>
                <p>
                  <b>Fee model:</b> {s.engagement.fee}
                </p>
                <p>
                  <b>You get:</b> {s.engagement.deliverables}
                </p>
              </div>
            </Reveal>
          ))}

          {ADVISORY.map((s) => (
            <Reveal as="article" className="svc svc--wide" id={s.id} key={s.id}>
              <div className="svc-wide-main">
                <h3>
                  <Link href={servicePath(s)}>{s.title}</Link>
                </h3>
                <p>{s.body}</p>
                {s.stat && <div className="svc-stat">{s.stat}</div>}
                <div className="svc-engagement">
                  <p>
                    <b>Typical engagement:</b> {s.engagement.duration}
                  </p>
                  <p>
                    <b>Fee model:</b> {s.engagement.fee}
                  </p>
                  <p>
                    <b>You get:</b> {s.engagement.deliverables}
                  </p>
                </div>
              </div>
              <div className="svc-wide-side">
                <div className="tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
