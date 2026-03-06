import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      colors: {
        // FourFlow Brand Colors — keep in sync with src/styles/brand-colors.ts
        self: {
          DEFAULT: "#E84535",
          light: "#F05A49",
          dark: "#C4311F",
        },
        space: {
          DEFAULT: "#4E8C73",
          light: "#6AAF8E",
          dark: "#37634F",
        },
        story: {
          DEFAULT: "#3E6FA3",
          light: "#5A8DC2",
          dark: "#2B5080",
        },
        spirit: {
          DEFAULT: "#6330A0",
          light: "#8248C8",
          dark: "#461F78",
        },
        neutral: {
          DEFAULT: "#333333",
          light: "#666666",
          dark: "#1A1A1A",
        },
        background: {
          DEFAULT: "#F5F5F5",
          light: "#FFFFFF",
          dark: "#E8E8E8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
