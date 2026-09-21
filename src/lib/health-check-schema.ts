import { z } from "zod";
import { INDUSTRY_LABELS, type Industry } from "@/types/health-check";

/**
 * Derived from `INDUSTRY_LABELS` rather than restated, so the accepted values
 * and the values the form actually offers cannot drift apart. They had: the
 * dropdown gained sectors the schema still rejected, which would have failed a
 * genuine submission on the server after the visitor had filled the form in.
 */
const INDUSTRY_VALUES = Object.keys(INDUSTRY_LABELS) as [Industry, ...Industry[]];

export const healthCheckSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  industry: z.enum(INDUSTRY_VALUES),
  teamSize: z.enum(["1-5", "6-15", "16-50", "50+"]),
  maturity: z.enum(["none", "spreadsheets_bi", "some_automation", "advanced"]),
  budget: z.enum(["exploring", "small_pilot", "dedicated"]),
  aim: z.enum(["genai", "starting", "tools", "continuous", "exploring"]),
  painPoint: z.string().trim().max(1000).optional().or(z.literal("")),
  honeypot: z.string().max(200).optional().or(z.literal("")),
});

export type HealthCheckInput = z.infer<typeof healthCheckSchema>;
