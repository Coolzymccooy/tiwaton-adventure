import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(() => {
  return {
    plugins: [react()],

    server: {
      port: 3010,
      // Proxy frontend /api calls to backend (local only)
      proxy: {
        "/api": {
             target: "http://localhost:3600",
        changeOrigin: true,
        }
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  };
});


