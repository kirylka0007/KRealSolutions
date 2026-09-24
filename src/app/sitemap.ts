import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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
  ];
}
