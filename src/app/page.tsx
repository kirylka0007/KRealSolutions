import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { StatBand } from "@/components/sections/StatBand";
import { Coverage } from "@/components/sections/Coverage";
import { Positioning } from "@/components/sections/Positioning";
import { Services } from "@/components/sections/Services";
import { Cases } from "@/components/sections/Cases";
import { TechStrip } from "@/components/sections/TechStrip";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Chooser />
      <StatBand />
      <Coverage />
      <Positioning />
      <Services />
      <Cases />
      <TechStrip />
      <Approach />
      <Contact />
      <Footer />
    </>
  );
}
