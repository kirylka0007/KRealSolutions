import { z } from "zod";

export const healthCheckSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  industry: z.enum([
    "banking",
    "asset_management",
    "insurance",
    "other_regulated_fs",
    "manufacturing",
    "retail",
    "public_sector",
    "healthcare",
    "technology",
    "energy",
    "other",
  ]),
  teamSize: z.enum(["1-5", "6-15", "16-50", "50+"]),
  maturity: z.enum(["none", "spreadsheets_bi", "some_automation", "advanced"]),
  budget: z.enum(["exploring", "small_pilot", "dedicated"]),
  aim: z.enum(["genai", "starting", "tools", "continuous", "exploring"]),
  painPoint: z.string().trim().max(1000).optional().or(z.literal("")),
  honeypot: z.string().max(200).optional().or(z.literal("")),
});

export type HealthCheckInput = z.infer<typeof healthCheckSchema>;
