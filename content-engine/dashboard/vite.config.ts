import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// API'ye proxy: dashboard /api isteklerini içerik motoru sunucusuna yönlendirir.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: process.env.API_TARGET || "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
