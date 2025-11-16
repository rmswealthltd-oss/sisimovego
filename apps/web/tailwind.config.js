module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/styles/**/*.{css,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2A7DF0",
          dark: "#1B56A8"
        }
      },
      animation: {
        fade: "fade 0.3s ease-in-out"
      },
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        }
      }
    }
  },
  plugins: []
};
