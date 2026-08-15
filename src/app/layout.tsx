import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { IntentProvider } from "@/context/IntentContext";

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

export const metadata: Metadata = {
  title: "K Real Solutions — Continuous, AI-driven assurance for internal audit",
  description:
    "Consulting for internal audit and assurance teams in regulated financial services: continuous controls monitoring, GenAI for audit, analytics automation and process mining — built by a qualified auditor and data scientist.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <IntentProvider>{children}</IntentProvider>
      </body>
    </html>
  );
}
