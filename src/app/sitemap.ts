import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICES, servicePath } from "@/lib/services";
import { CASES, casePath } from "@/lib/cases";

// No lastModified: stamping every page with the build time told search
// engines everything changed on each deploy. The lookup page is left out
// (and marked noindex) because it is a utility, not content.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/innovation-lab`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/who-we-are`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/health-check`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    ...SERVICES.map((s) => ({ url: `${SITE_URL}${servicePath(s)}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...CASES.map((c) => ({ url: `${SITE_URL}${casePath(c)}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
