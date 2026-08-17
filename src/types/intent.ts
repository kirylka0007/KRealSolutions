export type IntentKey = "genai" | "starting" | "tools" | "continuous" | "exploring";

export const INTENT_LABELS: Record<IntentKey, string> = {
  genai: "Get value from GenAI in audit",
  starting: "Start our data-analytics journey",
  tools: "Get more from tools we own",
  continuous: "Move to continuous assurance",
  exploring: "Not sure yet",
};
