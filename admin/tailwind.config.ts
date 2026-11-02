import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ieee: {
          blue: '#00629B',
          dark: '#002855',
          cyan: '#00B5E2',
          electric: '#0072CE',
          light: '#E6F0F7',
        },
      },
    },
  },
  plugins: [],
};
export default config;

