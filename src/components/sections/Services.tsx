import { Reveal } from "@/components/Reveal";

const SERVICES = [
  { no: "01 / CCM", title: "Continuous Assurance & Controls Monitoring", body: "Design and build always-on control monitoring: data feeds from your source systems, blended and scored, with exception logic that surfaces breaches automatically and routes them to the right auditor – moving you from periodic samples to full-population coverage.", tags: ["Microsoft Fabric", "Power BI", "Dataflows", "Power Automate"] },
  { no: "02 / GENAI", title: "GenAI for Internal Audit", body: "Practical, governed LLM and vision AI across the audit lifecycle – document and policy review, risk assessment, fraud indicators, QA and reporting. Deployed safely for regulated environments, with a human in the loop by design.", tags: ["Azure OpenAI", "Databricks", "RAG", "Vision"] },
  { no: "03 / AUTO", title: "Audit & Analytics Automation", body: "Automate the audit operating model – follow-ups, request management, incident summarisation and reporting – so the team spends its time on judgement, not admin. Built on the Microsoft and Alteryx stack you already run.", tags: ["Power Automate", "Alteryx", "Python", "SharePoint"] },
  { no: "04 / PM", title: "Process Mining & Process Intelligence", body: "Reconstruct how a process actually runs from its event data – not how the flowchart says it does. Expose variants, rework loops and control gaps, and quantify the case for change with evidence, not anecdote.", tags: ["PM4Py", "Process Mining", "Event logs"] },
];

export function Services() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What I do</span>
          <h2>Four delivery lines, two advisory lines</h2>
          <p>Capabilities that modernise your assurance – plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence. Every engagement includes knowledge transfer, so your team owns what we deliver.</p>
        </Reveal>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Reveal as="article" className="svc" key={s.no}>
              <span className="no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal as="article" className="svc svc--wide">
            <div className="svc-wide-main">
              <span className="no">05 / EUC</span>
              <h3>Self-Service Analytics Assurance</h3>
              <p>
                Business-built Alteryx workflows, Power Automate flows, Power BI models and Python scripts now run critical processes – usually outside any formal development lifecycle. I review the estate for logic errors, hidden control weaknesses, key-person risk and missing documentation, and put the governance in place to keep it audit-ready. Assurance <em>over</em> the tools, not just building with them.
              </p>
              <div className="svc-stat">
                <b>88%</b> of business spreadsheets contain errors – that&apos;s the estate you&apos;re not testing. <span style={{ opacity: 0.6 }}>Panko / EuSpRIG</span>
              </div>
            </div>
            <div className="svc-wide-side">
              <div className="tags">
                <span>Alteryx review</span>
                <span>Power Automate review</span>
                <span>Python</span>
                <span>EUC governance</span>
                <span>Data lineage</span>
              </div>
            </div>
          </Reveal>

          <Reveal as="article" className="svc svc--wide">
            <div className="svc-wide-main">
              <span className="no">06 / RISK-INTEL</span>
              <h3>Stakeholder & Risk Intelligence</h3>
              <p>
                Audit teams meet the business on a schedule – but those meetings are often run ad hoc: sessions slip, notes never get written up, and the insight ends up scattered across individual notebooks and laptops. I build a single tracker for the whole relationship model – stakeholders, tasks, follow-ups and notes in one place – with an AI layer reading across the notes to surface emerging risks and recurring themes. It turns everyday stakeholder contact into a live input for audit planning and risk assessment: the <em>soft-signal</em> complement to continuous controls monitoring.
              </p>
            </div>
            <div className="svc-wide-side">
              <div className="tags">
                <span>Engagement tracker</span>
                <span>AI note insights</span>
                <span>Risk signals</span>
                <span>Audit planning</span>
                <span>Power Platform</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
