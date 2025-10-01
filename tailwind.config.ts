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
        'mach1-blue': '#2b2e7f',
        'mach1-red': '#ed1e24',
        'mach1-black': '#262626',
        mach1: {
          black: '#262626',
        },
      },
      fontFamily: {
        'inter-tight': ['var(--font-inter-tight)', 'sans-serif'],
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
};

export default config;
