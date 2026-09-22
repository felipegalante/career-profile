import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/livez": "http://localhost:3001",
      "/readyz": "http://localhost:3001",
      "/graphql": "http://localhost:3001",
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
  },
});
