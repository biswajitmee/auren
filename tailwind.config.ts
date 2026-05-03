import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "var(--color-obsidian)",
        gold: "var(--color-gold)",
        amber: "var(--color-amber)",
        rose: "var(--color-rose)",
        ivory: "var(--color-ivory)",
        smoke: "var(--color-smoke)",
        charcoal: "var(--color-charcoal)",
        bronze: "var(--color-bronze)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Manrope", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "Consolas", "monospace"]
      },
      letterSpacing: {
        widebrand: "0.32em"
      },
      backgroundImage: {
        "gold-line": "linear-gradient(90deg, transparent, rgba(201,168,76,.8), transparent)"
      },
      boxShadow: {
        "gold-soft": "0 0 34px rgba(201,168,76,.16)"
      }
    }
  },
  plugins: []
};

export default config;
