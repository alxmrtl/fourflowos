import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { TAILWIND_COLORS, TYPE_SCALE, DURATION_MS, EASE_FLOW_CSS, CSS_VARS } from "./src/styles/tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      // All color values come from src/styles/tokens.ts — edit there, not here.
      colors: TAILWIND_COLORS,
      fontSize: TYPE_SCALE as unknown as Record<string, [string, Record<string, string>]>,
      transitionDuration: Object.fromEntries(
        Object.entries(DURATION_MS).map(([k, v]) => [k, `${v}ms`]),
      ),
      transitionTimingFunction: {
        flow: EASE_FLOW_CSS,
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({ ":root": CSS_VARS });
    }),
  ],
};

export default config;
