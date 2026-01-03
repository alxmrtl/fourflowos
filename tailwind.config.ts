import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FourFlow Brand Colors
        self: {
          DEFAULT: "#FF6F61",
          light: "#FF8A7E",
          dark: "#E65548",
        },
        space: {
          DEFAULT: "#6BA292",
          light: "#88B8A8",
          dark: "#558C7C",
        },
        story: {
          DEFAULT: "#5B84B1",
          light: "#7A9DC4",
          dark: "#466A8F",
        },
        spirit: {
          DEFAULT: "#7A4DA4",
          light: "#9468BA",
          dark: "#613D83",
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
