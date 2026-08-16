import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email().max(320),
  organisation: z.string().trim().max(200).optional().or(z.literal("")),
  role: z.string().trim().max(200).optional().or(z.literal("")),
  intent: z.enum(["genai", "starting", "tools", "continuous", "exploring"]).optional(),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
