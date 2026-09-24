import { initBotId } from "botid/client/core";

// The public form endpoints Vercel BotID checks. Each route also calls
// `rejectBots()` (src/lib/form-guard.ts), which is where a bot is refused;
// this only attaches the browser-side proof to the forms' requests.
initBotId({
  protect: [
    { path: "/api/enquiry", method: "POST" },
    { path: "/api/health-check", method: "POST" },
    { path: "/api/health-check/lookup", method: "POST" },
    { path: "/api/innovation-lab", method: "POST" },
  ],
});
