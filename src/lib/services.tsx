import type { ReactNode } from "react";

/**
 * The six service lines: the /services page and each service's own page
 * (/services/<slug>) render from this one list, so they cannot drift apart.
 * `id` is the section anchor the site has always linked to (/services#ccm),
 * kept so old links still land on the right card.
 */
export interface Service {
  id: string;
  slug: string;
  title: string;
  /** Four delivery lines, then two advisory lines. */
  kind: "delivery" | "advisory";
  body: ReactNode;
  /** The same description as plain text, for page descriptions and structured data. */
  summary: string;
  tags: string[];
  stat?: ReactNode;
  engagement: { duration: string; fee: string; deliverables: string };
  /** Case studies (see cases.ts) that show this line in production. */
  caseIds: string[];
  /** The Innovation Lab showcase that demonstrates it, if there is one. */
  lab?: { anchor: string; name: string };
}

export const SERVICES: Service[] = [
  {
    id: "ccm",
    slug: "continuous-controls-monitoring",
    title: "Continuous Assurance & Controls Monitoring",
    kind: "delivery",
    body: "We design and build always-on control monitoring: data feeds from your source systems, blended and scored, with exception logic that surfaces breaches automatically and routes them to the right auditor – moving you from periodic samples to full-population coverage",
    summary:
      "Always-on control monitoring: data feeds from your source systems, blended and scored, with exception logic that surfaces breaches automatically and routes them to the right auditor.",
    tags: ["Microsoft Fabric", "Power BI", "Dataflows", "Power Automate"],
    engagement: {
      duration: "8-12 weeks",
      fee: "Fixed fee, milestone-based",
      deliverables:
        "a working continuous-monitoring platform live on your data feeds · exception-routing logic tuned to your controls · documentation and handover training",
    },
    caseIds: ["ccm-01", "ccm-02", "assur-01"],
    lab: { anchor: "continuous-monitoring", name: "Continuous controls monitoring" },
  },
  {
    id: "genai",
    slug: "genai-for-internal-audit",
    title: "GenAI for Internal Audit",
    kind: "delivery",
    body: "Practical, governed LLM and vision AI across the audit lifecycle – document and policy review, risk assessment, fraud indicators, QA and reporting. We deploy it safely for regulated environments, with a human in the loop by design.",
    summary:
      "Practical, governed LLM and vision AI across the audit lifecycle – document and policy review, risk assessment, fraud indicators, QA and reporting – with a human in the loop by design.",
    tags: ["Generative AI", "Databricks", "RAG", "Vision"],
    engagement: {
      duration: "6-10 weeks per use case",
      fee: "Fixed fee per use case",
      deliverables:
        "one GenAI workflow live in your audit lifecycle · a governed deployment with human-in-the-loop sign-off built in · a reusable pattern for your next use case",
    },
    caseIds: ["genai-01", "genai-02", "genai-03", "genai-04"],
    lab: { anchor: "contract-assurance", name: "Contract assurance" },
  },
  {
    id: "auto",
    slug: "audit-analytics-automation",
    title: "Audit & Analytics Automation",
    kind: "delivery",
    body: "We automate the audit operating model – follow-ups, request management, incident summarisation and reporting – so your team spends its time on judgement, not admin. Built on the Microsoft and Alteryx stack you already run.",
    summary:
      "Automating the audit operating model – follow-ups, request management, incident summarisation and reporting – on the Microsoft and Alteryx stack you already run.",
    tags: ["Power Automate", "Alteryx", "Python", "SharePoint"],
    engagement: {
      duration: "4-8 weeks",
      fee: "Fixed fee",
      deliverables:
        "an automated workflow live on your Microsoft/Alteryx stack · a documented process your team can maintain · a time-saved baseline to prove ROI",
    },
    caseIds: ["auto-01", "genai-04"],
  },
  {
    id: "pm",
    slug: "process-mining",
    title: "Process Mining & Process Intelligence",
    kind: "delivery",
    body: "We reconstruct how a process actually runs from its event data – not how the flowchart says it does. Expose variants, rework loops and control gaps, and quantify the case for change with evidence, not anecdote.",
    summary:
      "Reconstructing how a process actually runs from its event data – exposing variants, rework loops and control gaps, and quantifying the case for change with evidence.",
    tags: ["Snowflake", "Process Mining", "Event logs"],
    engagement: {
      duration: "3-6 weeks",
      fee: "Fixed fee",
      deliverables:
        "a reconstructed process map from your actual event-log data · a quantified case for change · a prioritised list of where to act first",
    },
    caseIds: ["pm-01"],
    lab: { anchor: "process-mining", name: "Process mining" },
  },
  {
    id: "euc",
    slug: "self-service-analytics-assurance",
    title: "Self-Service Analytics Assurance",
    kind: "advisory",
    body: (
      <>
        Business-built Alteryx workflows, Power Automate flows, Power BI models and Python scripts now run critical processes – usually outside any formal development lifecycle. We review the estate for logic errors, hidden control weaknesses, key-person risk and missing documentation, and put the governance in place to keep it audit-ready. Assurance <em>over</em> the tools, not just building with them.
      </>
    ),
    summary:
      "A review of business-built Alteryx, Power Automate, Power BI and Python for logic errors, hidden control weaknesses, key-person risk and missing documentation, and the governance to keep it audit-ready.",
    tags: ["Alteryx review", "Power Automate review", "Python", "EUC governance", "Data lineage"],
    stat: (
      <>
        Long-standing research finds <b>~88%</b> of business spreadsheets contain errors – that&apos;s the estate you&apos;re not testing. <span style={{ opacity: 0.6 }}>Panko / EuSpRIG</span>
      </>
    ),
    engagement: {
      duration: "3-6 weeks for the estate review, ongoing governance available as a retainer",
      fee: "Fixed fee for the review; optional retainer after",
      deliverables:
        "a full inventory and risk-rating of your Alteryx/Power BI/Python estate · a governance framework to keep it audit-ready · a prioritised remediation list for the highest-risk items",
    },
    caseIds: [],
  },
  {
    id: "risk-intel",
    slug: "stakeholder-risk-intelligence",
    title: "Stakeholder & Risk Intelligence",
    kind: "advisory",
    body: (
      <>
        Audit teams meet the business on a schedule – but those meetings are often run ad hoc: sessions slip, notes never get written up, and the insight ends up scattered across individual notebooks and laptops. We build a single tracker for the whole relationship model – stakeholders, tasks, follow-ups and notes in one place – with an AI layer reading across the notes to surface emerging risks and recurring themes. It turns everyday stakeholder contact into a live input for audit planning and risk assessment: the <em>soft-signal</em> complement to continuous controls monitoring.
      </>
    ),
    summary:
      "A single tracker for stakeholders, tasks, follow-ups and notes, with an AI layer reading across the notes to surface emerging risks and recurring themes for audit planning.",
    tags: ["Engagement tracker", "AI note insights", "Risk signals", "Audit planning", "Power Platform"],
    engagement: {
      duration: "4-6 weeks to build, ongoing insights layer available as a retainer",
      fee: "Fixed fee for the build; optional retainer after",
      deliverables:
        "a single tracker live for your stakeholder/task/notes data · an AI layer surfacing emerging risks from your notes · integration into your existing audit-planning process",
    },
    caseIds: [],
    lab: { anchor: "stakeholder-relationships", name: "Stakeholder relationships" },
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const servicePath = (s: Service) => `/services/${s.slug}`;
export const serviceById = (id: string) => {
  const s = SERVICES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown service id "${id}"`);
  return s;
};
