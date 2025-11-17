import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 🔥 CRITICAL FIX FOR REACT ROUTER 404s
  appType: "spa",

  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
