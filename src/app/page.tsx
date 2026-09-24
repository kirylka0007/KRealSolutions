import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { WorkTeaser } from "@/components/sections/WorkTeaser";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

// The home page takes the layout's default title and description; only
// the social card needs its title spelled out.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: "K Real Solutions – analytics and AI for internal audit", url: SITE_URL, siteName: "K Real Solutions", type: "website", locale: "en_GB" },
};

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Chooser />
      <Coverage />
      <ServicesTeaser />
      <WorkTeaser />
      <Contact />
      <Footer />
    </>
  );
}
