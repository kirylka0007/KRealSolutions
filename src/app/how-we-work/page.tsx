import { Nav } from "@/components/sections/Nav";
import { Positioning } from "@/components/sections/Positioning";
import { Approach } from "@/components/sections/Approach";
import { TechStrip } from "@/components/sections/TechStrip";
import { Footer } from "@/components/sections/Footer";

export default function HowWeWorkPage() {
  return (
    <>
      <Nav />
      <Positioning />
      <Approach />
      <TechStrip />
      <Footer />
    </>
  );
}