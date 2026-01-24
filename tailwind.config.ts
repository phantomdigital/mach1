import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./slices/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mach1-blue': '#06038D',
        'mach1-red': '#ed1e24',
        'mach1-black': '#262626',
        'dark-blue': '#141433',
        'mach-gray': '#747474',
        'mach1-green': '#0EA5E9',
        mach1: {
          black: '#262626',
        },
      },
      fontFamily: {
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};

export default config;
