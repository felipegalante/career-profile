import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { criterionTags } from "@career-profile/acceptance";

// Browser tests point the proxy at their own API; development uses the API from `pnpm dev`.
const apiOrigin = process.env.API_PROXY_TARGET ?? "http://localhost:3001";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/livez": apiOrigin,
      "/readyz": apiOrigin,
      "/graphql": apiOrigin,
    },
  },
  test: {
    // A test cites the acceptance criteria it proves as tags (`@AUTH-AC-001`). Declaring exactly the
    // criteria in the feature specs makes a tag that names no criterion fail the run.
    tags: criterionTags(),
    strictTags: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
