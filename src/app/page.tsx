import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Chooser } from "@/components/sections/Chooser";
import { Coverage } from "@/components/sections/Coverage";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { WorkTeaser } from "@/components/sections/WorkTeaser";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

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
