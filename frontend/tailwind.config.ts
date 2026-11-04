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
        neu: {
          bg: '#e8edf5',
          surface: '#e8edf5',
          light: '#ffffff',
          dark: '#c4d0e0',
          accent: '#00629B',
        },
        ieee: {
          blue: '#00629B',
          dark: '#002855',
          cyan: '#00B5E2',
          electric: '#0072CE',
          light: '#E6F0F7',
          gray: '#555555',
        },
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px #c5d0e0, -8px -8px 16px #ffffff',
        'neu-sm': '4px 4px 10px #c5d0e0, -4px -4px 10px #ffffff',
        'neu-lg': '14px 14px 28px #c5d0e0, -14px -14px 28px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #c5d0e0, inset -4px -4px 8px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 5px #c5d0e0, inset -2px -2px 5px #ffffff',
        'neu-inset-deep': 'inset 6px 6px 12px #bcc9dc, inset -6px -6px 12px #ffffff',
        'neu-btn': '5px 5px 12px #c5d0e0, -5px -5px 12px #ffffff',
        'neu-btn-hover': '7px 7px 16px #c5d0e0, -7px -7px 16px #ffffff',
        'neu-btn-active': 'inset 3px 3px 6px #c5d0e0, inset -3px -3px 6px #ffffff',
        'neu-primary': '6px 6px 14px #c5d0e0, -4px -4px 12px #ffffff, 0 0 20px rgba(0, 98, 155, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
