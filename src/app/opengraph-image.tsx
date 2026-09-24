import { ImageResponse } from "next/og";

// The card LinkedIn and search results show when the site is shared.
export const alt = "K Real Solutions – practical analytics and AI solutions for internal audit and compliance teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<Card eyebrow="Edinburgh · UK" title="K Real Solutions" line="We build practical analytics and AI solutions for internal audit and compliance teams" />, size);
}

/** Shared by the Innovation Lab's own card. Brand tokens from globals.css. */
/** `title` may be several lines, each rendered on its own. */
export function Card({ eyebrow, title, line }: { eyebrow: string; title: string | string[]; line: string }) {
  const lines = Array.isArray(title) ? title : [title]
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#0C232B",
        color: "#DDE6E5",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#93A6A9" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#12A594" }} />
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 800, color: "#ffffff", lineHeight: 1.02 }}>
          {lines.map(l => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 38, lineHeight: 1.3, color: "#DDE6E5", maxWidth: 980 }}>{line}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#19C9B4" }}>
        <span>krealsolutions.co.uk</span>
        <span style={{ color: "#93A6A9" }}>Internal audit · risk · compliance</span>
      </div>
    </div>
  );
}
