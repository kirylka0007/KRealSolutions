import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { Positioning } from "@/components/sections/Positioning";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
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
      <Coverage />
      <Positioning />
      <ServicesTeaser />
      <Cases />
      <TechStrip />
      <Approach />
      <Contact />
      <Footer />
    </>
  );
}
