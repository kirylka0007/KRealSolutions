import { Nav } from "@/components/sections/Nav";
import { Positioning } from "@/components/sections/Positioning";
import { Approach } from "@/components/sections/Approach";
import { Cases } from "@/components/sections/Cases";
import { TechStrip } from "@/components/sections/TechStrip";
import { Footer } from "@/components/sections/Footer";

export default function WhoWeArePage() {
  return (
    <>
      <Nav />
      <Positioning />
      <Approach />
      <Cases />
      <TechStrip />
      <Footer />
    </>
  );
}
