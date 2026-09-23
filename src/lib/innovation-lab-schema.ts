import { z } from "zod";
import { isFreeEmailDomain } from "./free-email-domains";

export const innovationLabSchema = z.object({
  name: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  companyWebsite: z.string().trim().min(1).max(300),
  industry: z.string().trim().min(1).max(100),
  reason: z.string().trim().min(1).max(2000),
  email: z
    .string()
    .trim()
    .email()
    .max(320)
    .refine((email) => !isFreeEmailDomain(email), {
      message: "Please use your company email address",
    }),
  // Ticked "consider me for the Founding Practitioner Cohort". Absent means no.
  foundingCohort: z.boolean().optional().default(false),
  honeypot: z.string().max(200).optional().or(z.literal("")),
});

export type InnovationLabInput = z.infer<typeof innovationLabSchema>;
