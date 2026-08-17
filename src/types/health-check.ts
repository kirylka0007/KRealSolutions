export type Industry =
  | "banking"
  | "asset_management"
  | "insurance"
  | "other_regulated_fs"
  | "manufacturing"
  | "retail"
  | "public_sector"
  | "healthcare"
  | "technology"
  | "energy"
  | "other";

export const INDUSTRY_LABELS: Record<Industry, string> = {
  banking: "Banking",
  asset_management: "Asset & investment management",
  insurance: "Insurance",
  other_regulated_fs: "Other regulated financial services",
  manufacturing: "Manufacturing",
  retail: "Retail & consumer",
  public_sector: "Public sector & government",
  healthcare: "Healthcare",
  technology: "Technology & software",
  energy: "Energy & utilities",
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
