import { Reveal } from "@/components/Reveal";

export function Positioning() {
  return (
    <section className="positioning">
      <div className="wrap">
        <Reveal as="div" className="principal">
          <div className="principal-photo" aria-hidden="true">
            {/* TODO [HUMAN INPUT]: add a headshot to /public/kiryl.jpg (min 800x800) and
                replace this placeholder with:
                <Image src="/kiryl.jpg" alt="Kiryl Katushkin" width={120} height={120} /> */}
          </div>
          <div>
            <div className="principal-name">Kiryl Katushkin, FCCA</div>
            <a
              href="https://www.linkedin.com/in/kirylkatushkin/"
              target="_blank"
              rel="noopener"
              className="principal-linkedin"
            >
              LinkedIn <span className="arrow">→</span>
            </a>
          </div>
        </Reveal>
        <Reveal as="div" className="grid">
          <p className="big">Founded by an auditor who can build – and a data scientist who understands assurance</p>
          <div className="body">
            <p>
              Most audit-analytics advice comes from one of two camps: auditors who can&apos;t build, or technologists who don&apos;t understand assurance. K Real Solutions was founded by Kiryl to sit in the overlap –{" "}
              <strong>FCCA-qualified, with an MSc in Data Science and fifteen years across financial services and Big 4 audit (EY, KPMG, Deloitte)</strong>.
            </p>
            <p style={{ marginTop: 16 }}>
              That experience includes putting AI and automation into <strong>live production inside a large, regulated financial-services firm</strong> – solutions that survive contact with real controls, real regulators and real audit committees. That&apos;s the difference between a proof-of-concept and something your function can actually run.
            </p>
            <p style={{ marginTop: 16 }}>
              K Real Solutions is based in Edinburgh, UK, and works with clients across the UK and internationally, subject to local regulatory requirements
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
