import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

/**
 * Sent with every response. The policy only forbids other sites from framing
 * these pages (so no one can be tricked into clicking through an invisible
 * copy of them), plugins, and a rewritten base URL; it does not
 * restrict scripts, so nothing on the page can break because of it.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// BotID adds the rewrites its browser check talks to; see instrumentation-client.ts.
export default withBotId(nextConfig);
