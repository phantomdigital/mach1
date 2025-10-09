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
        mach1: {
          black: '#262626',
        },
      },
      fontFamily: {
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
};

export default config;
