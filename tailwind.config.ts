import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui', // prefix for themes variables
      themes: {
        light: {
          colors: {
            background: '#f6fefe',
            foreground: '#021d1d',
            primary: {
              DEFAULT: '#0b7779',
              foreground: '#021d1d',
            },
            secondary: '#f269c0',
          }, // light theme colors
        },
        dark: {
          colors: {
            background: '#010909',
            foreground: '#e2fdfd',
            primary: {
              DEFAULT: '#86f2f4',
              foreground: '#021d1d',
            },
            secondary: '#960d64',
          }, // dark theme colors
        },
        // ... custom themes
      },
    }),
  ],
};
export default config;
