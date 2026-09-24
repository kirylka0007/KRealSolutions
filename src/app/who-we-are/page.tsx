import { Nav } from "@/components/sections/Nav";
import { Positioning } from "@/components/sections/Positioning";
import { Approach } from "@/components/sections/Approach";
import { Cases } from "@/components/sections/Cases";
import { TechStrip } from "@/components/sections/TechStrip";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";
import { founderJsonLd, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Kiryl Katushkin FCCA – auditor and data scientist",
  description: "FCCA-qualified, with an MSc in Data Science and fifteen years across financial services and Big 4 audit. De-identified case studies of AI and analytics in production.",
  path: "/who-we-are",
});

export default function WhoWeArePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }} />
      <Nav />
      <Positioning />
      <Approach />
      <Cases />
      <TechStrip />
      <Footer />
    </>
  );
}
