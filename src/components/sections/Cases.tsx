import { Reveal } from "@/components/Reveal";

const CASES = [
  { tag: "CCM-01", cap: "Continuous monitoring", title: "Continuous controls monitoring platform", metric: "24/7", metricLabel: "Always-on monitoring", challenge: "Controls assurance relied on periodic, sample-based testing — long gaps and no live view of control health.", built: "A monitoring platform in Microsoft Fabric: controls-performance feeds from multiple systems, blended via dataflows, with exception logic and combined scorecards in Power BI Service and Power Automate alerts the moment a control breaches.", chips: ["Microsoft Fabric", "Power BI", "Power Automate"] },
  { tag: "CCM-02", cap: "Manual control, automated", title: "Unstructured email into a tested control", metric: "100%", metricLabel: "Population, not a sample", challenge: "Manual controls that hinge on reading inbound email get tested by sampling a handful — most of the population goes unchecked.", built: "AI that turns an unstructured email feed into a structured dataset the moment mail lands, then reconciles it against the business record so the whole population is tested automatically. First applied to corporate-action notifications; the pattern fits any email-driven control.", chips: ["Power Automate", "Alteryx", "Azure OpenAI", "Power BI"] },
  { tag: "ASSUR-01", cap: "Combined assurance", title: "Firm-wide combined assurance map", metric: "4→1", metricLabel: "Assurance lines, one map", challenge: "Audit, risk, compliance and financial-crime teams assured risk in isolation — duplicated effort, blind spots at the seams.", built: "A single top-down assurance map in Power BI showing coverage and work performed across every line, so each can target genuine gaps rather than re-cover ground.", chips: ["Power BI", "SharePoint"] },
  { tag: "GENAI-01", cap: "GenAI · at scale", title: "Bulk legal & document analysis", metric: "~3,000", metricLabel: "Documents analysed", challenge: "Large volumes of legal and client documents hold risk and insight no team can review manually at scale.", built: "A reusable GenAI engine for bulk extraction and analysis. In one application it analysed ~3,000 client documents for ESG consistency, using cohort analysis to flag outliers where messaging over- or understated ESG considerations.", chips: ["Databricks", "Azure OpenAI", "RAG"] },
  { tag: "GENAI-02", cap: "GenAI · text", title: "Policy contradiction review", metric: "Whole", metricLabel: "Policy set, read at once", challenge: "Large policy estates accumulate internal contradictions manual review rarely catches in full.", built: "An LLM review that reads entire policy sets and flags inconsistencies and contradictions across long documents no reviewer could hold in their head at once.", chips: ["Azure OpenAI", "Text analysis"] },
  { tag: "GENAI-03", cap: "Vision AI · fraud", title: "Fake-receipt detection with vision AI", metric: "Every", metricLabel: "Receipt image inspected", challenge: "The “receipt required” control is easy to game — people attach blank pages that say “no receipt” just to clear the check.", built: "A vision-AI indicator that inspects every uploaded image, separates genuine receipts from fabricated ones, and surfaces the highest-value cases, repeat claimants and the approvers signing them off.", chips: ["Azure OpenAI (Vision)", "Power BI"] },
  { tag: "PM-01", cap: "Process mining", title: "End-to-end process mining", metric: "12-mo", metricLabel: "Event log reconstructed", challenge: "A creation, approval and distribution process was assumed to run one way; no one had seen how it actually ran.", built: "Process mining across a 12-month event log — reconstructing the real process, its variants and rework loops, and quantifying the inefficiency.", chips: ["Process Mining", "Event-log analysis"] },
  { tag: "AUTO-01", cap: "Automation", title: "Automated audit-action follow-up", metric: "0", metricLabel: "Manual chasing", challenge: "Chasing findings and actions across stakeholders was manual and time-consuming, dragging on completion rates.", built: "A Power Automate solution that notifies auditors and stakeholders of upcoming and overdue actions with full context, and opens the follow-up conversation automatically.", chips: ["Power Automate", "Teams"] },
  { tag: "GENAI-04", cap: "GenAI · briefings", title: "Automated intelligence briefings", metric: "Any", metricLabel: "Source → scheduled digest", challenge: "Insight that would sharpen audit — incidents, control breaches, emerging risks, market news — sits scattered across systems and reaches the team late, or not at all.", built: "Briefings that pull from any source, have AI summarise and categorise, and land as a structured daily or weekly digest. Incident summaries were the first; the same engine drives any feed the team needs to stay ahead of.", chips: ["Power Automate", "Alteryx", "Azure OpenAI"] },
];

export function Cases() {
  return (
    <section className="sec cases" id="work">
      <div className="wrap">
        <Reveal as="div" className="sec-head">
          <span className="eyebrow">Selected work</span>
          <h2>Assurance problems, solved in production.</h2>
          <p>Drawn from delivery inside a large regulated financial-services firm and described here without identifying the client. Third-party platforms are named; internal systems are not.</p>
        </Reveal>

        <div className="case-grid">
          {CASES.map((c) => (
            <Reveal as="article" className="case" key={c.tag}>
              <div className="case-top">
                <span className="case-tag">{c.tag}</span>
                <span className="case-cap">{c.cap}</span>
              </div>
              <h3>{c.title}</h3>
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
          ))}
        </div>

        <Reveal as="div" className="further">
          <span className="lab">Further work</span>
          <span className="item">PDF authorisation &amp; SoD testing · Alteryx + Python</span>
          <span className="item">Control-test generator · LLM</span>
          <span className="item">Audit QA challenge &amp; sentiment · LLM</span>
          <span className="item">Quarterly risk assessment · LLM</span>
        </Reveal>
      </div>
    </section>
  );
}
