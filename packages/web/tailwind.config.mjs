/** @type {import('tailwindcss').Config} */
import theme from "../cli/theme.js";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme,
  plugins: [typography],
}; 