/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: "#010101",
        gray: "#A4A4A4",
        light_gray: "#F1F0EA",
        yellow: "#ECCF5E",
      },
    },
  },
  plugins: [daisyui],
};
