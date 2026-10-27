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
        marfil: "#F5EFE7",
        arena: "#D8C7B4",
        taupe: "#A1887F",
        cafe: "#5A3E2B",
        oliva: "#4B5A3F",
        carbon: "#1F1F1F",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;