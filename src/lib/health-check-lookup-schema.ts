import { z } from "zod";

export const healthCheckLookupSchema = z.object({
  email: z.string().trim().email().max(320),
});

export type HealthCheckLookupInput = z.infer<typeof healthCheckLookupSchema>;
