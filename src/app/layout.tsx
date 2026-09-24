import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { IntentProvider } from "@/context/IntentContext";
import { SITE_URL, organisationJsonLd } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const DESCRIPTION =
  "Edinburgh-based, FCCA-led consultancy building continuous controls monitoring, process mining and GenAI for internal audit, risk and compliance teams across the UK.";

// Each page sets its own title, description and canonical path; these are
// the defaults and the parts every page shares. The social image comes from
// `opengraph-image.tsx` (the Innovation Lab has its own).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Internal audit analytics and AI, Edinburgh | K Real Solutions",
    template: "%s | K Real Solutions",
  },
  description: DESCRIPTION,
  openGraph: {
    siteName: "K Real Solutions",
    type: "website",
    locale: "en_GB",
    url: "/",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }} />
        <IntentProvider>{children}</IntentProvider>
        <Analytics />
      </body>
    </html>
  );
}
