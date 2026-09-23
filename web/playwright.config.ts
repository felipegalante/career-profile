import { defineConfig, devices } from "@playwright/test";

const dragSpec = /skills-drag\.spec\.ts/;

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, grepInvert: /@visual/ },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: dragSpec },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: dragSpec },
  ],
  webServer: { command: "pnpm dev", port: 5173, reuseExistingServer: !process.env.CI },
});
