import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  webServer: { command: "pnpm --dir web dev", port: 5173, reuseExistingServer: !process.env.CI },
});
