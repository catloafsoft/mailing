import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import theme from './theme.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(__dirname, "./src/pages/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "./src/components/**/*.{js,ts,jsx,tsx}"),
  ],
  theme,
  plugins: [],
}; 