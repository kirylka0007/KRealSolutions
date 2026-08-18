import { Reveal } from "@/components/Reveal";

const SERVICES = [
  {
    id: "ccm",
    title: "Continuous Assurance & Controls Monitoring",
    body: "We design and build always-on control monitoring: data feeds from your source systems, blended and scored, with exception logic that surfaces breaches automatically and routes them to the right auditor – moving you from periodic samples to full-population coverage",
    tags: ["Microsoft Fabric", "Power BI", "Dataflows", "Power Automate"],
    engagement: {
      duration: "8-12 weeks",
      fee: "Fixed fee, milestone-based",
      deliverables: "a working continuous-monitoring platform live on your data feeds · exception-routing logic tuned to your controls · documentation and handover training",
    },
  },
  {
    id: "genai",
    title: "GenAI for Internal Audit",
    body: "Practical, governed LLM and vision AI across the audit lifecycle – document and policy review, risk assessment, fraud indicators, QA and reporting. We deploy it safely for regulated environments, with a human in the loop by design.",
    tags: ["Generative AI", "Databricks", "RAG", "Vision"],
    engagement: {
      duration: "6-10 weeks per use case",
      fee: "Fixed fee per use case",
      deliverables: "one GenAI workflow live in your audit lifecycle · a governed deployment with human-in-the-loop sign-off built in · a reusable pattern for your next use case",
    },
  },
  {
    id: "auto",
    title: "Audit & Analytics Automation",
    body: "We automate the audit operating model – follow-ups, request management, incident summarisation and reporting – so your team spends its time on judgement, not admin. Built on the Microsoft and Alteryx stack you already run.",
    tags: ["Power Automate", "Alteryx", "Python", "SharePoint"],
    engagement: {
      duration: "4-8 weeks",
      fee: "Fixed fee",
      deliverables: "an automated workflow live on your Microsoft/Alteryx stack · a documented process your team can maintain · a time-saved baseline to prove ROI",
    },
  },
  {
    id: "pm",
    title: "Process Mining & Process Intelligence",
    body: "We reconstruct how a process actually runs from its event data – not how the flowchart says it does. Expose variants, rework loops and control gaps, and quantify the case for change with evidence, not anecdote.",
    tags: ["Snowflake", "Process Mining", "Event logs"],
    engagement: {
      duration: "3-6 weeks",
      fee: "Fixed fee",
      deliverables: "a reconstructed process map from your actual event-log data · a quantified case for change · a prioritised list of where to act first",
    },
  },
];

export function Services() {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">What we do</span>
          <h2>Four delivery lines, two advisory lines</h2>
          <p>Capabilities that modernise your assurance – plus two advisory lines that govern the tools you already have and turn stakeholder engagement into risk intelligence. Every engagement includes knowledge transfer, so your team owns what we deliver.</p>
        </Reveal>
        <Reveal as="div" className="working-with-us-panel on-ink">
          <span className="eyebrow">Terms</span>
          <h3>Working with us</h3>
          <div className="working-with-us">
            <div>
              <b>Engagement basis</b>
              <p>Outside IR35, fixed-fee statement of work – no day-rate staffing arrangements</p>
            </div>
            <div>
              <b>Indicative first engagement</b>
              <p>Diagnostic from £1,500, fixed fee</p>
            </div>
            <div>
              <b>Knowledge transfer</b>
              <p>Documentation and upskilling are included in every engagement, not an add-on</p>
            </div>
            <div>
              <b>Location</b>
              <p>Based in Edinburgh; works remotely across the UK and on site as required</p>
            </div>
          </div>
        </Reveal>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Reveal as="article" className="svc" id={s.id} key={s.id}>
              <h3>{s.title}</h3>
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

          <Reveal as="article" className="svc svc--wide" id="euc">
            <div className="svc-wide-main">
              <h3>Self-Service Analytics Assurance</h3>
              <p>
                Business-built Alteryx workflows, Power Automate flows, Power BI models and Python scripts now run critical processes – usually outside any formal development lifecycle. We review the estate for logic errors, hidden control weaknesses, key-person risk and missing documentation, and put the governance in place to keep it audit-ready. Assurance <em>over</em> the tools, not just building with them.
              </p>
              <div className="svc-stat">
                Long-standing research finds <b>~88%</b> of business spreadsheets contain errors – that&apos;s the estate you&apos;re not testing. <span style={{ opacity: 0.6 }}>Panko / EuSpRIG</span>
              </div>
              <div className="svc-engagement">
                <p>
                  <b>Typical engagement:</b> 3-6 weeks for the estate review, ongoing governance available as a retainer
                </p>
                <p>
                  <b>Fee model:</b> Fixed fee for the review; optional retainer after
                </p>
                <p>
                  <b>You get:</b> a full inventory and risk-rating of your Alteryx/Power BI/Python estate · a governance framework to keep it audit-ready · a prioritised remediation list for the highest-risk items
                </p>
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

          <Reveal as="article" className="svc svc--wide" id="risk-intel">
            <div className="svc-wide-main">
              <h3>Stakeholder & Risk Intelligence</h3>
              <p>
                Audit teams meet the business on a schedule – but those meetings are often run ad hoc: sessions slip, notes never get written up, and the insight ends up scattered across individual notebooks and laptops. We build a single tracker for the whole relationship model – stakeholders, tasks, follow-ups and notes in one place – with an AI layer reading across the notes to surface emerging risks and recurring themes. It turns everyday stakeholder contact into a live input for audit planning and risk assessment: the <em>soft-signal</em> complement to continuous controls monitoring.
              </p>
              <div className="svc-engagement">
                <p>
                  <b>Typical engagement:</b> 4-6 weeks to build, ongoing insights layer available as a retainer
                </p>
                <p>
                  <b>Fee model:</b> Fixed fee for the build; optional retainer after
                </p>
                <p>
                  <b>You get:</b> a single tracker live for your stakeholder/task/notes data · an AI layer surfacing emerging risks from your notes · integration into your existing audit-planning process
                </p>
              </div>
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
