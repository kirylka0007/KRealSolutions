import { Reveal } from "@/components/Reveal";

export function Positioning() {
  return (
    <section className="positioning">
      <div className="wrap">
        <Reveal as="div" className="grid">
          <p className="big">An auditor who can build. A data scientist who understands assurance.</p>
          <div className="body">
            <p>
              Most audit-analytics advice comes from one of two camps: auditors who can&apos;t build, or technologists who don&apos;t understand assurance. I sit in the overlap —{" "}
              <strong>FCCA-qualified, with an MSc in Data Science and fifteen years across financial services and Big 4 audit (EY, KPMG)</strong>.
            </p>
            <p style={{ marginTop: 16 }}>
              More importantly, I&apos;ve put AI and automation into <strong>live production inside a large, regulated asset manager</strong> — solutions that survive contact with real controls, real regulators and real audit committees. That&apos;s the difference between a proof-of-concept and something your function can actually run.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
