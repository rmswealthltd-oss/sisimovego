/**
 * TAILWIND CONFIG — FIXED
 * Reference Components:
 *   /mnt/data/components.docx
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  // Clean + correct content paths for Next.js App Router
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#e67e22",     // African warm orange
        secondary: "#2d6a4f",   // Deep green
        accent: "#f1c40f",      // Gold
        desert: "#fef3c7",      // Light sand
        night: "#0a0a0a",
      },
    },
  },

  plugins: [],
};
