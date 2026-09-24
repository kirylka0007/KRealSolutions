import { Nav } from "@/components/sections/Nav";
import { Services } from "@/components/sections/Services";
import { Footer } from "@/components/sections/Footer";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Audit analytics and controls monitoring services",
  description: "Continuous controls monitoring, GenAI for internal audit, analytics automation and process mining. Fixed-fee engagements with knowledge transfer included; diagnostic from £1,500.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <Services />
      <Footer />
    </>
  );
}
