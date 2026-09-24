import { ImageResponse } from "next/og";
import { Card } from "../opengraph-image";

// The card shown when the Innovation Lab page is shared, which is how most
// people arrive from LinkedIn.
export const alt = "K Real Solutions Innovation Lab – AI and analytics tools for internal audit, risk and compliance teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <Card
      eyebrow="Innovation Lab · preview access"
      title={["Next-generation audit,", "in motion"]}
      line="Six tools for internal audit, risk and compliance teams, in preview"
    />,
    size,
  );
}
