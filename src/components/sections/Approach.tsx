import { Reveal } from "@/components/Reveal";

const APPROACH = [
  { title: "Assurance-first", body: "Designed by someone who has sat on both sides of the control – the analytics serve the assurance objective, not the other way round." },
  { title: "Human in the loop", body: "AI accelerates and widens coverage; auditors keep judgement and accountability. Explainable by design." },
  { title: "Works with your stack", body: "Microsoft and Azure, Alteryx, Databricks – I build on what you already have and can govern, not a black box." },
  { title: "Transfer, not lock-in", body: "Your team owns the solution and the know-how. Documentation and upskilling are part of the deliverable." },
];

export function Approach() {
  return (
    <section className="sec" id="approach">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">How I work</span>
          <h2>Built for regulated environments</h2>
          <p>Audit functions can&apos;t run on prototypes. Everything I deliver is designed to hold up under scrutiny – from your second line to your regulator.</p>
        </Reveal>
        <div className="appr-grid">
          {APPROACH.map((a) => (
            <Reveal as="div" className="appr" key={a.title}>
              <h4>{a.title}</h4>
              <p>{a.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
