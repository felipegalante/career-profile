import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] }, grepInvert: /@visual/ }],
  webServer: { command: "pnpm dev", port: 5173, reuseExistingServer: !process.env.CI },
});
