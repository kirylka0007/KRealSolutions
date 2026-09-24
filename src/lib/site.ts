/** The one place the site's own address is written; sitemap, robots and metadata read it. */
export const SITE_URL = "https://krealsolutions.co.uk";

/**
 * Structured data describing the practice, for search engines. Every fact
 * here is stated elsewhere on the site (footer, Who we are, Contact): keep
 * the two in step, and add nothing here that the pages do not already say.
 */
export const organisationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organisation`,
      name: "K Real Solutions",
      legalName: "K Real Solutions Ltd",
      url: SITE_URL,
      email: "kiryl@krealsolutions.co.uk",
      description: "We build practical analytics and AI solutions for internal audit and compliance teams",
      identifier: { "@type": "PropertyValue", propertyID: "Companies House company number", value: "SC891005" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "7 Flint Terrace",
        addressLocality: "Edinburgh",
        postalCode: "EH15 1AE",
        addressRegion: "Scotland",
        addressCountry: "GB",
      },
      areaServed: { "@type": "Country", name: "United Kingdom" },
      founder: { "@id": `${SITE_URL}/who-we-are#kiryl-katushkin` },
      knowsAbout: [
        "Internal audit",
        "Co-sourced internal audit",
        "Continuous controls monitoring",
        "Process mining",
        "Generative AI for internal audit",
        "Audit analytics automation",
        "End-user computing risk",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "K Real Solutions",
      inLanguage: "en-GB",
      publisher: { "@id": `${SITE_URL}/#organisation` },
    },
  ],
};

/** The founder, as stated on Who we are. */
export const founderJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/who-we-are#kiryl-katushkin`,
  name: "Kiryl Katushkin",
  honorificSuffix: "FCCA",
  jobTitle: "Founder",
  worksFor: { "@id": `${SITE_URL}/#organisation` },
  url: `${SITE_URL}/who-we-are`,
  image: `${SITE_URL}/kiryl.jpg`,
  sameAs: ["https://www.linkedin.com/in/kirylkatushkin/"],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", credentialCategory: "Professional qualification", name: "FCCA" },
    { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "MSc in Data Science" },
  ],
};

/**
 * One page's metadata. Built in full each time because Next.js replaces the
 * layout's `openGraph` object rather than merging into it, so a page that
 * set only a title there would lose the site name and locale.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  path: string;
  /** The sharing card; the site-wide one unless the page has its own. */
  image?: string;
}) {
  const images = [{ url: image, width: 1200, height: 630 }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "K Real Solutions", type: "website" as const, locale: "en_GB", images },
    twitter: { card: "summary_large_image" as const, title, description, images },
  };
}

/** The same trail as `Crumbs`, as structured data; the home page is its first step. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
