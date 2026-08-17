import type { TeamSize, Maturity, Budget, MaturityTier } from "@/types/health-check";
import type { IntentKey } from "@/types/intent";

const TEAM_SIZE_POINTS: Record<TeamSize, number> = { "1-5": 0, "6-15": 1, "16-50": 2, "50+": 3 };
const MATURITY_POINTS: Record<Maturity, number> = { none: 0, spreadsheets_bi: 1, some_automation: 2, advanced: 3 };
const BUDGET_POINTS: Record<Budget, number> = { exploring: 0, small_pilot: 1, dedicated: 3 };

export function scoreMaturityTier(teamSize: TeamSize, maturity: Maturity, budget: Budget): MaturityTier {
  const score = TEAM_SIZE_POINTS[teamSize] + MATURITY_POINTS[maturity] + BUDGET_POINTS[budget];
  if (score <= 2) return "early";
  if (score <= 5) return "building";
  return "scaling";
}

export const MATURITY_TIER_LABELS: Record<MaturityTier, string> = {
  early: "Early stage",
  building: "Building momentum",
  scaling: "Scaling up",
};

type Recommendation = { headline: string; body: string };

const RECOMMENDATIONS: Record<IntentKey, Record<MaturityTier, Recommendation>> = {
  genai: {
    early: {
      headline: "Early stage, and GenAI is the right place to start",
      body: "You're just beginning to explore data and AI in audit, and GenAI is often the fastest way to see real value – document review, fraud indicators, and QA that would take a team weeks can run in hours, with a human still signing off every result. We'd start with a short health check to find where it pays off first in your function.",
    },
    building: {
      headline: "You've got momentum – GenAI can extend it",
      body: "With some automation already in place, you're ready to add GenAI to the highest-value parts of the audit lifecycle: document and policy review, fraud indicators, and reporting. We build it to run safely in a regulated environment, with a human in the loop by design.",
    },
    scaling: {
      headline: "Advanced already – GenAI is your next multiplier",
      body: "Your analytics capability is ahead of most audit functions we see. GenAI is the natural next step: bulk document analysis, vision-based fraud detection, and automated briefings that free your best people for judgement, not admin.",
    },
  },
  starting: {
    early: {
      headline: "A strong starting point for your analytics journey",
      body: "You're early, and that's the best time to build the right foundations. We help audit teams take the first steps: quick wins that build confidence, a practical roadmap, and hands-on training so the capability stays with your people, not a contractor.",
    },
    building: {
      headline: "Ready to formalise what you've already started",
      body: "You've got some automation running – the next step is turning ad hoc wins into a repeatable capability. We help build the roadmap and train your team so momentum doesn't stall once the first project ends.",
    },
    scaling: {
      headline: "You've outgrown getting started",
      body: "Your maturity suggests you're past the early roadmap stage – worth a conversation about where continuous assurance or GenAI would take you next, rather than more foundational training.",
    },
  },
  tools: {
    early: {
      headline: "Get the value you already paid for",
      body: "You've invested in tools like Alteryx, Power BI, or Power Automate – we review what's been built for value, control weaknesses, and key-person risk, and help you unlock the use cases the licences were bought for in the first place.",
    },
    building: {
      headline: "Time to govern what your team has built",
      body: "With more automation in place, self-service risk grows alongside it. We review the estate for logic errors and hidden control weaknesses, and put governance in place to keep it audit-ready without slowing your team down.",
    },
    scaling: {
      headline: "An advanced estate deserves advanced governance",
      body: "At your level of maturity, self-built analytics is likely running critical processes. We assure the estate itself – logic, control weaknesses, documentation – so it holds up under scrutiny from your second line or a regulator.",
    },
  },
  continuous: {
    early: {
      headline: "Continuous assurance, built from a solid first step",
      body: "Moving from sampling to always-on monitoring is a bigger step when you're early – we'd start by picking one control and scoping exactly what continuous coverage would take, so you can see the shift before committing further.",
    },
    building: {
      headline: "You're well placed to move to continuous coverage",
      body: "With existing automation as a foundation, we design and build continuous controls monitoring: data feeds blended and scored, exceptions flagged and routed automatically, moving you from a sample to the full population.",
    },
    scaling: {
      headline: "Continuous assurance is the natural next step",
      body: "Your maturity and budget put full population coverage well within reach. We design and build always-on monitoring across your priority controls, with exceptions routed to the right auditor automatically.",
    },
  },
  exploring: {
    early: {
      headline: "A good place to start is a conversation",
      body: "Not sure yet what would move the needle – and that's fine. We'll have a short, no-obligation conversation about your controls, your data, and your team, and tell you honestly where analytics and AI would help, and where they wouldn't.",
    },
    building: {
      headline: "Let's find the highest-value next step",
      body: "You've already got some momentum but aren't sure what to prioritise next. We'll walk through your current estate and controls landscape and point to the one or two moves that would pay off fastest.",
    },
    scaling: {
      headline: "Your options are broader than you might think",
      body: "At your level of maturity, you likely have several good directions available – GenAI, continuous monitoring, or governing what you've already built. We'll help you weigh them against what matters most to your function right now.",
    },
  },
};

export function getRecommendation(aim: IntentKey, tier: MaturityTier): Recommendation {
  return RECOMMENDATIONS[aim][tier];
}
