export type Industry =
  | "public_sector"
  | "housing"
  | "healthcare"
  | "education"
  | "energy"
  | "transport"
  | "manufacturing"
  | "retail"
  | "technology"
  | "professional_services"
  | "charity"
  | "banking"
  | "asset_management"
  | "insurance"
  | "other_regulated_fs"
  | "other";

/**
 * Order here is the order shown in the dropdown, since the options are built
 * from `Object.keys`. Existing keys are never renamed — answers already
 * submitted are stored against them — so widening the list means adding keys
 * and reordering, not rewriting what is there.
 */
export const INDUSTRY_LABELS: Record<Industry, string> = {
  public_sector: "Public sector & local government",
  housing: "Housing & social housing",
  healthcare: "Healthcare & NHS",
  education: "Education & universities",
  energy: "Energy & utilities",
  transport: "Transport & infrastructure",
  manufacturing: "Manufacturing",
  retail: "Retail & consumer",
  technology: "Technology & software",
  professional_services: "Professional & business services",
  charity: "Charity & not-for-profit",
  banking: "Banking",
  asset_management: "Asset & investment management",
  insurance: "Insurance",
  other_regulated_fs: "Other regulated financial services",
  other: "Other",
};

export type TeamSize = "1-5" | "6-15" | "16-50" | "50+";

export const TEAM_SIZE_LABELS: Record<TeamSize, string> = {
  "1-5": "1-5",
  "6-15": "6-15",
  "16-50": "16-50",
  "50+": "50+",
};

export type Maturity = "none" | "spreadsheets_bi" | "some_automation" | "advanced";

export const MATURITY_LABELS: Record<Maturity, string> = {
  none: "None yet",
  spreadsheets_bi: "Spreadsheets & BI",
  some_automation: "Some automation",
  advanced: "Advanced",
};

export type Budget = "exploring" | "small_pilot" | "dedicated";

export const BUDGET_LABELS: Record<Budget, string> = {
  exploring: "Exploring only",
  small_pilot: "Small pilot budget",
  dedicated: "Dedicated budget",
};

export type MaturityTier = "early" | "building" | "scaling";
