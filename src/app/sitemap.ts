import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://krealsolutions.co.uk", // PLACEHOLDER — replace once domain is live
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
