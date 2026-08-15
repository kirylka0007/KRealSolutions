import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        text: "var(--text)",
        "text-soft": "var(--text-soft)",
        "paper-text": "var(--paper-text)",
        "paper-text-soft": "var(--paper-text-soft)",
        assure: "var(--assure)",
        "assure-deep": "var(--assure-deep)",
        "assure-bright": "var(--assure-bright)",
        exception: "var(--exception)",
        "exception-red": "var(--exception-red)",
      },
      fontFamily: {
        archivo: ["var(--font-archivo)", "sans-serif"],
        "plex-sans": ["var(--font-plex-sans)", "sans-serif"],
        "plex-mono": ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
